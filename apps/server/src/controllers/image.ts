import { Request, Response } from 'express';
import * as configcat from 'configcat-node';
import { BadRequestError } from 'openai/error';
require('dotenv').config();

import { configcatClient, openai } from '@utils/index';

export const Image = async (req: Request, res: Response) => {
  try {
    const { model, prompt, size = '1024x1024', n = 1 } = req.body;

    let isDallE3Enabled;

    if (!prompt) {
      return res.status(400).json({ success: false, err: 'Prompt not found' });
    }

    if (model === 'dall-e-3') {
      const user = new configcat.User(req.user.email);

      // The default user will be used in the evaluation process.
      isDallE3Enabled = await configcatClient.getValueAsync('enable-DALL-E-3', false, user);
    }

    const image = await openai.images.generate({
      response_format: 'url',
      model: isDallE3Enabled ? model : 'dall-e-2',
      prompt,
      n,
      size,
    } as any);
    const url = image.data;

    return res.status(200).json({ success: true, url, image });
  } catch (err) {
    console.error(err);
    if (err instanceof BadRequestError) {
      const openAiErr = err?.error as { message: string };

      if (err.code === 'content_policy_violation') {
        return res.status(400).json({ success: false, err: openAiErr?.message });
      }

      return res.status(500).json({ success: false, err: 'Something wrong with your prompt' });
    }

    return res.status(500).json({ success: false, err: 'Something went wrong' });
  }
};

export default Image;
