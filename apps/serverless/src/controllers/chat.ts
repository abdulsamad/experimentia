import { Context } from 'hono';
import { streamText, APICallError } from 'ai';

import { getAssistantConfig } from 'utils';

import { modelFactory } from '@models/factory';

const chat = async (c: Context) => {
  try {
    const { prompt, language, variation, model } = await c.req.json();

    if (!prompt) {
      return c.json({ success: false, err: 'Prompt not found' }, 400);
    }

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
      return c.json({ error: err.message }, 500);
    }

    console.error(err);
    return c.json({ error: 'Something went wrong!' }, 500);
  }
};

export default chat;
