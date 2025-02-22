import { Context } from 'hono';
import { experimental_generateImage as generateImage, APICallError } from 'ai';

import { openai } from '@models/index';

const image = async (c: Context) => {
  try {
    const { model, prompt, n = 1, quality, style, size = '1024x1024' } = await c.req.json();

    if (!prompt) {
      return c.json({ success: false, err: 'Prompt not found' }, 400);
    }

    const { image } = await generateImage({
      model: openai.image('dall-e-3'),
      prompt,
      n,
      size,
      aspectRatio: '16:9',
      providerOptions: {
        openai: {
          style,
          quality,
          b64_json: true,
        },
      },
    });

    const b64_json = image.base64;

    return c.json({ success: true, b64_json, image });
  } catch (err) {
    if (APICallError.isInstance(err)) {
      return c.json({ success: false, err: err.message }, 500);
    }

    console.error(err);
    return c.json({ success: false, err: 'Something went wrong' }, 500);
  }
};

export default image;
