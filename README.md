# TFT Duos

Small Next.js app that ranks Teamfight Tactics Double Up duos from Riot match history.

The app resolves a fixed list of Riot IDs, finds the games they played together, filters Double Up matches for TFT set 16, and sorts duos by average placement.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Bun
- Turborepo
- Biome

## Requirements

- Bun 1.2+
- A Riot API key

## Setup

Install dependencies:

```bash
bun install
```

Create the app env file:

```bash
cp apps/web/.env.example apps/web/.env
```

Set your Riot API key in `apps/web/.env`:

```bash
RIOT_API_KEY=your_riot_api_key
```

Start the web app:

```bash
bun run dev:web
```

Or start the full workspace:

```bash
bun run dev
```

The app runs on [http://localhost:3000](http://localhost:3000) by default unless your local environment overrides the port.

## How It Works

- Riot accounts are resolved from Riot ID pairs defined in [`apps/web/src/app/page.tsx`](/home/florent/tft/apps/web/src/app/page.tsx)
- Shared match IDs are computed for every possible duo
- Match details are fetched from the Riot TFT Match API
- Only Double Up (`pairs`) matches from TFT set 16 are counted
- The final ranking is sorted by lowest average placement

## Customization

Update these constants in [`apps/web/src/app/page.tsx`](/home/florent/tft/apps/web/src/app/page.tsx) to track a different group:

- `REGION`
- `PLAYERS`

The Riot API calls and caching behavior live in [`apps/web/src/lib/getDuos.ts`](/home/florent/tft/apps/web/src/lib/getDuos.ts) and [`apps/web/src/lib/utils.ts`](/home/florent/tft/apps/web/src/lib/utils.ts).

## Scripts

- `bun run dev` runs the Turborepo workspace in development
- `bun run dev:web` runs only the Next.js app
- `bun run build` builds the workspace
- `bun run check-types` runs TypeScript checks
- `bun run check` runs Biome checks and writes fixes

## Project Structure

```text
tft/
├── apps/
│   └── web/        # Next.js frontend and Riot API integration
├── packages/
│   └── config/     # Shared TypeScript config
├── package.json
└── turbo.json
```
