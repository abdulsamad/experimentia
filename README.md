## Experimentia

Welcome to Experimentia, where I explore the OpenAI's API! Below, you'll find information on technologies used, supported browsers, installation instructions, and how to set up the environment. Don't bother why I chose this name—I'm just rolling with it! 🤷‍♂️

## Technologies

- Turborepo
- TypeScript
- Next.js
- shadcn (Radix UI)
- Jotai
- Auth0
- Config Cat
- Node.js (TypeScript)
- Express
- Open AI APIs

## Support

Voice input currently supports only Chrome and webkit-based browsers. Make sure you are using one of these browsers for the best experience.

## Installation

To get started with Experimentia, follow these simple steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/abdulsamad/experimentia.git
   ```

2. **Install Dependencies:**
   ```bash
   cd experimentia
   pnpm install
   ```

3. **Environment Variables:**
   Create a `.env` file in both the `apps/client` and `apps/server` directories. Copy the required variables from `apps/client/.env.example` and `apps/server/.env.example`.

## Development

To start the local server and begin development:

```bash
pnpm dev
```