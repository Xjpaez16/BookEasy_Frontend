# BookEasy Frontend — Agenda Pro

Web client for the multi-tenant appointments SaaS.

## Stack
React + TypeScript + Vite · Tailwind + shadcn/ui conventions · TanStack Query · React Hook Form + Zod · React Router.

## Architecture (Feature-Sliced)
```
src/
  app/        providers (QueryClient) + routes (composition root)
  pages/      route-level screens, compose widgets/features
  widgets/    composite UI blocks (calendar, dashboard metrics)
  features/   user actions (auth, create appointment, ...)
  entities/   business concepts + their API access & Zod schemas
  shared/     api client, ui tokens, lib, config — generic reusable code only
```

## Rules
- No `fetch` directly from pages/components — go through `shared/api/client` via entity/feature modules.
- Server state via TanStack Query; UI-only state local.
- Forms with React Hook Form + Zod.
- Every component handles loading / empty / error / success / disabled states.
- Mobile-first and accessible HTML.
- Auth tokens never in localStorage (HttpOnly cookies).

## Getting started
```bash
cp .env.example .env
npm install
npm run dev
```

## Scripts
`dev` · `build` · `preview` · `typecheck` · `lint` · `format` · `test`
