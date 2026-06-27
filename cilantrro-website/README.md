# Cilantrro – Luxury Rooftop Dining

A clean Vite + React + TypeScript project for the Cilantrro restaurant website.

## Tech stack

- **Vite 5** (build tool / dev server)
- **React 18** + TypeScript
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Radix UI** + **lucide-react** + **framer-motion** primitives (available under `src/components/ui`)
- Pre-built `shadcn/ui`-style components (already in `src/components/ui`)

## Getting started

```bash
# 1. Install dependencies (any of these works)
npm install
# or
yarn
# or
pnpm install

# 2. Run the dev server (http://localhost:5173)
npm run dev

# 3. Build for production (output -> dist/)
npm run build

# 4. Preview the production build locally
npm run preview

# 5. Typecheck only
npm run typecheck
```

## Project structure

```
.
├── index.html              # Vite entry HTML
├── vite.config.ts          # Vite config (@ alias -> src)
├── tsconfig.json           # Project references
├── tsconfig.app.json       # App TS config (paths: @/* -> src/*)
├── tsconfig.node.json      # TS config for vite.config.ts
├── components.json         # shadcn/ui config
├── public/                 # Static assets (favicon, robots, og image)
└── src/
    ├── main.tsx            # React entry
    ├── App.tsx             # Single-page Cilantrro site
    ├── index.css           # Global styles (custom dark/gold theme)
    ├── hooks/              # use-toast, use-mobile
    ├── lib/                # utils (cn helper)
    ├── pages/              # extra pages (404)
    └── components/ui/      # Reusable UI primitives (shadcn-style)
```

## What changed vs the original Replit export

This project is a **clean Vite version** of the Replit export. The following Replit-specific bits were removed so it runs anywhere:

- Removed `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`.
- Removed the mandatory `PORT` / `BASE_PATH` env variable requirement from `vite.config.ts`.
- Replaced pnpm-workspace `catalog:` / `workspace:*` dependency markers with real versions.
- Removed the unused `@workspace/api-client-react` dependency.
- `tsconfig.json` no longer extends a parent workspace config; it's fully self-contained.
- `dist/` is the standard build output (instead of `dist/public`).

No application source code (`src/*`, `public/*`, `index.html`) was modified.

## License

Private / internal.
