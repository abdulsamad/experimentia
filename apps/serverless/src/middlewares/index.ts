import { createMiddleware } from 'hono/factory';
import { jwtVerify, createRemoteJWKSet } from 'jose';

import { AppContext } from '@/index';

// Clerk configuration
const ISSUER_URL = process.env.CLERK_ISSUER_BASE_URL;
const JWKS_URI = `${ISSUER_URL}/.well-known/jwks.json`;

// Create a Remote JWKS client
const JWKS = createRemoteJWKSet(new URL(JWKS_URI));

// JWT Authentication Middleware
export const authMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const body = await c.req.json();
  const requestId = c.env.requestContext.requestId;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn(`[AUTH][${requestId}] Missing or invalid Authorization header`);
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    console.info(`[AUTH][${requestId}] Verifying JWT token`);

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER_URL,
      algorithms: ['RS256'],
    });

    c.set('user', body.user);
    c.set('payload', payload);

    console.info(`[AUTH][${requestId}] Authentication successful - ` + `User: ${body.user.id}`);

    await next();
  } catch (err) {
    console.error(
      `[AUTH][${requestId}] Token verification failed - ` +
        `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
    );
    return c.json({ error: 'Invalid token' }, 401);
  }
});
