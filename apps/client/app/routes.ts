import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  // route('api', '.', [route('token', 'routes/api/token.ts')]),
  // route(':threadId', 'routes/home.tsx'),
] satisfies RouteConfig;
