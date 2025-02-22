import { serve } from '@hono/node-server';

import { app } from './index.js';

const PORT = process.env.PORT || 3001;

console.log(`Server is running on port ${PORT}`);

serve({ fetch: app.fetch, port: PORT });
