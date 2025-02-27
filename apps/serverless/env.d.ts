/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    ALLOWED_ORIGINS: string;
    AUTH0_BASE_URL: string;
    AUTH0_AUDIENCE: string;
    AUTH0_ISSUER_BASE_URL: string;
    GEMINI_API_KEY: string;
    OPENAI_API_KEY: string;
    ANTHROPIC_API_KEY: string;
    MISTRAL_API_KEY: string;
  }
}
