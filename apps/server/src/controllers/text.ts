import { Request, Response } from 'express';
import * as configcat from 'configcat-node';
import { BadRequestError } from 'openai/error';
require('dotenv').config();

import { promptMapper } from 'utils';

import { configcatClient, openai } from '@utils/index';

export const chat = async (req: Request, res: Response) => {
  try {
    const { prompt, language, type, model } = req.body;

    let isGPT4Enabled;

    if (!prompt) {
      return res.status(400).json({ success: false, err: 'Prompt not found' });
    }

    if (model.includes('gpt-4')) {
      const user = new configcat.User(req.user.email);
      isGPT4Enabled = await configcatClient.getValueAsync('enable-GPT-4', false, user);
    }

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: promptMapper(type, language).prompt },
        { role: 'user', content: prompt },
      ],
      model: isGPT4Enabled ? model || 'gpt-3.5-turbo' : 'gpt-3.5-turbo',
      stream: true,
      temperature: 0.5,
    });

    for await (const part of chatCompletion) {
      const choice = part.choices[0];
      const text = choice.delta?.content || '';

      if (choice.finish_reason === 'stop') {
        res.write(text);
      }

      res.write(text);
    }

    return res.end();
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

export default chat;
