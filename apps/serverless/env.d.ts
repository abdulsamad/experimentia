/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    ALLOWED_ORIGINS: string;
    CLERK_ISSUER_BASE_URL: string;
    GEMINI_API_KEY: string;
    OPENAI_API_KEY: string;
    ANTHROPIC_API_KEY: string;
    MISTRAL_API_KEY: string;
    DEEPSEEK_API_KEY: string;
    FAL_API_KEY: string;
  }
}
