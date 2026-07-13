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
- A game has 7 rounds (each with a fixed combination name, e.g. "Dos tríos", "Tres escaleras" — see REQS.md) and 2–6 players; each player gets a name and a randomly assigned color at creation, and the game records its creation date/time.
- During a game, the user enters each player's points per round, including negative scores (e.g. -10).
- The app must show a history of past games.

## Change log

After making any code change in this repo, append a dated entry below summarizing what changed and why. Keep entries terse (1–2 lines each); newest date on top, newest entry within a date at the bottom.

### 2026-07-12
- Fixed `--font-sans: var(--font-sans)` circular reference in `globals.css` (should reference `--font-geist-sans`), which made the browser fall back to Times instead of Geist.
- `ScoreboardTable` now sorts columns by ascending total score after each round save (lowest total = leading, per Continental's scoring rules).
- `ScoreboardTable` switched to `table-fixed` with a fixed-width sticky "Ronda" column so player columns split remaining space equally — fixes color-circle avatars sitting flush against the table edge, which `table-auto` caused unevenly (worse with long names or more players). Added `overflow-hidden` + `max-w-full truncate` on header cells since fixed narrow columns no longer auto-clip overflowing name text.
- Corrected round count: Continental has 7 rounds, not 8 (`MAX_ROUNDS` in `src/lib/game.ts` was wrong). Added `ROUND_NAMES` (the combination per round, per REQS.md) and surfaced it in the round header, the score-entry sheet title, and as a hover tooltip on the scoreboard's "Ronda" cells.
- Added `endGame()` in `src/lib/game.ts` and a "Terminar juego" button (behind an `AlertDialog` confirm, since it's irreversible) below "Agregar ronda" on the game page, so players can end a game before all 7 rounds are played — winner is whoever has the lowest total at that point.

### 2026-07-13
- Added `deleteGame()` and `deleteAllGames()` to `src/lib/storage.ts`. Historial page and each `GameCard` now have red-toned `AlertDialog` confirms (destructive button variant, `AlertDialogMedia`/title/description in `text-destructive`) to delete one game or wipe the whole history. Since `GameCard` is wrapped in a `Link`, its trash-icon trigger calls `preventDefault`/`stopPropagation` so opening the confirm dialog doesn't navigate to the game page.
- Fixed: canceling (or backdrop-dismissing) the per-game delete `AlertDialog` was navigating to `/juego/{id}` anyway. Cause: the dialog's content renders via a React portal, and React bubbles clicks along the *component* tree, not the DOM tree — so a click on the portaled Cancel/backdrop still bubbled up to the wrapping `Link`. Fixed by wrapping the whole `AlertDialog` in `GameCard` with a `<div onClick={(e) => e.stopPropagation()}>`.
- Added shadcn `tooltip` component and wrapped `RootLayout` in `TooltipProvider` (required by base-ui). Player avatars in `GameCard` (historial list) now show the player's name in a tooltip on hover — trigger renders as a plain `<span>` (not the default `<button>`) wrapping `PlayerAvatar`, so no extra interactive semantics are added to the avatar circle.
- App is mobile-first (no hover), so hover-only tooltip above was mobile-dead. Base UI's focus-open path also requires actual CSS `:focus-visible`, which pointer/touch-driven focus doesn't usually satisfy, so simply making the trigger focusable wasn't enough either. Added `PlayerAvatarTooltip` in `game-card.tsx`: a controlled `Tooltip` (`open`/`onOpenChange` state) whose trigger toggles `open` directly on click/tap, independent of Base UI's hover/focus-visible gating — works on both mobile tap and desktop click, hover still works too since Base UI's internal open events flow through the same `onOpenChange`.
