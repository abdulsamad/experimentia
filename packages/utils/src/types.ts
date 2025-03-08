import { GoogleGenerativeAIProvider } from '@ai-sdk/google';
import { OpenAIProvider } from '@ai-sdk/openai';
import { AnthropicProvider } from '@ai-sdk/anthropic';
import { MistralProvider } from '@ai-sdk/mistral';
import { DeepSeekProvider } from '@ai-sdk/deepseek';
import { FalProvider } from '@ai-sdk/fal';

import { variations, supportedModels } from './models';
import { languages } from './languages';

export type enabledModelsType = (typeof supportedModels)[number]['name'];

export type availableModelsType =
  | Parameters<GoogleGenerativeAIProvider['chat']>[0]
  | Parameters<OpenAIProvider['chat']>[0]
  | Parameters<AnthropicProvider['languageModel']>[0]
  | Parameters<MistralProvider['chat']>[0]
  | Parameters<DeepSeekProvider['languageModel']>[0]
  | Parameters<FalProvider['imageModel']>[0];

export type supportedLanguagesType = (typeof languages)[number]['code'];

export type variationsType = (typeof variations)[number]['code'];
