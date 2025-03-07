import { Context } from 'hono';
import { streamText, APICallError } from 'ai';

import { getAssistantConfig } from 'utils';

import { modelFactory } from '@models/factory';
import { AppContext } from '@/index';

const chat = async (c: Context<AppContext>) => {
  const startTime = Date.now();
  const requestId = c.env.lambdaContext.awsRequestId;
  const user = c.get('user');

  try {
    const { prompt, language, variation, model } = await c.req.json();

    if (!prompt) {
      console.warn('[CHAT] Missing prompt in request');
      return c.json({ success: false, err: 'Prompt not found' }, 400);
    }

    console.info(
      `[CHAT][${requestId}] New request - ` +
        `User: ${user.id}, ` +
        `Model: ${model}, ` +
        `Language: ${language}, ` +
        `Variation: ${variation}, ` +
        `Prompt length: ${prompt.length}`
    );

    const modelInstance = modelFactory.createModel(model);
    const config = getAssistantConfig(variation, language);

    const result = streamText({
      model: modelInstance,
      messages: [
        { role: 'system', content: config.prompt },
        { role: 'user', content: prompt },
      ],
      temperature: config.temperature,
      seed: config.seed,
      tools: config.tools,
      toolChoice: config.toolChoice,
      toolCallStreaming: config.toolCallStreaming,
      maxTokens: config.maxTokens,
      topP: config.topP,
      frequencyPenalty: config.frequencyPenalty,
      presencePenalty: config.presencePenalty,
      stopSequences: config.stopSequences,
      onError: (event) => {
        console.error(`[CHAT][${requestId}] Stream error for user ${user.id}: ${event.error}`);
        c.json({ success: false, err: event.error }, 500);
      },
      onFinish: ({ usage }) => {
        const duration = Date.now() - startTime;

        console.info(
          `[CHAT][${requestId}] Request completed - ` +
            `Duration: ${duration}ms, ` +
            `User: ${user.id} ` +
            `Total tokens: ${usage.totalTokens}`
        );
      },
    });

    // Create a ReadableStream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            // Send each chunk as a payload
            const payload = chunk;
            controller.enqueue(new TextEncoder().encode(payload + '\n'));
          }
          controller.close();
        } catch (error) {
          console.error('[CHAT] Stream processing error:', error);
          controller.error(error);
        }
      },
    });

    // Return streaming response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    if (APICallError.isInstance(err)) {
      console.error(`[CHAT][${requestId}] API Call Error for user ${user.id}: `, err.message);
      return c.json({ error: err.message }, 500);
    }

    console.error(`[CHAT][${requestId}] Unexpected error for user ${user.id}: `, err);
    return c.json({ error: 'Something went wrong!' }, 500);
  }
};

export default chat;
