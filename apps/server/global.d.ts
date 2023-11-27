declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    CONFIGCAT_API_KEY: string;
    OPENAI_API_KEY: string;
    AUTH0_ISSUER_BASE_URL: string;
    AUTH0_AUDIENCE: string;
    ALLOWED_ORIGIN: string;
  }
}

// Modifying Express Request
declare namespace Express {
  export interface Request {
    user: {
      nickname: string;
      name: string;
      picture: string;
      updated_at: string;
      email: string;
      email_verified: boolean;
      sub: string;
      sid: string;
    };
  }
}
