import { Context, Next } from 'hono';
import { jwtVerify, createRemoteJWKSet } from 'jose';

// Clerk configuration
const ISSUER_URL = process.env.CLERK_ISSUER_BASE_URL;
const JWKS_URI = `${ISSUER_URL}/.well-known/jwks.json`;

// Create a Remote JWKS client
const JWKS = createRemoteJWKSet(new URL(JWKS_URI));

// JWT Authentication Middleware
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  const body = await c.req.json();

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER_URL,
      algorithms: ['RS256'],
    });

    c.set('user', body?.user);
    c.set('payload', payload);

    await next();
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};
