# Project Overview

This project is an investment canvas application built with Vite, React, TypeScript and Tailwind CSS. It leverages Supabase for authentication, database and edge functions.

## Stack and Tooling
- **Vite + React**: fast development server and build tooling.
- **Tailwind CSS** for utility-first styling.
- **shadcn/ui** components.
- **Supabase** for backend services and edge functions.
- **ESLint** and TypeScript for consistent code quality.

## Scripts
The project defines common npm scripts:

```bash
npm run dev       # start development server
npm run build     # create production build
npm run lint      # run ESLint over the project
```

## Key Configuration

### Vite
The Vite configuration exposes the dev server on port `8080`, tags components during development, and sets up an alias `@` for the `src` directory【F:vite.config.ts†L1-L21】.

### Tailwind CSS
Tailwind scans pages, components, app and src directories and enables dark mode via the `class` strategy【F:tailwind.config.ts†L1-L10】.

### ESLint
ESLint combines JavaScript and TypeScript recommended rules, applies React hooks and refresh plugins, and ignores the `dist` output【F:eslint.config.js†L1-L27】.

### Supabase
Supabase is configured with project id `gxcnoostsfjylryzkzzb`, local site URL and enabled auth/email settings【F:supabase/config.toml†L1-L24】.

The generated Supabase client is set up with the project URL and publishable key and persists sessions in `localStorage`【F:src/integrations/supabase/client.ts†L1-L17】.

### Edge Functions
Two Supabase Edge Functions are included:
- **fetch-sp500** – fetches basic data for selected S&P 500 tickers using Yahoo Finance【F:supabase/functions/fetch-sp500/index.ts†L1-L20】.
- **populate-yahoo-assets** – populates the asset universe table with detailed Yahoo Finance data for popular tickers【F:supabase/functions/populate-yahoo-assets/index.ts†L1-L27】.

## Supabase Configuration
The `supabase/config.toml` file also enables storage and configures JWT expiry, password length, and redirect URLs for auth flows【F:supabase/config.toml†L1-L24】.

## Development Notes
- Components live under `src/components` while pages are under `src/pages`.
- Integrations with external services live under `src/integrations`.
- Supabase Edge Functions are stored in `supabase/functions` and deployed via `supabase functions deploy <name>`.

