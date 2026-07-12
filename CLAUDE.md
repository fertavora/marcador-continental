# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Communication style

At the start of every session in this repo, invoke the `caveman` skill (full intensity) and keep it active for all chat responses. Code, commits, and PRs are still written normally — caveman mode only compresses prose replies to the user.

## Project status

Greenfield project. The app itself has not been built yet — only the Next.js/shadcn scaffold exists. The product spec lives in [REQS.md](REQS.md); read it before implementing features, as it is currently the only source of truth for game rules and UI requirements.

## Commands

```bash
npm run dev      # start dev server (Turbopack) at http://localhost:3000
npm run build    # production build (also runs the TypeScript check)
npm run start    # serve the production build
npm run lint     # ESLint (flat config: eslint-config-next core-web-vitals + typescript)
```

No test runner is configured yet. If tests are added, update this section with how to run a single test.

## Architecture

- **Next.js 16 (App Router) + React 19 + TypeScript**, source under `src/app`. Routes are file-based under `src/app/**`; this is a pinned major version with breaking changes from older Next.js — see the AGENTS.md import above before assuming API behavior from training data, and check `node_modules/next/dist/docs/01-app` for the current App Router docs when in doubt.
- **Styling: Tailwind CSS v4**, configured via `@import` directives directly in [src/app/globals.css](src/app/globals.css) (no `tailwind.config.*` file — v4 is CSS-first). Theme tokens (colors, radii) are defined there as CSS custom properties and consumed through the `@theme inline` block; dark mode is the `.dark` class variant.
- **UI components: shadcn/ui** (`style: base-nova`, base color `neutral`), installed via the `shadcn` CLI into `src/components/ui`. It's built on `@base-ui/react` primitives (not Radix) and `lucide-react` icons. Add new primitives with `npx shadcn@latest add <component>` rather than hand-rolling them. Path aliases (`@/components`, `@/lib`, `@/hooks`, `@/components/ui`) are declared in [components.json](components.json) and map through the `@/*` TS path alias in [tsconfig.json](tsconfig.json).
- `src/lib/utils.ts` exports the shadcn `cn()` helper (clsx + tailwind-merge) — use it for conditional class composition instead of manual string concatenation.

## Product requirements (from REQS.md)

Marcador Continental is a scoreboard for the Spanish card game "Continental":

- Mobile-first, responsive, **UI text in Spanish**.
- Game state persists in browser cookies; the app must show a cookie-consent modal and cannot function if cookies are declined.
- A game has 8 rounds and 2–6 players; each player gets a name and a randomly assigned color at creation, and the game records its creation date/time.
- During a game, the user enters each player's points per round, including negative scores (e.g. -10).
- The app must show a history of past games.
