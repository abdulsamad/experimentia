import { Hono } from 'hono';
import { streamHandle } from 'hono/aws-lambda';
import { logger } from 'hono/logger';

import chat from 'controllers/chat';
import { authMiddleware } from '@middlewares/index';

export const app = new Hono();

app.use(logger());
app.use(authMiddleware);

app.get('/', (c) => c.text('Hono + Lambda + Gemini'));

app.post('/chat', chat);

export const handler = streamHandle(app);
