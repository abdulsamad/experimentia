import OpenAI from 'openai';

import { supportedLanguages, variations } from '../types';

import promptMapper from './promptMapper';

interface IModelMapperBase {
  variation: variations;
  language: supportedLanguages;
  prompt: string;
}

type IModelMapper = IModelMapperBase &
  Pick<
    OpenAI.Chat.ChatCompletionCreateParams,
    | 'model'
    | 'temperature'
    | 'max_tokens'
    | 'tools'
    | 'tool_choice'
    | 'stop'
    | 'top_p'
    | 'stream'
    | 'seed'
  >;

// TODO: Not implemented yet
export const modelMapper = ({
  language,
  model,
  variation,
  prompt,
  temperature,
  max_tokens,
  tools,
  tool_choice,
  stop,
  top_p,
  stream,
  seed,
}: IModelMapper): OpenAI.Chat.ChatCompletionCreateParams => {
  switch (variation) {
    case 'munna':
      return {
        model,
        temperature,
        max_tokens,
        stop,
        top_p,
        seed,
        tools,
        tool_choice,
        stream,
        messages: [
          { role: 'system', content: promptMapper(variation, language).prompt },
          { role: 'user', content: prompt },
        ],
      };

    case 'grammar-corrector':
      return {
        model,
        temperature,
        max_tokens,
        stop,
        top_p,
        seed,
        tools,
        tool_choice,
        stream,
        messages: [
          { role: 'system', content: promptMapper(variation, language).prompt },
          { role: 'user', content: prompt },
        ],
      };

    default:
      return {
        model,
        temperature,
        max_tokens,
        stop,
        top_p,
        seed,
        tools,
        tool_choice,
        stream,
        messages: [
          { role: 'system', content: promptMapper(variation, language).prompt },
          { role: 'user', content: prompt },
        ],
      };
  }
};

export default modelMapper;
