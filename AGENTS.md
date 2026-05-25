# Suraxa Snake Quiz

React + Vite SPA. Game code lives under `src/`. Static assets are in `public/` and served under the `/mfg-quiz/` base path (see `vite.config.ts`).

## Commands

- `npm run dev` — local dev server (open `/mfg-quiz/`)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build

## Conventions

- Use `@/` path alias for `src/` imports
- Use `assetUrl()` from `src/lib/assets.ts` for public asset paths (respects Vite `base`)
- Question banks: `src/data/*-questions.json`
