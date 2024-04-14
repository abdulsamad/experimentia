import OpenAI from 'openai';
import { BadRequestError } from 'openai/error';
import { ImageGenerateParams } from 'openai/resources';
import * as configcat from 'configcat-node';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const configcatClient = configcat.getClient(process.env.CONFIGCAT_API_KEY);

interface RequestBody {
  model: ImageGenerateParams['model'];
  prompt: string;
  n: ImageGenerateParams['n'];
  quality: ImageGenerateParams['quality'];
  style: ImageGenerateParams['style'];
  size: ImageGenerateParams['size'];
  email: string;
}

export const handler: any = async (event, context) => {
  try {
    const body = event.queryStringParameters as RequestBody;
    const { model, prompt, n = 1, quality, style, size = '1024x1024', email } = body;

    let isDallE3Enabled = false;

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ err: 'Prompt not found' }),
      };
    }

    if (model === 'dall-e-3') {
      const user = new configcat.User(email);

      // The default user will be used in the evaluation process.
      isDallE3Enabled = await configcatClient.getValueAsync('enable-DALL-E-3', false, user);
    }

    const image = await openai.images.generate({
      response_format: 'url',
      model: isDallE3Enabled ? model : 'dall-e-2',
      prompt,
      n,
      size,
      quality: isDallE3Enabled && model === 'dall-e-3' ? quality : undefined,
      style,
    });

    const b64_json = image.data[0].b64_json;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, b64_json, image }),
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
