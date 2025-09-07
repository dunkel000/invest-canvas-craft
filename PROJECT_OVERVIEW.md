# Project Overview

## Purpose
An investment canvas application for planning and analysing portfolios. The app lets users design custom flows of assets and cash, track performance and fetch market data from external providers. The front‑end is built with Vite, React, TypeScript and Tailwind CSS while Supabase powers authentication, the database and edge functions.

## Features
- User authentication, profiles and role management through Supabase.
- Portfolio and asset tracking with allocation and market data fields.
- Drag‑and‑drop flows for modelling cash movements and calculations.
- Edge functions to import S&P 500 and Yahoo Finance data.
- Responsive UI using shadcn/ui components and Tailwind’s dark mode.

## Stack and Tooling
- **Vite + React** for the development server and build tooling.
- **TypeScript** for type‑safe front‑end code.
- **Tailwind CSS** utility‑first styling.
- **shadcn/ui** component library.
- **@tanstack/react-query** for async data management.
- **Supabase** backend services and edge functions.
- **ESLint** for consistent code quality.

## Project Structure
```
src/              application code
  components/     reusable UI components
  pages/          route-level pages
  hooks/          custom React hooks
  integrations/   wrappers for external services (e.g. Supabase client)
  lib/            utilities and helpers
public/           static assets served as-is
supabase/         configuration, SQL migrations and edge functions
```

## Scripts
Common npm scripts are provided for development and production:

```bash
npm run dev        # start development server on http://localhost:8080
npm run build      # create production build in dist/
npm run build:dev  # non-minified development build
npm run preview    # preview the production build
npm run lint       # run ESLint over the project
```

## Environment Variables
The `.env` file defines required Supabase settings:

- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`

## Key Configuration

### Vite
The Vite config exposes the dev server on port `8080`, tags components during development and sets up the `@` alias to `src`【F:vite.config.ts†L1-L21】.

### Tailwind CSS
Tailwind scans the pages, components, app and src directories and enables dark mode via the `class` strategy【F:tailwind.config.ts†L1-L10】.

### ESLint
ESLint combines JavaScript and TypeScript recommended rules, applies React hooks and refresh plugins and ignores the `dist` output folder【F:eslint.config.js†L1-L27】.

### Supabase
Supabase is configured with project id `gxcnoostsfjylryzkzzb`, local site URL and enabled auth/email settings【F:supabase/config.toml†L1-L24】.

The generated Supabase client uses the project URL and publishable key and persists sessions in `localStorage`【F:src/integrations/supabase/client.ts†L1-L17】.

### Edge Functions
Two edge functions ship with the project:
- **fetch-sp500** – fetches basic data for selected S&P 500 tickers using Yahoo Finance【F:supabase/functions/fetch-sp500/index.ts†L1-L20】.
- **populate-yahoo-assets** – populates the asset universe table with detailed Yahoo Finance data for popular tickers【F:supabase/functions/populate-yahoo-assets/index.ts†L1-L27】.

## Database
The Supabase database models profiles, portfolios, assets, flows, cashflows and more. See `DATABASE_SCHEMA.md` for a table-by-table breakdown of the SQL migrations.

## Supabase Configuration
The `supabase/config.toml` file also enables storage and configures JWT expiry, password length and redirect URLs for auth flows【F:supabase/config.toml†L1-L24】.

## Development Notes
- Components live under `src/components` while pages are under `src/pages`.
- Integrations with external services live under `src/integrations`.
- Supabase edge functions are stored in `supabase/functions` and deployed via `supabase functions deploy <name>`.
- Linting via `npm run lint`; the project has no unit tests yet.

