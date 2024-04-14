import OpenAI from 'openai';
import { BadRequestError } from 'openai/error';
import { ChatCompletionCreateParams } from 'openai/resources';
import * as configcat from 'configcat-node';

import { promptMapper } from 'utils';
import { supportedLanguages, variations } from 'utils/types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const configcatClient = configcat.getClient(process.env.CONFIGCAT_API_KEY);

interface RequestBody {
  model: ChatCompletionCreateParams['model'];
  prompt: string;
  language: supportedLanguages;
  type: variations;
  email: string;
}

export const handler: any = async (event, context) => {
  try {
    const body = event.queryStringParameters as RequestBody;
    const { prompt, language, type, model, email } = body;

    let isGPT4Enabled = false;

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, err: 'Prompt not found' }),
      };
    }

    if (model === 'gpt-4') {
      const user = new configcat.User(email);
      isGPT4Enabled = await configcatClient.getValueAsync('enable-GPT-4', false, user);
    }

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: promptMapper(type, language).prompt },
        { role: 'user', content: prompt },
      ],
      model: isGPT4Enabled ? model || 'gpt-3.5-turbo' : 'gpt-3.5-turbo',
      temperature: 0.5,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, chatCompletion }),
    };
  } catch (err) {
    if (err instanceof BadRequestError) {
      const openAiErr = err?.error as { message: string };

      if (err.code === 'content_policy_violation') {
        return {
          statusCode: 400,
          body: JSON.stringify({ success: false, err: openAiErr?.message }),
        };
      }

      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          err: 'Something wrong with your prompt',
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        err: 'Something went wrong',
      }),
    };
  }
};
