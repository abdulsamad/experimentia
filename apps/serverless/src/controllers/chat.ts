import { Context } from 'hono';
import { streamText, APICallError } from 'ai';

import { gemini } from '@models/index';

import { promptMapper } from 'utils';

const chat = async (c: Context) => {
  try {
    const { prompt, language, variation, model } = await c.req.json();

    if (!prompt) {
      return c.json({ success: false, err: 'Prompt not found' }, 400);
    }

    const result = streamText({
      model: gemini,
      messages: [
        { role: 'system', content: promptMapper(variation, language).prompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
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
