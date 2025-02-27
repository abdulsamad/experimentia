import { createGoogleGenerativeAI, GoogleGenerativeAIProvider } from '@ai-sdk/google';
import { createOpenAI, OpenAIProvider } from '@ai-sdk/openai';
import { createAnthropic, AnthropicProvider } from '@ai-sdk/anthropic';
import { createMistral, MistralProvider } from '@ai-sdk/mistral';

// Initialize Gemini client
export const googleClient = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Initialize OpenAI client
export const openAiClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const anthropicClient = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const mistralClient = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export type ModelName =
  | Parameters<GoogleGenerativeAIProvider['chat']>[0]
  | Parameters<OpenAIProvider['chat']>[0]
  | Parameters<AnthropicProvider['languageModel']>[0]
  | Parameters<MistralProvider['chat']>[0];
