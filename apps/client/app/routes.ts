import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('./layouts/home.tsx', [
    // route(':threadId', 'routes/home.tsx'),
    index('routes/home.tsx'),
  ]),
] satisfies RouteConfig;
