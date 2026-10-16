# Samir Money — samirmoney.com

One website for Samir Money SA (consumer app, SamirPay, RAPS, API). The full build spec, brand rules and
open client questions live in [`CLAUDE.md`](CLAUDE.md) — read §0–§4 before changing anything.

## Run

```bash
pnpm install
cp .env.example .env.local   # optional: forms run as logged dry runs without Resend/Turnstile keys
pnpm dev                     # http://localhost:3000
```

## Quality gates

| Command                                      | Checks                                                                     |
| -------------------------------------------- | -------------------------------------------------------------------------- |
| `pnpm lint` · `pnpm typecheck` · `pnpm test` | ESLint, TypeScript, Vitest (typography, schemas, rate limit)               |
| `pnpm build && pnpm e2e`                     | Playwright: routes, redirects, verbatim brief copy, axe, forms, navigation |
| `pnpm lhci`                                  | Lighthouse mobile budgets (§13); set `CHROME_PATH` if Chrome is not found  |
| `pnpm check:content`                         | Lists every `TODO(client)`; `STRICT_CONTENT=1` fails on any                |

## Assets

`pnpm assets:legacy` → `pnpm assets:derive` (masks operator logos and phone numbers) → `pnpm images`
(reads `assets/selection.json`, writes `public/media/photos` and `src/content/media.json`).
Raw downloads in `assets/legacy|drive|derived` are git-ignored.

## Stages

- **Preview** (any non-production build): missing visuals show labelled placeholders, robots block indexing,
  forms skip Turnstile/e-mail when keys are absent (logged).
- **Production** (`VERCEL_ENV=production` or `SITE_STAGE=production`): a remaining placeholder fails the build,
  forms fail closed without keys, the site is indexable.

## Decisions worth knowing

- Next.js 16 with Cache Components: every page is static. URL parameters (`?profil=`, `?sujet=`) are read on the
  client so pages stay prerendered.
- Motion only loads with the scenes that use it, on view; reveals and the seal ring are CSS. Client components
  use `cx` (clsx) instead of `cn` so tailwind-merge stays on the server.
- Legal pages are typed content (`src/content/fr/legal.ts`), not MDX.
- Contact map is a static OpenStreetMap image (`scripts/build-static-map.mjs`), no iframe.
