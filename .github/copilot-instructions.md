# Copilot instructions for Uni Route

## Project description

- Uni Route is a **complete refactor** of a legacy Angular traceroute-learning app into a modern **React-based static web app**.
- The goal of the project is to help users and students analyze **local traceroutes** produced on their own machines and **global traceroutes** gathered from public looking glass services in different continents.
- The current product keeps the educational focus of the original app, but replaces the old implementation with a modern SPA, a shared parsing domain, improved visualizations, and a GitHub Pages deployment flow based on GitHub Actions.
- The legacy Angular codebase is still preserved in `legacy/angular-route/` for reference, but it is not the active application and should not be treated as the source of truth for new work.

## Core technologies

- Frontend: **Vite + React + TypeScript**
- Package manager: **pnpm**
- Routing: **react-router-dom**
- UI system: **shadcn/ui**
- Maps: **mapcn** components backed by **MapLibre**
- Charts: **Recharts**
- Validation/parsing helpers: **Zod**
- Testing: **Vitest** + **Testing Library**
- Deployment: **GitHub Actions** publishing to **GitHub Pages**

## Build, test, and lint

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Lint: `pnpm lint`
- Run all tests: `pnpm test`
- Run coverage: `pnpm test:coverage`
- Run a single test file: `pnpm vitest run src/lib/traceroute.test.ts`
- Run a single test by name: `pnpm vitest run src/lib/traceroute.test.ts -t "computes private ranges correctly"`
- Production build: `pnpm build`
- Preview production build: `pnpm preview`

## High-level architecture

- This repo is a **static Vite + React + TypeScript SPA** deployed to **GitHub Pages**. The Pages path is `/route/`, so routing depends on **both** `base: '/route/'` in `vite.config.ts` and `BrowserRouter basename={import.meta.env.BASE_URL}` in `src/App.tsx`.
- The active app is the React code under `src/`. The previous Angular app is preserved only as historical reference in `legacy/angular-route/` and is excluded from linting and Vitest.
- This was not a framework upgrade from Angular to newer Angular versions; it was a **full replacement/refactor**. When making changes, prefer the new React architecture instead of trying to revive Angular-era patterns.
- `src/App.tsx` lazily loads the top-level pages (`HomePage`, `LocalPage`, `GlobalPage`, `NotFoundPage`) and wraps them in `AppShell`, which contains the shared navigation and layout chrome.
- The core domain logic lives in `src/lib/traceroute.ts`. It is the canonical place for:
  - parsing Windows and Unix-like traceroute output
  - extracting destinations, hops, latency samples, and warnings
  - marking private/missing IPs
  - geolocation enrichment via IPinfo, ipgeolocation.io, or the browser-compatible ipapi.co fallback
  - derived metrics, chart data, and map data
- `src/lib/global-tools.ts` is the curated catalog for Route Global. Continent tabs and suggested parser profiles come from this file, not from page-local constants.
- The Local and Global pages are thin orchestration layers: they collect raw input, choose a parser profile, call `parseTrace`, then call `enrichTraceWithGeo`, and pass the result into shared results components.
- Route Local is intentionally browser-safe: users paste traceroute output or upload a text file instead of executing OS traceroute directly from the browser.
- Route Global is based on curated external looking glass tools grouped by continent. The app opens those tools externally, then normalizes the pasted output locally in the SPA.
- Visualization is intentionally split:
  - `src/components/trace-results.tsx` renders shared summary and table UI
  - `src/components/trace-map-card.tsx` renders the map
  - `src/components/trace-latency-card.tsx` renders the chart
  - Vite manual chunking in `vite.config.ts` keeps MapLibre and Recharts in separate vendor bundles
- CI is defined in `.github/workflows/ci.yml`. Pull requests and pushes to `master` run install, lint, tests, and build; pushes to `master` also upload the Pages artifact and deploy.

## Key conventions

- Use the `@` path alias for app imports (`@/components`, `@/lib`, `@/pages`). The alias is configured in both TypeScript and Vite.
- Keep traceroute parsing and geolocation logic in `src/lib/traceroute.ts`; do not duplicate parsing heuristics inside page components.
- Treat `src/components/ui/*` as generated shadcn/mapcn registry code unless a change is truly necessary. ESLint already relaxes a couple of rules specifically for that generated UI directory.
- Use named exports for page components (`export function LocalPage()`, etc.); `src/App.tsx` relies on lazy imports that map named exports to defaults.
- The app is dark-first: `src/main.tsx` forces the `dark` class on `document.documentElement`, and the UI styling assumes that default.
- Tests currently run only from `src/**/*.{test,spec}.{ts,tsx}`. If you add tests for active code, place them under `src/`; `legacy/**` is intentionally excluded.
- Route Global should stay data-driven. When changing continent/tool behavior, update `src/lib/global-tools.ts` first so the UI and parser profile suggestions stay consistent.
- Geolocation should preserve explicit states (`resolved`, `private`, `missing-ip`, `not-found`, `provider-unconfigured`, `error`) rather than silently dropping failed hops.
- If you change deployment or routing behavior, verify the GitHub Pages assumptions together: Vite base path, router basename, and the workflow artifact deploy.
