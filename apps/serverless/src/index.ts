import { Hono } from 'hono';
import { streamHandle, type LambdaEvent, type LambdaContext } from 'hono/aws-lambda';
import { logger } from 'hono/logger';
import { type JWTPayload } from 'jose';

import chat from '@controllers/chat';
import { authMiddleware } from '@middlewares/index';

import type { User } from '@types';

export type AppContext = {
  Bindings: {
    event: LambdaEvent;
    lambdaContext: LambdaContext;
  };
  Variables: {
    user: User;
    payload: JWTPayload;
  };
};

export const app = new Hono<AppContext>();

app.get('/', (c) => c.text('Hono + Lambda + AI'));

app.use(logger());
app.use(authMiddleware);

app.post('/chat', chat);

export const handler = streamHandle(app);
