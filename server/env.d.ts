declare namespace NodeJS {
	interface ProcessEnv {
		PORT: number;
		CONFIGCAT_API_KEY: string;
		OPENAI_API_KEY: string;
		AUTH0_ISSUER_BASE_URL: string;
		AUTH0_AUDIENCE: string;
	}
}

// Modifying Express Request
declare namespace Express {
	export interface Request {
		user?: {
			email: string;
		};
	}
}
