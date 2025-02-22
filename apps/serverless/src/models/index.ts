import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

// Initialize Gemini client
const googleClient = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const gemini = googleClient('gemini-1.5-flash', {
  safetySettings: [
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_ONLY_HIGH',
    },
  ],
});

// Initialize OpenAI client
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
