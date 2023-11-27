import { Request, Response } from 'express';
import * as configcat from 'configcat-node';
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

    if (model === 'gpt-4') {
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
    return res.status(500).json({ success: false, err: 'Something went wrong' });
  }
};

export default chat;
