import { Context, Next } from 'hono';
import { jwtVerify, createRemoteJWKSet } from 'jose';

// Auth0 configuration
const issuer = process.env.AUTH0_ISSUER_BASE_URL;
const audience = process.env.AUTH0_AUDIENCE;
const jwksUri = `${issuer}.well-known/jwks.json`;

// Create a JWKS client
const JWKS = createRemoteJWKSet(new URL(jwksUri));

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
      issuer,
      audience,
      algorithms: ['RS256'],
    });

    c.set('user', body?.user);
    c.set('payload', payload);

    await next();
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};
