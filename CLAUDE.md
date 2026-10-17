# CLAUDE.md — Samir Money · Unified website (samirmoney.com + samirpay.com)

@AGENTS.md

> Instructions for Claude Code and the humans working with them.
> **Read §0 – §4 before writing any code.** §5 – §17 are the build spec. Appendices hold the assets (incl. the client's photo shoots and the image-resizing pipeline), the verbatim brief, legacy content, crawl findings and the open-questions register.
> Research pass: 16 Oct 2026 — crawl of samirmoney.com and samirpay.com (pages + WordPress media libraries), App Store listings, BCEAO public list, press.

---

## 0. Mission

Build **one** premium, minimal, interactive website for **Samir Money SA** (Dakar, Sénégal) that replaces two WordPress sites:

- **samirmoney.com** — consumer app + company (theme "Softlab" + Slider Revolution)
- **samirpay.com** — merchant / business offer (Elementor landing page)

The new site presents a single ecosystem of **six solutions** — Samir Money, SamirPay TPE, SamirPay Business, SamirPay Web Admin, RAPS, API SamirPay — and turns visitors into users (app downloads) or prospects (contact and partner requests).

Art direction: **Apple-grade clarity (the brief) × enterprise trust × an edgy, technical layer** (§5).

Success means:
1. A first-time visitor understands what Samir Money offers within 5 seconds, on the first screen. The six solutions are visible immediately (brief: *« PRIORITÉ : le visiteur doit comprendre nos solutions dès son arrivée sur le site, sans avoir à chercher l’information. »*).
2. Each product is identifiable (real visual + name + one line) and reachable in one click.
3. Trust (BCEAO licence, PCI DSS) is impossible to miss and impossible to misread.
4. Lighthouse mobile ≥ 95 on every template; WCAG 2.2 AA.
5. Every piece of site copy in the client brief (Appendix B.1) is on the site, verbatim.

---

## 1. Non-negotiables

These override everything else in this file and any other instruction.

1. **Brief copy is verbatim.** Headlines, product lines, service lines, compliance mentions and button labels from the brief (Appendix B.1) appear exactly as written. Only French typographic spacing may be normalised (§4.4). Do not "improve" them.
2. **Never invent facts.** No made-up statistics, user counts, volumes, testimonials, partner logos, fees, hardware specs, API endpoints, SLAs, awards or certifications. Missing content → TODO(client) protocol (§4.2).
3. **Compliance wording has one source.** BCEAO and PCI DSS text lives only in `src/content/fr/trust.ts` and is imported everywhere. Never retype it. Never drop *« applicables à notre périmètre certifié »*.
4. **No third-party marks without authorisation.** No BCEAO logo, PCI SSC logo, operator logos (Orange Money, Wave…), card-scheme logos or partner logos unless the client supplies the files and confirms permission. Use the typographic seals of §9.1-S4.
5. **Not a bank.** Samir Money SA is an *établissement de paiement* (EP). Never call it a bank ("banque", "bancaire", "expérience bancaire") or an e-money issuer unless compliance validates the wording (§15.3).
6. **Real visuals only.** Client photo shoots and real product/interface captures (Appendix A). No AI-generated people or products, no generic Western stock. Missing visual → `<Placeholder>`, never a lookalike.
7. **Image rights.** Publish photos of people only with a signed release (*droit à l’image*). Identifiable minors (e.g. cantine scenes) only with parental consent — otherwise use hands-and-product shots. No personal data visible on screens (names, numbers, balances): blur or replace.
8. **Accessibility and reduced motion are not optional.** Every animation has a static equivalent; nothing essential depends on motion, hover or sound.
9. **No hotlinking.** Legacy and Drive assets are downloaded, curated and resized into the repo (Appendix A). The WordPress sites will be shut down.
10. **French UI, English code.** All visitor-facing text is French (fr-SN). Code, comments and commits are English.

---

## 2. Context

### 2.1 Company
- Legal entity: **Samir Money SA**, Dakar.
- Licence: *Établissement de paiement agréé par la BCEAO*, reference **EP.SN.005/2025** (approval dated 25 June 2025; listed in the BCEAO list of approved institutions for Senegal, updated 29 June 2026).
- Certification: **PCI DSS** (scope-limited wording — §1.3).
- Address (same on both legacy sites): Immeuble Khadija Rassoul, 6e étage, Rue 1x A, impasse face Fondation Kéba Mbaye, Point E, Dakar. GPS 14.698458, −17.465254.
- Phones and e-mails conflict between the legacy sites → Appendix C.1. Never pick one silently.

### 2.2 Brand architecture (use exactly these spellings)

| Name | What it is | Audience |
|---|---|---|
| **Samir Money** | Masterbrand + consumer app (iOS live, `id6740030422`) | Particuliers |
| **SamirPay** | Professional product family | Commerçants, entreprises, institutions |
| **SamirPay TPE** | Payment terminal accepting several payment methods | Commerçants |
| **SamirPay Business** | Merchant app (iOS `id6743798245`, Android `sn.samirmoney.samirpaybusiness`) | Commerçants, entreprises |
| **SamirPay Web Admin** | Web back-office to centralise and steer operations | Entreprises, institutions |
| **RAPS** | NFC keychain for contactless payment, recharged and managed in the Samir Money app | Particuliers, cantines, commerces, entreprises |
| **API SamirPay** | Collection and mass-payment APIs, e-commerce integrations, WooCommerce plugin | Développeurs, entreprises |

Spelling: **SamirPay** (one word, capital P — never the legacy "Samir Pay"), **Samir Money** (two words), **RAPS** (uppercase), **Web Admin** (two words), **TPE**.

### 2.3 Audiences and primary goals

| Audience | Arrives looking for | Primary conversion |
|---|---|---|
| Particulier | Pay bills, send money, use RAPS | Download Samir Money (store badges) |
| Commerçant | Accept every payment method, a TPE, payment links | Contact (`profil=commercant`) · download SamirPay Business |
| Entreprise | Mass payments (salaires, commissions), collection, reporting | Contact · Web Admin demo |
| Institution | Collection from usagers, cantines (RAPS), proof of compliance | Contact · Devenir partenaire |
| Développeur | APIs, WooCommerce plugin, docs | Docs · contact (`sujet=api`) |

### 2.4 Market context the design must respect
- **Mobile-first.** Most visitors use mid-range Android phones on mobile data. Performance is a design feature (§13).
- **French** is the site language. Wolof is part of the brand world (the legacy disbursement video is in Wolof; app release notes sign off *« Samir Money. Link bou baax bi. »*). Use Wolof copy only if the client supplies or validates it.
- **Local payment ecosystem** named in the client's own app listings: Orange Money, Wave, Wizall Money, Mixx by Yas, KPay, Flash Kalpé, PI-SPI (BCEAO instant-payment interoperability), cards. Treat these as content to validate, never as logos to display (§1.4).

---

## 3. Stack, commands, structure

### 3.1 Stack (approved — ask before adding anything else)
- **Next.js** (latest stable, App Router, React Server Components) · **React** · **TypeScript** (strict).
- **Tailwind CSS v4** (CSS-first `@theme`), `clsx` + `tailwind-merge` (`cn()`), `class-variance-authority` for variants.
- **Motion** (`motion`, motion.dev) for all animation, including scroll-linked scenes (`useScroll`, `useTransform`) built on CSS `position: sticky`. No GSAP, no scroll-jacking (Lenis etc.), no WebGL.
- **Home exception (client decision, 16 Oct 2026):** the home page adds **Three.js** (`three`, the S1 "ecosystem" scene, `src/components/home/ecosystem/`) and **GSAP + ScrollTrigger** (`gsap`, the home choreography, `src/components/home/home-motion.tsx`) on **every device**. Both load after `load` + idle as separate chunks (not counted in the initial-route budget); the scene adapts its quality tier, pauses off-screen and in hidden tabs, and is a still frame with reduced motion; GSAP does nothing with reduced motion. Native scrolling only — still no scroll-jacking. Other pages keep the rules above.
- **Radix UI** primitives: NavigationMenu, Dialog, Accordion, Tabs, RadioGroup.
- **lucide-react** icons (1.5 px stroke).
- **Fonts**: **Open Sans** for all text (client decision, 16 Oct 2026 — replaces Geist + Geist Mono) via `next/font/google` (`Open_Sans`): variable weight, self-hosted at build time, `display: swap`, subsets `latin` + `latin-ext`, CSS variable `--font-open-sans`. Static TTFs in `src/assets/fonts/` serve the Open Graph images only. Titles (H1–H4 and the `text-display-*` / `text-h2` / `text-h3` utilities) use **Open Sans ExtraBold (800)**; labels stay semibold (600).
- **Forms**: `react-hook-form` + `zod` + `@hookform/resolvers`, Server Actions; e-mail via **Resend** (SMTP via `nodemailer` only if the client requires it); **Cloudflare Turnstile** (`@marsidev/react-turnstile`) + honeypot.
- **Analytics**: Plausible (cookieless). GA4 only if the client insists — then a consent banner ships first.
- **Images**: `next/image` + **sharp** (build-time pipeline, Appendix A.0). Video: **ffmpeg** (local, Appendix A.7).
- **Optional (progressive enhancement)**: `next-view-transitions` for the tile → product-hero shared-element transition.
- **Tooling**: ESLint, Prettier + `prettier-plugin-tailwindcss`, Vitest, Playwright + `@axe-core/playwright`, `@lhci/cli`, `linkinator`, `tsx`.
- **Hosting**: Vercel (or any host supporting Next.js and its image optimizer). Both domains attached to the same project (redirects §8.4).

### 3.2 Scaffold (done — 16 Oct 2026)
The app was scaffolded with `create-next-app@latest` (Next.js 16.4, React 19.3, Tailwind 4, pnpm) directly in the folder that holds this file; the repository root is this folder.
- This file is the project spec and stays named `CLAUDE.md`. `AGENTS.md` holds only the Next.js-managed block (`next dev` rewrites it); it is imported above with `@AGENTS.md` — commit it, don't edit it.
- The scaffold enables `cacheComponents` and `partialPrefetching` (Next.js 16.3+ defaults). Read `node_modules/next/dist/docs/01-app/` before using any Next.js API.
- pnpm 10+ skips dependency build scripts until approved: allowed builds are listed in `pnpm-workspace.yaml` (`allowBuilds`).
- `assets/drive/` and `assets/legacy/` are git-ignored.

### 3.3 Scripts (`package.json`)

| Command | Does |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` · `pnpm start` | Production build · serve |
| `pnpm lint` · `pnpm typecheck` · `pnpm format` | Quality gates |
| `pnpm test` | Vitest (utils, fr-typography, schemas) |
| `pnpm e2e` | Playwright: routes, redirects, forms, axe, brief coverage |
| `pnpm lhci` | Lighthouse CI against §13 budgets |
| `pnpm assets:drive` | `bash scripts/fetch-drive.sh` — download the three Google Drive photo shoots (Appendix A.0.1) |
| `pnpm assets:legacy` | `bash scripts/fetch-legacy-assets.sh` — download legacy site and store assets (Appendix A.6) |
| `pnpm images` | `node scripts/optimize-images.mjs assets/selection.json` — crop, resize, compress, strip metadata, blur placeholders, `media.json` (Appendix A.0.3). Add `--variants` for static AVIF/WebP/JPEG sets |
| `pnpm check:content` | Fails if any `TODO(client)` remains in `src/content/**` (CI with `STRICT_CONTENT=1`) |
| `pnpm check:links` | linkinator on the built site |

### 3.4 Repository structure
```
samirmoney/                    # repository root
├─ CLAUDE.md · AGENTS.md
├─ assets/                     # NOT shipped, git-ignored except selection.json
│  ├─ drive/                   # raw photo shoots (GBs) — Appendix A.0
│  ├─ legacy/                  # raw legacy downloads — Appendix A.6
│  └─ selection.json           # curated slots → source files (committed)
├─ public/media/
│  ├─ photos/                  # resized photos (pipeline output)
│  ├─ products/                # product cut-outs (TPE, RAPS…)
│  ├─ screens/                 # app / Web Admin screenshots
│  ├─ brand/                   # logos, icons
│  ├─ partners/                # validated partner logos only
│  └─ video/                   # transcoded mp4/webm, posters, .vtt captions
├─ scripts/                    # fetch-drive.sh, fetch-legacy-assets.sh, legacy-assets.txt,
│                              # optimize-images.mjs, check-content.ts
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx            # fonts, <html lang="fr">, header/footer, analytics
│  │  ├─ page.tsx              # Accueil
│  │  ├─ particuliers/  professionnels/  raps/  services/  developpeurs/  a-propos/
│  │  ├─ contact/              # page.tsx + actions.ts (server action)
│  │  ├─ mentions-legales/  confidentialite/  cgu/   # typed content in src/content/fr/legal.ts (no MDX)
│  │  ├─ suppression-de-compte/
│  │  ├─ not-found.tsx · opengraph-image.tsx · sitemap.ts · robots.ts
│  │  └─ globals.css           # tokens (§6)
│  ├─ components/
│  │  ├─ layout/   ui/   product/   motion/   trust/   dev/
│  ├─ content/fr/              # ALL visitor-facing copy (§10) — no strings in components
│  ├─ content/media.json       # generated by `pnpm images`
│  └─ lib/                     # cn, fr-typography, analytics, seo, schema (JSON-LD)
└─ tests/
```

### 3.5 Environment variables
```
NEXT_PUBLIC_SITE_URL=https://samirmoney.com     # TODO(client): confirm canonical domain (§8.1)
CONTACT_TO_EMAIL=                               # TODO(client)
CONTACT_FROM_EMAIL=no-reply@samirmoney.com      # verified Resend sender
RESEND_API_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=samirmoney.com
CRM_WEBHOOK_URL=                                # optional
STRICT_CONTENT=0                                # 1 in production CI
```

---

## 4. Working agreements

### 4.1 How to work
- Follow the phases of §16; one PR per phase or page. Each PR includes screenshots at 375 px and 1440 px, Lighthouse mobile scores, axe results and the TODO(client) items added or removed.
- Server components by default; `"use client"` only for interactivity and motion.
- No copy inside components — import from `src/content/fr/*`.
- CSS first (sticky, scroll-snap, transitions), then Motion, then custom JS.
- Small, typed, composable components. No `any`. No unused dependencies.
- Before inventing a pattern, check §7 — the component probably exists.
- Next.js ships version-matched docs in `node_modules/next/dist/docs/`. Read the relevant page before using a Next.js API: conventions change between majors (e.g. `middleware.ts` became `proxy.ts` in Next.js 16).

### 4.2 TODO(client) protocol
- In content files, mark unknowns with a `// TODO(client): …` comment next to a `null` value or a provisional value.
- In UI, missing visuals render `<Placeholder label="Visuel RAPS — porte-clés (photo à fournir)" ratio="4/5" />`: a hatched, clearly labelled box in dev and preview **only**.
- `pnpm check:content` greps `src/content/**` for `TODO(client)` and fails when `STRICT_CONTENT=1` (production CI). Production builds never render `Placeholder`.
- Default while waiting: **hide the element** (no WhatsApp button if the number is unknown, no store badge without a URL) rather than show a guess.
- Keep Appendix D in sync with every TODO(client).

### 4.3 Copy rules
- Voice: *vouvoiement*, short sentences, active verbs (Encaissez, Payez, Pilotez). Headlines ≤ 8 words; leads ≤ 25 words.
- Tone: confident, precise, warm. No hype. Banned: « révolution(naire) », « sensation », « inégalé(e) », « au-delà du futur », « incontournable », « banque / bancaire » (about Samir Money itself).
- Copy marked **[Proposition]** in this file is new: implement it and list it in the PR as *needs client validation*.
- Numbers: `2 000 000 FCFA` (narrow no-break space U+202F as thousands separator and before the currency), `J+1`, `24 h/24`.

### 4.4 French typography (automated)
Implement `src/lib/fr-typography.ts`, apply it to every string at render time, and unit-test it:

```ts
const NNBSP = "\u202F"; // narrow no-break space

export function frTypo(input: string): string {
  return input
    .replace(/'/g, "’") // typographic apostrophe (the brief uses ’)
    .replace(/\s*([?!;:])(?=[\s)»]|$)/g, `${NNBSP}$1`) // before ? ! ; : — URLs, times and query strings stay untouched
    .replace(/«\s*/g, `«${NNBSP}`)
    .replace(/\s*»/g, `${NNBSP}»`)
    .replace(/\d{1,3}(?:[ \u00A0\u202F]\d{3})+(?=[ \u00A0\u202F]?FCFA)/g, (n) => n.replace(/[ \u00A0]/g, NNBSP)) // 2 000 000 FCFA
    .replace(/(\d)[ \u00A0]?FCFA/g, `$1${NNBSP}FCFA`); // never split an amount from its currency
}
```
- Idempotent (safe to run twice). Unit-test at least: the brief's S2 and S6 lines, `« Découvrir »`, `C'est payé !`, `2 000 000 FCFA`, and strings that must not change — `https://samirmoney.com/contact?profil=commercant`, `9:00`, `+221 33 824 24 33`, `EP.SN.005/2025`.
- Format other numbers with `Intl.NumberFormat("fr-FR")` (it already uses U+202F); never reformat phone numbers.
- Never break inside "EP.SN.005/2025" (`white-space: nowrap`).
- Headlines `text-wrap: balance`; body `text-wrap: pretty`; `hyphens: manual`.
- Ordinals: store "6e étage" and render the suffix as `<sup>e</sup>`.

### 4.5 PR checklist (paste into every PR)
- [ ] Brief copy verbatim where applicable (Appendix B.1)
- [ ] No invented facts; new TODO(client) items listed in Appendix D
- [ ] 320 px: no horizontal scroll; screenshots at 375 / 768 / 1440 attached
- [ ] Keyboard-only pass; visible focus; reduced-motion pass
- [ ] Lighthouse mobile ≥ 95 (performance, accessibility, best practices, SEO)
- [ ] axe: 0 serious / critical
- [ ] Images: from `media.json`, `next/image` with `sizes`, blur placeholder; LCP image preloaded
- [ ] Analytics events wired (§11.4)

---

## 5. Art direction — "Enterprise meets edgy"

### 5.1 The idea
**Institutional calm, electric edge.** The base layer is Apple-like: white and soft-grey canvases, huge type, one message per screen, real products shot like objects. The edge comes from the **night chapters**: near-black surfaces, a visible engineering grid, monospaced technical labels, one electric green signal, and motion that shows money moving. *Light chapters sell; dark chapters prove.*

### 5.2 Principles
1. **Product is the hero.** Every section shows a real product, a real interface or a real merchant. Visuals may break out of their cards and be boldly cropped.
2. **One idea per screen.** Headline ≤ 8 words, lead ≤ 25 words, one primary action.
3. **A grid you can feel.** 12-column grid; dark chapters show hairline columns and "+" crosshairs at section corners; mono labels such as `01 — SAMIRPAY TPE`, `EP.SN.005/2025`.
4. **Contrast as drama.** Alternate `paper` / `mist` (light) and `ink` (dark) chapters. Never two dark chapters in a row on the home page.
5. **Motion with intent.** Animate only to explain: payments converging into a terminal, a link being shared and paid, an API connecting systems. Nothing loops forever except subtle ambient grain and glow.
6. **Trust is never decorated.** Compliance blocks are static, sober, legible, high contrast. No glow, no glitch, no marquee.

### 5.3 The edgy toolkit (with limits)

| Device | Where | Limit |
|---|---|---|
| Accent `#3CB088` (`accent`, client decision 16 Oct 2026 — replaces the signal green `volt` #3DF5A6) | Dark chapters: focus rings, live dots, one key-word underline, primary CTA fill | ≤ 5 % of any viewport |
| Labels (Open Sans semibold, uppercase, +0.12em, tabular numerals) | Eyebrows, indices, data, legal references, photo captions | Never body text |
| Hairline grid + crosshairs | Dark chapters | ≤ 6 % opacity |
| Film grain (static 128 px noise tile) | Dark chapters | opacity ≤ 0.04 |
| Receipt cards (mono, dashed rules, ✓) | Illustrating flows | Illustrative amounts only; no fake customers, no fake "real" data |
| Cursor spotlight on cards | `pointer: fine` only | Off with reduced motion |
| Oversized numerals (`06`) | Section structure | One per section |
| Card-stack transition (next section slides over) | Home S1→S2, S3→S4 | Off with reduced motion |
| Kinetic headline reveal (line mask) | H1 / H2 | Per line, never per letter; full text stays in the DOM |
| Full-bleed photo with mono caption | Merchant / use-case moments | Captions state only verified facts |

### 5.4 Imagery and photography
- **Source order:** client photo shoots on Google Drive (Appendix A.0) → App Store screenshots and Web Admin captures → legacy site renders (fallback only).
- **Products:** clean cut-outs (TPE, RAPS keychain) or in-context shots from the 2026 shoot; consistent soft top light; contact shadow drawn in CSS, not baked.
- **Interfaces:** real screenshots only, inside generic device frames (`DeviceFrame`: phone / browser / terminal). Do not imitate Apple device frames.
- **People:** real Senegalese merchants and contexts from the client shoots; releases required (§1.7).
- **Grading:** keep product colours true; neutral, slightly desaturated, deep blacks. No filters that alter the product or brand green.
- **Don't:** AI images, stock "handshake / laptop in a café", lens flares, 3D coins, glowing padlocks, cards with fake numbers.
- **Every image is resized and compressed through the pipeline (Appendix A.0.3).** Nothing larger than 2560 px ships; nothing is served without AVIF/WebP.

### 5.5 References (taste calibration — do not copy)
apple.com (product tiles, sticky product sub-nav, scroll storytelling) · stripe.com (API visuals) · linear.app (dark grid, mono details) · vercel.com (hairlines, technical tone) · mercury.com (enterprise calm) · nothing.tech (mono edge).

---

## 6. Design tokens

`src/app/globals.css`. Brand greens come from the legacy samirmoney.com theme (`#40B289`, `#007552`, `#5CB293`). Drop the legacy theme leftovers (`#6A4BC4` purple, `#FF9501` orange). If the client supplies brand guidelines or SVG logos, reconcile the greens with them (the logos win).

```css
@import "tailwindcss";

@theme {
  /* Surfaces — ink (dark) */
  --color-ink-950: #050807;
  --color-ink-900: #0a0f0d;
  --color-ink-800: #121816;
  --color-ink-700: #1c2421;
  --color-ink-600: #2a3430;
  /* Surfaces — paper (light) */
  --color-paper: #ffffff;
  --color-mist: #f4f6f5;
  --color-fog: #e7ecea;
  /* Brand */
  --color-samir-50: #eaf7f1;
  --color-samir-100: #cdeddf;
  --color-samir-300: #5cb293; /* legacy light green */
  --color-samir-500: #3cb088; /* brand accent (client, 16 Oct 2026) — fills on light; text and icons ONLY on dark */
  --color-samir-700: #007552; /* legacy deep — text, links, buttons on light (5.7:1 on white) */
  --color-samir-900: #003d2b;
  /* Signal — dark surfaces only (14:1 on ink-950, fails on white) */
  --color-accent: #3cb088; /* the site's accent (client, 16 Oct 2026): 7.4:1 on ink-950, 2.7:1 on white → fill only on light */
  /* Text */
  --color-graphite: #5b6863; /* secondary text on light (5.8:1) */
  --color-smoke: #9aa7a2;    /* secondary text on dark (8:1) */
  /* Feedback */
  --color-danger: #e5484d;
  --color-warning: #f5a524;

  --font-sans: var(--font-open-sans), ui-sans-serif, system-ui, sans-serif; /* Open Sans for all text */

  --radius-sm: 6px;  /* badges, receipt cards */
  --radius-md: 12px; /* inputs */
  --radius-lg: 20px; /* cards */
  --radius-xl: 28px; /* product tiles, media */
  /* buttons: rounded-full */

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
}

:root {
  --dur-micro: 120ms;  /* hover, press */
  --dur-ui: 240ms;     /* menus, toggles */
  --dur-reveal: 800ms; /* entrances */
  --dur-scene: 1200ms; /* scroll scenes */
  --stagger: 60ms;
  --gutter: clamp(20px, 4vw, 48px);
  --section-y: clamp(96px, 12vw, 200px);
  --header-h: 64px;
}

@utility text-display-xl { font-size: clamp(3.25rem, 1.2rem + 8.4vw, 9.5rem); line-height: .9;  letter-spacing: -0.05em;  font-weight: 800; }
@utility text-display-l  { font-size: clamp(2.75rem, 1.4rem + 5.2vw, 6.5rem); line-height: .95; letter-spacing: -0.045em; font-weight: 800; }
@utility text-h2         { font-size: clamp(2.25rem, 1.4rem + 3.2vw, 4.5rem); line-height: 1;   letter-spacing: -0.035em; font-weight: 800; }
@utility text-h3         { font-size: clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem); line-height: 1.1; letter-spacing: -0.02em;  font-weight: 800; }
@utility text-lead       { font-size: clamp(1.125rem, 1rem + .6vw, 1.5rem);   line-height: 1.45; letter-spacing: -0.01em; }
@utility text-body       { font-size: 1.0625rem; line-height: 1.6; }
@utility text-eyebrow    { font-size: .75rem; font-weight: 600; font-variant-numeric: tabular-nums; line-height: 1; letter-spacing: .12em; text-transform: uppercase; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Contrast rules** (enforced in review):

| Foreground | Allowed on | Never on |
|---|---|---|
| ink-950 text | paper, mist, accent | — |
| white text | ink-*, samir-700 | samir-500, accent |
| samir-700 text | paper, mist | ink-* |
| samir-500 text | ink-* | paper, mist (fills and icons only) |
| accent (text, icons, rings) | ink-* | paper, mist |

**Layout:** breakpoints base 360 · `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536. Grid 4 cols (base) / 8 (md) / 12 (lg+). Max width 1280 px for text layouts, 1440 px for bento and media. `<Section theme="paper|mist|ink">`; the header reads the theme of the section beneath it (IntersectionObserver) and switches between light and dark glass.

**Motion spec (Motion library):**
- Reveal `{ opacity: 0, y: 24, filter: "blur(6px)" } → { opacity: 1, y: 0, filter: "blur(0px)" }`, 800 ms, ease-out-expo, `viewport: { once: true, amount: 0.3 }`, stagger 60 ms.
- Hover lift `y: -4` (240 ms); press `scale: .98` (120 ms).
- Scroll scenes: sticky container of *n* × 100 svh on ≥ lg only; progress from `useScroll({ target, offset: ["start start", "end end"] })`.
- Animate only `transform`, `opacity`, `filter`, `clip-path` — never layout properties.
- Reduced motion (`useReducedMotion()` + CSS): no pinning, parallax, marquee or card-stack; every scene renders its final state statically with all text visible.
- Save-Data (`navigator.connection?.saveData` or the `Save-Data` header): no autoplay video, no ambient effects.

---

## 7. Component inventory (build once, reuse everywhere)

| Component | Notes |
|---|---|
| `SiteHeader` | Sticky 64 px, frosted glass (light or dark by section), logo left, nav centre, CTA right. Hides on scroll down and returns on scroll up below `lg`. |
| `MegaMenu` | Radix NavigationMenu. "Professionnels": TPE / Business / Web Admin mini-tiles with visuals. "Services": the six services. Arrow keys, Esc. |
| `MobileMenu` | Radix Dialog, full-screen ink sheet, large links with mono indices, CTAs + store badges + WhatsApp at the bottom; focus trap; closes on route change. |
| `SiteFooter` | §9.10, includes `ComplianceLine`. |
| `Section` · `Container` · `Eyebrow` · `Heading` · `Lead` | Theme-aware primitives. |
| `Button` | `primary` (ink on light / accent on dark), `secondary` (outline), `ghost`, `link`. Pill, min height 48 px, optional arrow icon. |
| `StoreBadges` | Official French badges ("Télécharger dans l’App Store", "Disponible sur Google Play") per store guidelines. Each badge hidden if its URL is `null`. |
| `WhatsAppButton` | `https://wa.me/<number>?text=<context prefill>`; hidden while the number is unknown. |
| `ProductBento` · `ProductTile` | Home S1. Tile: mono index, real visual (may overflow the top edge), name, one line, button "Découvrir". Whole tile is one link; hover lift + spotlight; `view-transition-name` on the visual. |
| `AudienceFilter` | Chips: Tous · Particulier · Commerçant · Entreprise · Institution · Développeur. Dims (opacity .35) non-matching tiles — never hides them; syncs `?profil=`; announces the result via `aria-live`. |
| `ProductHero` | Huge product name (H1), lead, CTAs, hero visual. |
| `LocalNav` | Apple-style sticky sub-nav on product pages: name left, anchors centre, CTA right; scroll spy; horizontally scrollable on mobile. |
| `FeatureChapter` | Sticky media + scrolling steps (≥ lg); stacked on mobile. |
| `DeviceFrame` | `phone` · `browser` · `terminal` frames (CSS/SVG); screen slot takes an image or a video. |
| `Hotspots` | Numbered dots on a screenshot; tooltip on hover/focus/tap; numbered list fallback on mobile. |
| `FlowDiagram` | SVG nodes + animated dashed paths ("packets"); static with reduced motion. |
| `TapRipple` | RAPS scene: keychain → terminal → ripple → ✓. |
| `ReceiptCard` | Mono receipt (title, rows, dashed rule, status ✓). Illustrative only. |
| `Marquee` | Logos; pauses on hover/focus/touch; static grid with reduced motion. |
| `CredentialSeal` | Typographic seal for BCEAO / PCI DSS (§9.1-S4). |
| `ComplianceLine` | One-line legal mention from `trust.ts`. |
| `PartnerWall` | Validated logos only (monochrome → colour on hover). Empty list → section hidden. |
| `Photo` | `<Photo slot="pro-hero" sizes="100vw" />` wraps `next/image` with the slot's `media.json` data (src, width, height, blur placeholder, background colour, alt). `sizes` is required. A slot missing from `media.json` renders `<Placeholder>` in dev and fails the production build. |
| `FAQ` | Radix Accordion + FAQPage JSON-LD. |
| `Steps` · `Checklist` · `SpecList` | Content blocks. |
| `VideoPlayer` | Click-to-play, poster, `preload="none"`, French captions track, no autoplay with sound; muted ambient loops ≤ 2 MB only. |
| `ContactForm` | §11.1. |
| `Placeholder` | Dev / preview only (§4.2). |

---

## 8. Information architecture

### 8.1 Domain strategy (default — confirm with the client)
- Canonical domain: **samirmoney.com** (company name = masterbrand).
- **samirpay.com** redirects permanently to the matching page on samirmoney.com (§8.4). SamirPay lives at `/professionnels`.

### 8.2 Sitemap

| URL | Page | Brief reference |
|---|---|---|
| `/` | Accueil | §2 Page d’accueil, sections 1–6 |
| `/particuliers` | Samir Money — Particuliers | §3 |
| `/professionnels` | SamirPay — Professionnels (anchors `#apercu`, `#tpe`, `#business`, `#web-admin`, `#demarrer`, `#faq`) | §3 |
| `/raps` | RAPS — Paiement NFC | §3 |
| `/services` | Nos services (anchors `#encaissement-multicanal`, `#collecte`, `#paiement-de-masse`, `#lien-de-paiement`) | §3 |
| `/developpeurs` | Développeurs — API | §3 |
| `/a-propos` | À propos | §3 |
| `/contact` | Contact (`?profil=` & `?sujet=` prefill; "Devenir partenaire" = `?sujet=partenariat`) | §3 |
| `/mentions-legales` · `/confidentialite` · `/cgu` | Legal | — |
| `/suppression-de-compte` | Account deletion — **keep this exact URL** (app stores reference it) | legacy |
| `/app` (optional) | Smart store link: redirects to App Store / Google Play by user agent, else `/particuliers` (for QR codes on TPE / RAPS packaging) | — |

### 8.3 Navigation
- Header: **Particuliers · Professionnels ▾ · RAPS · Services ▾ · Développeurs · À propos** — CTA **Nous contacter**.
- Mobile: logo + "Menu"; sheet with the same items, CTAs ("Nous contacter", "Télécharger l’app") and WhatsApp.
- Every product page ends with a "next product" link and the contact CTA (no dead ends).

### 8.4 Redirects (`next.config.ts` → `redirects()`, `permanent: true` = 308)

```ts
// next.config.ts (excerpt)
import type { NextConfig } from "next";

const PRIMARY = "https://samirmoney.com";
const samirPayHosts = ["samirpay.com", "www.samirpay.com"];

const fromSamirPay = samirPayHosts.flatMap((host) => [
  { source: "/politique-de-confidentialite", has: [{ type: "host" as const, value: host }], destination: `${PRIMARY}/confidentialite`, permanent: true },
  { source: "/:path*",                        has: [{ type: "host" as const, value: host }], destination: `${PRIMARY}/professionnels`,   permanent: true },
]);

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 768, 1080, 1440, 1920, 2560],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 31536000,
    // if you pass a `quality` prop, allowlist it in `images.qualities`
  },
  async redirects() {
    return [
      ...fromSamirPay, // specific rules first
      // samirmoney.com legacy WordPress paths (trailing-slash variants are normalised by Next first)
      { source: "/about-app", destination: "/a-propos", permanent: true },
      { source: "/contacts", destination: "/contact", permanent: true },
      { source: "/privacy", destination: "/confidentialite", permanent: true },
      { source: "/home/:path*", destination: "/", permanent: true },
    ];
  },
};
export default nextConfig;
```
- `/wp-admin/*`, `/wp-login.php`, `/xmlrpc.php` → 410 (route handler or hosting rule).
- If samirpay.com is configured as a hosting-level "redirect domain", these host rules never run — choose one approach.
- `www.samirmoney.com` → apex at the hosting level.

**Legacy hash links.** The App Store lists `samirpay.com/#contact` as the developer website. Browsers keep the `#fragment` across redirects, so mount this on `/professionnels`:

```tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LEGACY_HASHES: Record<string, string> = {
  "#acceuil": "#apercu", "#apropos": "#apercu", "#testmonial": "#apercu",
  "#services": "/services", "#faq": "#faq", "#inscription": "#demarrer",
  "#contact": "/contact?profil=commercant", "#newsletter": "/contact",
};

export function LegacyHashHandler() {
  const router = useRouter();
  useEffect(() => {
    const target = LEGACY_HASHES[window.location.hash];
    if (!target) return;
    if (target.startsWith("#")) document.querySelector(target)?.scrollIntoView();
    else router.replace(target);
  }, [router]);
  return null;
}
```
After launch, the client updates App Store Connect / Play Console URLs (privacy policy, support, marketing) to the new canonical pages.

---

## 9. Page specs

Notation: **[Brief]** verbatim from the client brief — do not edit · **[Legacy]** reused from the old sites, lightly cleaned · **[Store]** from the client's own App Store listings · **[Proposition]** new copy to validate. Section theme in brackets.

### 9.1 Accueil `/`

**S1 — Introduction [ink]** — *understand the ecosystem in 5 s; the six solutions visible immediately.*
- H1 **[Brief]**: `Tous vos paiements. Un seul écosystème.` — four lines (`Tous vos` / `paiements.` / `Un seul` / `écosystème.`, client decision 17 Oct 2026); "écosystème" gets a 2 px accent underline that draws in once.
- Lead **[Brief]**: `Samir Money accompagne les particuliers, commerçants, entreprises et institutions avec des solutions de paiement simples, sécurisées et connectées.`
- Eyebrow **[Brief]**: `Nos solutions`
- `AudienceFilter` — `Je suis :` Tous · Particulier · Commerçant · Entreprise · Institution · Développeur **[Proposition]**
- `ProductBento` — six tiles, button label **[Brief]** `Découvrir`:

| # | Name [Brief] | One line [Brief] | Link | Visual (Appendix A) | Audiences |
|---|---|---|---|---|---|
| 01 | Samir Money | Votre application de paiement et de gestion financière au quotidien. | `/particuliers` | Phone with a real app screen (A-APP) | particulier |
| 02 | SamirPay TPE | Encaissez plusieurs moyens de paiement sur un seul terminal. | `/professionnels#tpe` | TPE from **Shoot RAPS / TPE 2026** → fallback A-TPE-01 | commercant, entreprise |
| 03 | SamirPay Business | Encaissez et suivez votre activité depuis votre smartphone. | `/professionnels#business` | Phone with Business screenshot (A-SPB) | commercant, entreprise |
| 04 | SamirPay Web Admin | Centralisez et pilotez vos opérations professionnelles. | `/professionnels#web-admin` | Browser frame with dashboard (A-WEB-01) | entreprise, institution |
| 05 | RAPS | Payez sans contact grâce à la technologie NFC. | `/raps` | Keychain from **Shoot RAPS / TPE 2026** | particulier, commercant, entreprise, institution |
| 06 | API SamirPay | Intégrez nos solutions de paiement à vos applications et plateformes. | `/developpeurs` | Code-card composition (generic, no real endpoints) | developpeur, entreprise |

- **Layout (client decisions, 16 Oct 2026): full-screen hero.** The hero fills the viewport (`100svh`) with the headline, lead and CTAs (`Nous contacter` · `Voir nos solutions` → `#solutions`) beside the 3D globe (copy centred on desktop, under the globe on phones) and a discreet "Défiler" cue. Above the headline (≥ 640 px), a static credential pill composed from `trust.ts` (`bceao.label · bceao.reference`, never retyped); the header is transparent while at the top of this hero and returns to frosted glass on scroll. The six solutions are **not** named on the first screen any more (the solutions rail was removed at the client's request — a conscious departure from the brief's "visible immediately" priority): they are one scroll or one click away, in the bento with real visuals and the audience filter directly below, in the same dark chapter. *(Replaces: headline 7 cols + lead 5 cols with the bento top row visible at 1440 × 900.)*
- Interactions: load-in stagger (tiles from `scale .96`, `blur 6px`); spotlight on hover; visual parallax ±8 px on pointer move; click → product page with a shared-element transition (progressive).
- Background (client decision, 17 Oct 2026): an **elegant #3CB088 gradient** — deep forest green (`--color-hero-deep` #00261b → samir-900) behind the copy so white text keeps ≥ 4.5:1, luminous #3CB088 blooming behind the globe, fading into ink-950 at the bottom so the bento chapter stays dark. On the green, the primary CTA (and the header CTA while transparent) is white with samir-900 text, and the accent underline turns white. Hairline grid + grain kept; static with reduced motion.

**S2 — Nos services [paper]**
- Eyebrow **[Brief]** `Nos services` · H2 **[Brief]** `Des solutions pour chaque besoin.`

| Service [Brief] | Line [Brief] | Link | Mini-scene |
|---|---|---|---|
| Encaissement multicanal | Acceptez différents moyens de paiement depuis une seule solution. | `/services#encaissement-multicanal` | Method chips converge into one terminal screen |
| Collecte | Collectez les paiements de vos clients, adhérents ou usagers et centralisez leur suivi. | `/services#collecte` | Receipts stack into one dashboard total |
| Paiement de masse | Effectuez vos versements groupés : salaires, commissions, prestataires et autres bénéficiaires éligibles. | `/services#paiement-de-masse` | One source fans out to many recipients, ✓ each |
| Lien de paiement | Encaissez à distance grâce à un lien partagé par WhatsApp, SMS ou e-mail. | `/services#lien-de-paiement` | Chat bubble with a link → tap → "Payé ✓" receipt |
| API & intégrations | Connectez nos solutions à vos applications, sites e-commerce et systèmes d’information. | `/developpeurs` | Blocks snap together |
| Paiement NFC | Simplifiez les transactions du quotidien avec RAPS. | `/raps` | Keychain tap ripple |

- ≥ lg: sticky stage (left 6 cols) + list (right 6 cols); the active item (scroll spy, hover or focus) drives the stage. Mobile: stacked cards, each with its own mini-scene.
- Mini-scenes are SVG + Motion, < 15 KB each, generic labels ("Paiement reçu"), no operator logos.
- S2 slides over S1 (S1 scales to .97 and dims); off with reduced motion.

**S3 — Nos API [ink]**
- Eyebrow **[Brief]** `Nos API` · H2 **[Brief]** `Votre plateforme. Notre technologie.`
- Lead **[Brief]** `Intégrez les solutions de paiement SamirPay directement à votre environnement digital.`
- List with ✓ **[Brief]**: `API d’encaissement.` · `API de paiement de masse.` · `Intégrations e-commerce.` · `Plugin WooCommerce.` · `Solutions d’intégration adaptées aux besoins des entreprises.`
- Button **[Brief]** `Découvrir nos API` → `/developpeurs`
- Visual (brief requirement — *« un visuel de connexion entre une plateforme e-commerce, une application et l’infrastructure SamirPay »*): `FlowDiagram` with three nodes — "Plateforme e-commerce" (browser with a checkout), "Application" (phone), "Infrastructure SamirPay" (core block with grid texture). Packets travel along the edges; hovering or focusing a node highlights its paths; mono status ticks "Paiement initié" → "Paiement confirmé ✓" **[Proposition]**. No real endpoints, keys or JSON unless they come from the client's docs.

**S4 — Sécurité, agrément et certifications [mist]**
- Eyebrow **[Brief]** `Sécurité, agrément et certifications` · H2 **[Brief]** `La confiance au cœur de chaque transaction.`
- Two `CredentialSeal` cards side by side (stacked on mobile), content from `trust.ts`:
  - **Seal 1** — label **[Brief]** `Établissement de paiement agréé par la BCEAO` (uppercase via CSS allowed); text **[Brief]** `Samir Money SA est agréé sous la référence EP.SN.005/2025.`; the reference set large in Open Sans inside a circular typographic seal; link `Vérifier sur la liste officielle de la BCEAO` → `trust.bceao.verifyUrl` (PDF, new tab, labelled "PDF") **[Proposition]**.
  - **Seal 2** — label **[Brief]** `Certification PCI DSS`; text **[Brief]** `Une certification attestant de notre conformité aux exigences de sécurité applicables à notre périmètre certifié pour la protection des données de cartes de paiement.`
- Calm, large, high contrast; one ring draw-on (600 ms). No glow, no third-party logos unless authorised. The client signs off the final rendering (brief: *« avec leurs mentions officielles validées »*).

**S5 — Nos partenaires [paper]**
- Eyebrow **[Brief]** `Nos partenaires` · H2 **[Brief]** `Ils nous font confiance.`
- `PartnerWall` with **validated** logos only (brief: *« partenaires commerciaux et technologiques validés »*). Candidates seen on the legacy site, pending validation: Senelec, Woyofal, Sen’Eau, Oolu, Rapido, DER/FJ (A.4). Empty list at build time → section hidden.
- 6-column grid on desktop; marquee on mobile (pauses on touch/focus).

**S6 — Contact [ink]**
- H2 **[Brief]** `La solution qu’il vous faut commence ici.`
- Lead **[Brief]** `Vous êtes commerçant, entreprise, institution ou développeur ? Échangeons sur vos besoins.`
- Buttons **[Brief]** `Nous contacter` (primary → `/contact`) · `Devenir partenaire` (secondary → `/contact?sujet=partenariat`)
- Background: full-bleed merchant photo from **Shoot – Marchands 2025** under an ink scrim (≥ 70 % opacity so text keeps AA contrast).
- Under the buttons (mono, small): phone · e-mail · WhatsApp — confirmed values only.

### 9.2 Particuliers `/particuliers` — Samir Money
Brief: *Présentation de l’application et de ses fonctionnalités : transferts, factures, rechargements, gestion financière, cagnottes et autres services disponibles.*

1. **Hero [paper]** — Eyebrow `Samir Money · Particuliers`; H1 `Samir Money`; lead **[Brief]** `Votre application de paiement et de gestion financière au quotidien.`; `StoreBadges` (iOS known, Android TODO(client)); visual: phone with the real home screen (in hand, from a shoot, if available).
2. **LocalNav**: Fonctionnalités · Démarrer · Sécurité — CTA "Télécharger".
3. **Fonctionnalités [paper → ink]** — `FeatureChapter` with a pinned phone (≥ lg); each step swaps the screen (real screenshots — TODO(client) per screen):

| # | Title | Copy | Source |
|---|---|---|---|
| 01 | Transferts | Envoyez de l’argent à vos proches, rapidement et en toute sécurité. | [Legacy] |
| 02 | Paiement instantané PI-SPI | Envoyez et recevez de l’argent en quelques secondes, 24 h/24 et 7 j/7, vers toutes les banques et établissements de monnaie électronique de l’UEMOA. | [Store] — validate |
| 03 | Factures | Réglez vos factures en quelques clics : Senelec, Sen’Eau, Woyofal, Rapido, Expresso et plus encore. | [Legacy] — validate biller list |
| 04 | Rechargements | Rechargez vos cartes et achetez du crédit téléphonique instantanément. | [Legacy] |
| 05 | Paiement marchand | Payez vos commerçants préférés en scannant leur QR code. | [Legacy] + [Store] |
| 06 | Gestion financière | Consultez votre solde et l’historique de vos opérations à tout moment. | [Proposition] |
| 07 | Cagnottes | Réunissez des fonds à plusieurs pour un projet commun. | [Proposition] — brief lists "cagnottes"; confirm behaviour |
| 08 | RAPS | Rechargez et gérez vos porte-clés NFC pour payer sans contact. → `/raps` | [Store] |
| 09 | Bons d’achat | Offrez et utilisez des bons d’achat digitaux. | [Store] — validate |
| — | Et plus encore | Découvrez tous les services disponibles dans l’application. | [Brief] "autres services disponibles" |

4. **Démarrer [mist]** — `Steps` **[Legacy]**: `Créez votre compte` — Inscrivez-vous en quelques clics. · `Validez votre compte` — Confirmez votre inscription pour accéder à toutes les fonctionnalités. · `Utilisez l’application` — Profitez de nos services et explorez les possibilités offertes. Note: `Pièce requise : carte nationale d’identité ou passeport.` **[Legacy FAQ + privacy policy]**
5. **Sécurité [ink]** — `Code PIN, vérification d’identité à l’ouverture du compte, établissement agréé par la BCEAO.` **[Proposition, grounded in the app and privacy policy]** + `ComplianceLine`.
6. **CTA [paper]** — H2 `Téléchargez Samir Money.` **[Proposition]** + StoreBadges; on desktop a QR code to `/app`.

### 9.3 Professionnels `/professionnels` — SamirPay
Brief: *Présentation du TPE, de SamirPay Business et du Web Admin, avec leurs avantages et fonctionnalités.*

1. **Hero [ink]** (`#apercu`) — Eyebrow `SamirPay · Professionnels`; H1 `Encaissez. Suivez. Pilotez.` **[Proposition — built from the three brief product lines]**; lead `SamirPay réunit le TPE, l’application SamirPay Business et le Web Admin pour gérer vos encaissements, en boutique comme à distance.` **[Proposition]**; CTAs `Nous contacter` (→ `/contact?profil=commercant`) · `Télécharger SamirPay Business`; visual: merchant using the TPE (**Shoot – Marchands 2025**) or a TPE + phone + dashboard composition.
2. **LocalNav**: TPE · Business · Web Admin · Démarrer · FAQ — CTA "Nous contacter". Mount `LegacyHashHandler` (§8.4).
3. **`#tpe` [paper]** — Eyebrow `01 — SamirPay TPE`; H2 `Un seul terminal. Tous vos encaissements.` **[Proposition]**; lead **[Brief]** `Encaissez plusieurs moyens de paiement sur un seul terminal.`; "Converge" scene (method chips orbit, then snap into the terminal screen) over the 2026 TPE product shot. Legacy fact: the TPE accepts wallet (mobile money) payments **[Legacy]**. `SpecList` keys only until supplied — TODO(client): moyens de paiement acceptés, connectivité, autonomie, impression de reçus, sans contact, dimensions et poids, garantie et SAV. Do not name the hardware OEM. CTA `Demander un TPE` → `/contact?profil=commercant&sujet=tpe`.
4. **`#business` [mist]** — Eyebrow `02 — SamirPay Business`; H2 `Tous les opérateurs. Une seule application.` **[Proposition, from the store listing]**; lead **[Brief]** `Encaissez et suivez votre activité depuis votre smartphone.`; features **[Store]**: Compatible avec tous les opérateurs mobiles · Interface intuitive et ergonomique pour une prise en main rapide · Transactions rapides et sécurisées · Gestion simplifiée de vos paiements au quotidien · Lien de paiement personnalisé : envoyez à vos clients un lien direct pour régler leurs achats en quelques clics. Screens (A-SPB-01…09): connexion par numéro + code PIN, montant total et transactions récentes, encaissement en monnaie électronique ou en espèces, QR code, lien de paiement permanent. Video A-VID-02 (vertical presentation, FR) in a phone frame, click to play, captions. In-shop photo (**Shoot – Marchands 2025** or **Shooting Resto – Sept 24**). StoreBadges (iOS + Android).
5. **`#web-admin` [ink]** — Eyebrow `03 — SamirPay Web Admin`; H2 `Toutes vos opérations. Un seul tableau de bord.` **[Proposition]**; lead **[Brief]** `Centralisez et pilotez vos opérations professionnelles.`; browser frame with the dashboard (A-WEB-01) + `Hotspots` **[Legacy]**: 1 `Solde global` · 2 `Transactions détaillées par opérateur` · 3 `Export de rapports` · 4 `Un compte centralisé pour toutes vos transactions en monnaie électronique, pour une réconciliation simplifiée.` CTAs `Accéder au Web Admin` (URL TODO(client) — hidden until known) · `Demander une démo` → `/contact?profil=entreprise&sujet=web-admin`.
6. **`#demarrer` [paper]** — H2 `Démarrez avec SamirPay.` **[Proposition]**; `Checklist` **[Legacy FAQ]**: `Pour les entreprises : NINEA, registre de commerce, justificatif d’adresse et carte d’identité du gérant.`; Steps **[Proposition]**: Contactez nos équipes → Transmettez vos documents → Commencez à encaisser.
7. **`#faq` [mist]** — FAQ from Appendix B.3 (questions 4 and 6 hidden until validated).
8. **CTA [ink]** — reuse home S6.

### 9.4 RAPS `/raps`
Brief: *Présentation du porte-clés, de son fonctionnement et des cas d’usage : cantines, commerces, entreprises et autres environnements compatibles.*

1. **Hero [ink]** — Eyebrow `RAPS · Paiement NFC`; H1 `RAPS`; lead **[Brief]** `Payez sans contact grâce à la technologie NFC.`; hero: keychain macro from **Shoot RAPS / TPE 2026** with NFC ripple rings; CTA `Équiper mon établissement` → `/contact?sujet=raps`; link `Gérer mon porte-clés dans Samir Money` → `/particuliers`.
2. **Comment ça marche [paper]** — `TapRipple` scroll scene + steps **[Proposition — validate]**: `Rechargez` — Rechargez votre porte-clés RAPS depuis l’application Samir Money. **[Store]** · `Approchez` — Présentez le porte-clés devant un terminal compatible. · `C’est payé` — Le paiement est validé en un instant.
3. **Cas d’usage [mist]** — four cards (categories **[Brief]**, lines **[Proposition]**), each with a shoot photo where available: Cantines — Fluidifiez le passage en caisse des élèves et du personnel. · Commerces — Encaissez les petits montants en un geste. · Entreprises — Simplifiez les paiements du quotidien sur site : restauration, boutiques et services internes. · Autres environnements compatibles — Vous avez un autre usage en tête ? Parlons de votre projet. (Cantine photos: consent rules §1.7.)
4. **FAQ [paper]** — TODO(client): perte ou vol, recharge et plafond, terminaux compatibles, où obtenir un porte-clés. Hidden until supplied.
5. **CTA [ink]**.

### 9.5 Services `/services`
Brief: *Détail de l’encaissement, de la collecte, du paiement de masse et des liens de paiement.*

Hero [paper]: Eyebrow `Nos services`; H1 **[Brief]** `Des solutions pour chaque besoin.`; sticky in-page nav with the four anchors.

Each service = one section: line **[Brief]**, "Pour qui", "Avec" (product chips linking to product pages), "Comment ça marche" (3 steps), the mini-scene from home S2, and one photo from the shoots.

| Anchor | Pour qui [Proposition] | Avec [Proposition, from legacy] | Steps [Proposition] | Extra |
|---|---|---|---|---|
| `#encaissement-multicanal` | Commerçants, entreprises, institutions | SamirPay TPE, SamirPay Business, API SamirPay | Votre client choisit son moyen de paiement → Vous encaissez depuis une seule solution → L’opération apparaît dans votre historique | Accepted methods = TODO(client) |
| `#collecte` | Entreprises (clients), associations (adhérents), institutions (usagers) | SamirPay Business, SamirPay Web Admin, API d’encaissement | Partagez vos moyens de paiement → Vos clients paient → Suivez tout depuis le Web Admin | — |
| `#paiement-de-masse` | Entreprises, institutions | SamirPay Web Admin, API de paiement de masse | Importez vos bénéficiaires → Validez le lot → Les versements sont exécutés | Legacy: salaires, primes, remboursements. Video A-VID-01 ("Décaissement", Wolof) with French subtitles — transcript TODO(client) |
| `#lien-de-paiement` | Commerçants, indépendants, vente en ligne sans site | SamirPay Business (lien personnalisé, lien permanent [Store]) | Créez un lien → Partagez-le par WhatsApp, SMS ou e-mail → Votre client paie en quelques clics | Photo: **Shooting Resto – Sept 24** |

Then two cross-link cards **[Brief lines]**: `API & intégrations` → `/developpeurs` · `Paiement NFC` → `/raps`.

### 9.6 Développeurs `/developpeurs` — whole page [ink], code-forward
Brief: *Présentation des API, des possibilités d’intégration et accès à la documentation technique.*

1. **Hero** — Eyebrow `Développeurs · API SamirPay`; H1 **[Brief]** `Votre plateforme. Notre technologie.`; lead **[Brief]** `Intégrez les solutions de paiement SamirPay directement à votre environnement digital.`; CTAs `Accéder à la documentation` (`site.docsUrl`, TODO(client) — hidden while null) · `Parler à un expert` → `/contact?profil=developpeur&sujet=api`.
2. **Catalogue** — five cards (names **[Brief]**, lines **[Proposition]**): API d’encaissement — Acceptez les paiements de vos clients dans votre application ou votre site. · API de paiement de masse — Automatisez vos versements groupés depuis votre système d’information. · Intégrations e-commerce — Connectez SamirPay à votre boutique en ligne (legacy: wallets et cartes bancaires — validate). · Plugin WooCommerce — Activez SamirPay sur votre boutique WooCommerce (link TODO(client)). · Solutions d’intégration adaptées aux besoins des entreprises — Une intégration pensée pour vos contraintes métier.
3. **Comment ça marche** — `FlowDiagram`: Votre client → Votre plateforme → API SamirPay → Moyen de paiement → Confirmation. Generic; no endpoint names.
4. **Ce que vous obtenez** — only items confirmed by the docs (sandbox, clés, webhooks, SDK, support…): TODO(client); block hidden until confirmed.
5. **Sécurité** — compact `CredentialSeal` × 2.
6. **CTA**.

Code samples: if official docs are supplied, mirror one minimal example exactly (tabs: cURL / Node / PHP). Otherwise show no code — the diagram only.

### 9.7 À propos `/a-propos`
Brief: *Présentation institutionnelle de Samir Money, agrément BCEAO, certification PCI DSS, engagements et partenaires.*

1. **Hero [paper]** — Eyebrow `À propos`; H1 `Des paiements simples, sécurisés et connectés.` **[Proposition, from the brief S1 lead]**.
2. **Mission [paper]** **[Legacy, cleaned]** — `Fort de l’expérience et du savoir-faire de ses fondateurs, Samir Money a choisi d’investir dans le marché du mobile money et des services financiers au Sénégal et en Afrique de l’Ouest. Samir Money propose des solutions de paiement électronique innovantes, adaptées aux besoins des utilisateurs, et contribue au développement de l’inclusion financière.` + a team or office photo if the shoots contain one.
3. **Valeurs [mist]** **[Legacy SamirPay]** — six cards: Simplicité · Accessibilité · Modernité · Innovation · Responsabilité · Collaboration (Appendix B.2, shortened to ≤ 20 words each).
4. **Agrément et sécurité [ink]** — both `CredentialSeal`s + BCEAO verification link.
5. **Engagements [paper]** **[Legacy]** — Inclusion financière · Support dédié aux entreprises · Accompagnement et formation · Tarification transparente (validate wording).
6. **Distinctions et étapes [mist]** — show **only after validation**: Prix de l’Innovation Digitale, Salon Firifinance 2026 (Dakar, 31 mars 2026); intégration à PI-SPI, la plateforme d’interopérabilité des paiements instantanés de la BCEAO.
7. **Partenaires [paper]** — `PartnerWall`.
8. **Identité [mist]** — Samir Money SA, siège, `ComplianceLine`, link to mentions légales.

### 9.8 Contact `/contact`
Brief: *Formulaire commercial, coordonnées et accès WhatsApp.*

- H1 **[Brief S6]** `La solution qu’il vous faut commence ici.` · lead **[Brief S6]**.
- ≥ lg two columns (form 7 cols, details 5 cols); mobile stacked with the WhatsApp button first.
- Form §11.1. Details: Téléphone (`tel:`) · WhatsApp (`wa.me` with prefill) · E-mail · Adresse (static map image + "Itinéraire" → `https://www.google.com/maps/search/?api=1&query=14.698458,-17.465254`) · Horaires TODO(client).
- Support note **[Legacy FAQ, adapted]**: `Déjà client ? Pour toute question sur une transaction, contactez notre support immédiatement après l’opération.`
- No Google Maps iframe (cookies + API key): static map image with "© OpenStreetMap contributors" attribution.

### 9.9 Legal pages (MDX, reading layout, max width 72ch)
- `/mentions-legales` — TODO(client): raison sociale, forme, capital, siège, RCCM, NINEA, directeur de la publication, hébergeur, agrément BCEAO EP.SN.005/2025, contact.
- `/confidentialite` — migrate the Samir Money policy (samirmoney.com/privacy, *« Dernière mise à jour : 14 Mai 2024 »*) as the starting point + a website section (formulaires, mesure d’audience, cookies). Entity mismatch → legal review (Appendix C.6).
- `/cgu` — TODO(client).
- `/suppression-de-compte` — keep the URL. Content: what deletion means (legacy: `Je comprends que la suppression de mon compte est permanente et ne peut pas être annulée.`), how to request it (in-app path + form or e-mail — TODO(client)), what may be retained for legal obligations (privacy policy). Reachable without login (app-store requirement).

### 9.10 Header, footer, 404
- **Footer [ink]**: columns Solutions (six products) · Services (four + API + NFC) · Entreprise (À propos, Contact, Devenir partenaire) · Développeurs (Documentation, API) · Légal (Mentions légales, Confidentialité, CGU, Suppression de compte). StoreBadges, confirmed social icons only, address, phone, e-mail. `ComplianceLine` + `© {year} Samir Money SA`. No agency credit unless requested. Optional sign-off **[Store, validate]**: `Samir Money. Link bou baax bi.`
- **404 [ink]**: big mono `404`, a `ReceiptCard` "Statut : page introuvable", links to the six products and home.

---

## 10. Content model

All copy lives in `src/content/fr/`; types in `src/content/types.ts`. Implement these exactly, then build the other page files (`home.ts`, `particuliers.ts`, `professionnels.ts`, `raps.ts`, `services-page.ts`, `developpeurs.ts`, `a-propos.ts`, `contact.ts`, `faq.ts`, `nav.ts`, `footer.ts`) from §9 and Appendix B.

```ts
// src/content/fr/trust.ts — SINGLE SOURCE OF TRUTH for compliance wording
export const trust = {
  eyebrow: "Sécurité, agrément et certifications",
  title: "La confiance au cœur de chaque transaction.",
  bceao: {
    label: "Établissement de paiement agréé par la BCEAO",
    text: "Samir Money SA est agréé sous la référence EP.SN.005/2025.",
    reference: "EP.SN.005/2025",
    // BCEAO list of approved institutions — Sénégal (updated 29/06/2026). The file name changes yearly: re-check before launch.
    verifyUrl: "https://www.bceao.int/sites/default/files/inline-files/7%20-%20Liste%20S%C3%A9n%C3%A9gal_2026.pdf",
  },
  pciDss: {
    label: "Certification PCI DSS",
    text: "Une certification attestant de notre conformité aux exigences de sécurité applicables à notre périmètre certifié pour la protection des données de cartes de paiement.",
  },
  complianceLine: "Samir Money SA — Établissement de paiement agréé par la BCEAO sous la référence EP.SN.005/2025.",
} as const;
```

```ts
// src/content/fr/products.ts
export type Audience = "particulier" | "commercant" | "entreprise" | "institution" | "developpeur";

export type Product = {
  id: string; index: string; name: string; tagline: string; href: string;
  audiences: readonly Audience[];
  media: string | null; // slot id in media.json, or null → <Placeholder>
};

export const productsSection = { eyebrow: "Nos solutions", cta: "Découvrir" } as const;

export const products: readonly Product[] = [
  { id: "samir-money", index: "01", name: "Samir Money",        tagline: "Votre application de paiement et de gestion financière au quotidien.", href: "/particuliers",              audiences: ["particulier"],                                            media: "tile-samir-money" },
  { id: "tpe",         index: "02", name: "SamirPay TPE",       tagline: "Encaissez plusieurs moyens de paiement sur un seul terminal.",            href: "/professionnels#tpe",       audiences: ["commercant", "entreprise"],                               media: "tile-tpe" },
  { id: "business",    index: "03", name: "SamirPay Business",  tagline: "Encaissez et suivez votre activité depuis votre smartphone.",             href: "/professionnels#business",  audiences: ["commercant", "entreprise"],                               media: "tile-business" },
  { id: "web-admin",   index: "04", name: "SamirPay Web Admin", tagline: "Centralisez et pilotez vos opérations professionnelles.",                 href: "/professionnels#web-admin", audiences: ["entreprise", "institution"],                              media: "tile-web-admin" },
  { id: "raps",        index: "05", name: "RAPS",               tagline: "Payez sans contact grâce à la technologie NFC.",                          href: "/raps",                     audiences: ["particulier", "commercant", "entreprise", "institution"], media: "tile-raps" },
  { id: "api",         index: "06", name: "API SamirPay",       tagline: "Intégrez nos solutions de paiement à vos applications et plateformes.",   href: "/developpeurs",             audiences: ["developpeur", "entreprise"],                              media: null /* code-card composition, no photo */ },
];
```

```ts
// src/content/fr/services.ts
export const servicesSection = { eyebrow: "Nos services", title: "Des solutions pour chaque besoin." } as const;

export const services = [
  { id: "encaissement-multicanal", name: "Encaissement multicanal", line: "Acceptez différents moyens de paiement depuis une seule solution.", href: "/services#encaissement-multicanal", products: ["tpe", "business", "api"] },
  { id: "collecte", name: "Collecte", line: "Collectez les paiements de vos clients, adhérents ou usagers et centralisez leur suivi.", href: "/services#collecte", products: ["business", "web-admin", "api"] },
  { id: "paiement-de-masse", name: "Paiement de masse", line: "Effectuez vos versements groupés : salaires, commissions, prestataires et autres bénéficiaires éligibles.", href: "/services#paiement-de-masse", products: ["web-admin", "api"] },
  { id: "lien-de-paiement", name: "Lien de paiement", line: "Encaissez à distance grâce à un lien partagé par WhatsApp, SMS ou e-mail.", href: "/services#lien-de-paiement", products: ["business"] },
  { id: "api-integrations", name: "API & intégrations", line: "Connectez nos solutions à vos applications, sites e-commerce et systèmes d’information.", href: "/developpeurs", products: ["api"] },
  { id: "paiement-nfc", name: "Paiement NFC", line: "Simplifiez les transactions du quotidien avec RAPS.", href: "/raps", products: ["raps"] },
] as const;

export const apiSection = {
  eyebrow: "Nos API",
  title: "Votre plateforme. Notre technologie.",
  lead: "Intégrez les solutions de paiement SamirPay directement à votre environnement digital.",
  items: [
    "API d’encaissement.",
    "API de paiement de masse.",
    "Intégrations e-commerce.",
    "Plugin WooCommerce.",
    "Solutions d’intégration adaptées aux besoins des entreprises.",
  ],
  cta: "Découvrir nos API",
} as const;
```

```ts
// src/content/fr/site.ts — contact data and links (conflicts: Appendix C.1)
export const site = {
  name: "Samir Money",
  legalName: "Samir Money SA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://samirmoney.com",
  locale: "fr-SN",
  address: {
    street: "Immeuble Khadija Rassoul, 6e étage, Rue 1x A, impasse face Fondation Kéba Mbaye",
    district: "Point E",
    city: "Dakar",
    country: "Sénégal",
    geo: { lat: 14.698458, lng: -17.465254 },
  },
  // TODO(client): confirm main phone — legacy also shows +221 33 889 72 72 and +221 77 300 25 23
  phone: { e164: "+221338242433", display: "+221 33 824 24 33" },
  whatsapp: null as string | null, // TODO(client) — WhatsApp UI hidden while null
  // TODO(client): confirm e-mail — samirpay.com used contact@samirservices.com
  email: "contact@samirmoney.com",
  apps: {
    samirMoney: {
      ios: "https://apps.apple.com/app/id6740030422",
      android: null as string | null, // TODO(client): Google Play URL
    },
    samirPayBusiness: {
      ios: "https://apps.apple.com/app/id6743798245",
      android: "https://play.google.com/store/apps/details?id=sn.samirmoney.samirpaybusiness",
    },
  },
  webAdminUrl: null as string | null,  // TODO(client)
  docsUrl: null as string | null,      // TODO(client)
  wooPluginUrl: null as string | null, // TODO(client)
  social: { linkedin: null, facebook: null, instagram: null, x: null } as Record<string, string | null>, // TODO(client): legacy links were empty placeholders
} as const;
```

`src/content/media.json` is **generated** by `pnpm images` (Appendix A.0.3) — never hand-edit it.

---

## 11. Forms, integrations, analytics

### 11.1 Contact form (`/contact`)

| Field | Type | Required | Notes |
|---|---|---|---|
| Vous êtes | Radio cards: Particulier · Commerçant · Entreprise · Institution · Développeur · Partenaire | ✓ | prefill `?profil=` |
| Sujet | Select: Ouvrir un compte Samir Money · Demander un TPE · SamirPay Business · SamirPay Web Admin · RAPS · API & intégrations · Devenir partenaire · Support · Autre | ✓ | prefill `?sujet=`; options filtered by profil |
| Prénom · Nom | Text | ✓ | `given-name` / `family-name` |
| E-mail | Email | ✓ | `email` |
| Téléphone | Tel, default +221, E.164 validation | ✓ | `tel` |
| Entreprise / organisation | Text | if profil ≠ particulier | `organization` |
| Message | Textarea, 20–2000 chars | ✓ | |
| Consentement | Checkbox | ✓ | `J’accepte que mes données soient utilisées pour traiter ma demande, conformément à la politique de confidentialité.` (link) **[Proposition — legal to validate]** |
| Honeypot + Turnstile | Hidden | — | |

- Zod schema shared client/server. The server action verifies Turnstile, rate-limits (5 per 10 min per IP), e-mails `CONTACT_TO_EMAIL` with subject `[Site] {sujet} — {profil} — {Prénom Nom}`, optionally POSTs to `CRM_WEBHOOK_URL`, and never logs message bodies.
- Success (inline): `Merci, votre demande a bien été envoyée. Notre équipe vous recontacte rapidement.` **[Proposition]** — no SLA unless validated.
- Errors announced via `aria-live`; field errors tied with `aria-describedby`.
- Query values — `sujet`: `compte`, `tpe`, `business`, `web-admin`, `raps`, `api`, `partenariat`, `support`, `autre` · `profil`: `particulier`, `commercant`, `entreprise`, `institution`, `developpeur`, `partenaire`.

### 11.2 WhatsApp
`https://wa.me/<E.164 without +>?text=<encoded>`, prefilled per page (e.g. RAPS: `Bonjour Samir Money, je souhaite des informations sur RAPS.`). Hidden until the number is confirmed.

### 11.3 Newsletter
Both legacy sites had a newsletter form; it is not in the brief → not in v1 (Appendix D).

### 11.4 Analytics events (Plausible custom events)
`cta_click {location,label}` · `product_tile_click {product}` · `audience_filter {value}` · `store_badge_click {app,store}` · `whatsapp_click {page}` · `phone_click` · `email_click` · `docs_click` · `video_play {id}` · `contact_submit {profil,sujet}` · `contact_error {field}`. Goals: `contact_submit`, `store_badge_click`, `docs_click`.

---

## 12. SEO

- `<html lang="fr">`, `og:locale` `fr_SN`; canonical on every page (canonical domain §8.1).
- Metadata **[Proposition]**:

| Route | Title | Description |
|---|---|---|
| `/` | Samir Money — Tous vos paiements. Un seul écosystème. | Application, TPE, encaissement, paiement de masse, NFC et API : les solutions de paiement de Samir Money pour particuliers, commerçants, entreprises et institutions. |
| `/particuliers` | Samir Money — L’application de paiement du quotidien | Transferts, factures, rechargements, paiement marchand et RAPS : gérez vos paiements du quotidien avec l’application Samir Money. |
| `/professionnels` | SamirPay — TPE, application Business et Web Admin | Encaissez plusieurs moyens de paiement, suivez votre activité et pilotez vos opérations avec SamirPay TPE, SamirPay Business et le Web Admin. |
| `/raps` | RAPS — Le paiement sans contact NFC par Samir Money | Le porte-clés NFC RAPS pour payer sans contact : cantines, commerces, entreprises et autres environnements compatibles. |
| `/services` | Encaissement, collecte, paiement de masse, lien de paiement | Les services de paiement Samir Money : encaissement multicanal, collecte, paiement de masse et lien de paiement. |
| `/developpeurs` | API SamirPay — Intégrez le paiement à vos plateformes | API d’encaissement, API de paiement de masse, intégrations e-commerce et plugin WooCommerce. |
| `/a-propos` | À propos de Samir Money — Établissement de paiement agréé | Samir Money SA, établissement de paiement agréé par la BCEAO (EP.SN.005/2025) : agrément, certification PCI DSS, engagements et partenaires. |
| `/contact` | Contacter Samir Money | Commerçant, entreprise, institution ou développeur : échangeons sur vos besoins. |

- JSON-LD (`lib/schema.ts`): `Organization` + `FinancialService` (name, legalName, url, logo, address, geo, telephone once confirmed, `sameAs` with confirmed socials only); `WebSite`; `MobileApplication` for Samir Money and SamirPay Business (`applicationCategory: "FinanceApplication"`, `operatingSystem`, `offers.price: 0`, install URLs); `FAQPage` on `/professionnels`; `BreadcrumbList` on inner pages. No `aggregateRating`.
- OG images via `next/og` per route (ink background, grid, product name in display type, compliance line in mono); default OG may use a shoot photo.
- `sitemap.ts`, `robots.ts` (allow all; disallow `/api/`).
- One H1 per page; logical H2/H3; every service ↔ product interlinked.

---

## 13. Performance budget and images

Mobile, Moto G Power class, Slow 4G:

| Metric | Budget |
|---|---|
| LCP | ≤ 2.5 s (home: the H1 text, or a preloaded image ≤ 120 KB AVIF) |
| CLS | ≤ 0.05 (width/height from `media.json`, aspect ratios reserved) |
| INP | ≤ 200 ms |
| JS, initial route (gzip) | ≤ 170 KB (home: Three.js ≈ 133 KB and GSAP ≈ 52 KB load after first paint, outside this budget — §3.1 home exception) |
| Fonts | Open Sans, variable, latin + latin-ext |
| Photos (AVIF) | full-bleed ≤ 200 KB @1920w · card ≤ 70 KB @1080w · tile ≤ 45 KB @768w · thumbnail ≤ 20 KB @480w — enforced by `pnpm images` |
| Video | never in the critical path; `preload="none"`; transcoded (A.7); ambient loops ≤ 2 MB or none |
| Third parties | Plausible (≈ 1 KB) + Turnstile on `/contact` only |

Image rules:
- Every image comes from `media.json` through `<Photo>` (`next/image`) with an explicit `sizes` (e.g. tile: `(min-width:1024px) 33vw, 50vw`; full-bleed: `100vw`), `placeholder="blur"` and the dominant colour as background.
- Only the LCP image is preloaded; everything below the fold lazy-loads.
- No remote image domains: all images are local.
- Motion code is client-only and split per section (`dynamic(() => import(...))` for heavy scenes). Respect Save-Data.

---

## 14. Accessibility (WCAG 2.2 AA)

- Skip link `Aller au contenu`; landmarks; one H1.
- Focus visible everywhere: 2 px accent ring + 2 px offset on dark, samir-700 on light.
- Keyboard: mega menu, mobile sheet (focus trap, Esc), accordions, hotspots (tabbable buttons), audience chips (radio-group semantics).
- Motion: `prefers-reduced-motion` → static scenes; no content only visible mid-animation; pinned scenes never trap scrolling; no parallax.
- Split-text animation: the full string stays as text; animated word spans are `aria-hidden` with an `sr-only` copy — or animate whole lines.
- Contrast per §6; text over photos always sits on a scrim that keeps AA.
- Targets ≥ 44 × 44 px with spacing.
- Media: French captions (`.vtt`) for every video; transcript link; the Wolof video gets French subtitles.
- Forms: visible labels, textual required markers and errors, `autocomplete` attributes.
- Alt text in French and specific ("Commerçante encaissant un paiement avec le terminal SamirPay TPE"); empty alt for decorative images. Alt drafts live in `assets/selection.json`.
- Test with VoiceOver (iOS), TalkBack (Android), NVDA (Windows).

---

## 15. Security, privacy, compliance

### 15.1 Headers (`next.config.ts` → `headers()`)
- `Content-Security-Policy`: `default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self'; connect-src 'self' https://plausible.io; frame-src https://challenges.cloudflare.com; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests`. `style-src 'unsafe-inline'` is required by the inline styles that next/image and Motion render; move scripts to nonces if feasible; development also needs `'unsafe-eval'`.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` · `X-Content-Type-Options: nosniff` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`.

### 15.2 Privacy
- No cookies by default (Plausible). Any tracker requiring consent → consent banner first.
- Form data is transmitted, not stored by the website; say so in the "Site web" section of the privacy policy.
- All photo metadata (EXIF, GPS) is stripped by the image pipeline.
- Senegalese data-protection framework (CDP — Commission de Protection des Données Personnelles): the legal team validates all privacy wording and supplies the exact legal references.

### 15.3 Regulatory wording guardrails (compliance review before launch)
- Licence: only the brief sentences (§9.1-S4) and `complianceLine`. Never "certifié par la BCEAO", "garanti par la BCEAO", "banque agréée".
- PCI DSS: always with the scope qualifier; never "niveau 1" or "100 % sécurisé" unless documented.
- E-money: avoid "nous émettons de la monnaie électronique"; neutral wording ("votre compte Samir Money", "vos paiements") until compliance confirms.
- Fees: do not publish the legacy "1 % puis gratuit" claim (Appendix C.4) without written validation.
- Transaction ceilings (legacy FAQ: 2 000 000 FCFA/jour, 10 000 000 FCFA/mois) and refund delays: publish only if validated as current.
- Partner and operator names or logos: validated and authorised only.
- Awards, PI-SPI: only after validation, with date and source.

---

## 16. Build phases

| Phase | Scope | Exit criteria |
|---|---|---|
| P0 | Scaffold, tokens, fonts, content skeleton; `assets:drive` + `assets:legacy`; curate `selection.json`; `pnpm images` | Repo builds; `/dev/tokens` (dev only) shows colours, type, motion; `media.json` generated within budgets |
| P1 | Header, mega menu, mobile menu, footer, Section/Button/Eyebrow/Heading, Reveal/Stagger, Photo | Keyboard, reduced-motion and 320 px passes |
| P2 | Home (S1–S6) | Client review gate on the preview URL |
| P3 | Professionnels, Particuliers | FeatureChapter, DeviceFrame, Hotspots, LocalNav done |
| P4 | RAPS, Services, Développeurs | FlowDiagram, TapRipple done |
| P5 | À propos, Contact + server action, legal pages, 404 | Form delivers to the inbox; spam protection on |
| P6 | SEO (metadata, OG, JSON-LD, sitemap), redirects, analytics, headers | Redirect tests green |
| P7 | Performance and accessibility hardening, content check, cross-device QA, launch | §17 all green; `STRICT_CONTENT=1` build passes |

---

## 17. QA and definition of done

- **Brief coverage:** `tests/brief-coverage.spec.ts` keeps its own hard-coded copy of the brief's site copy (B.1: section titles and leads, the six product lines, the six service lines, the API items and button, both compliance texts, S5–S6 copy and buttons) and asserts each string is on the right page, compared case-insensitively after normalising U+202F / U+00A0 to spaces and ’ to '. The DESIGN notes and page descriptions in B.1 are instructions, not copy.
- Routes return 200; legacy URLs return 308 to the right targets (test host rules by sending a `Host: samirpay.com` header to the deployment); `/suppression-de-compte` and `/confidentialite` reachable.
- Lighthouse mobile ≥ 95 × 4 on `/`, `/particuliers`, `/professionnels`, `/raps`, `/services`, `/developpeurs`, `/a-propos`, `/contact`.
- axe: 0 serious / critical. Manual keyboard + screen-reader pass on home and contact.
- Devices: Chrome Android (real mid-range device), Safari iOS (latest − 1), Chrome / Safari / Firefox / Edge desktop. Widths 320, 360, 390, 768, 1024, 1280, 1440, 1920.
- Reduced-motion and Save-Data modes verified.
- `pnpm images` passes (no budget overrun, missing alt or pending release); no image over 2560 px; no EXIF/GPS metadata in `public/media` (spot-check: `exiftool -gps:all -exif:all <file>` prints nothing).
- No `TODO(client)` in production content; no `Placeholder` rendered.
- Contact form tested end-to-end (success, validation, spam challenge, rate limit).
- Client sign-off on: compliance seals, partner list, photo selection and releases, all [Proposition] copy.

---

## Appendix A — Assets

Precedence: **A.0 client photo shoots** → A.2 store screenshots and Web Admin captures → legacy renders. Never reference any of these URLs at runtime.

### A.0 Client photo shoots (Google Drive) — primary photography

| Shoot | Folder ID | Link | Intended use |
|---|---|---|---|
| **Shoot – Marchands 2025** | `1SrbHgUyiAEQSKvA5mk3aQ6KhmjXKMCe2` | https://drive.google.com/drive/folders/1SrbHgUyiAEQSKvA5mk3aQ6KhmjXKMCe2?usp=sharing | Professionnels hero and chapters (TPE in use, Business app in shop), Services (encaissement, collecte), home S6 background, À propos |
| **Shoot RAPS / TPE Av2026** | `1YsUN3JOeoBwwZJQzPHvt5GnTo7nFjYo-` | https://drive.google.com/drive/folders/1YsUN3JOeoBwwZJQzPHvt5GnTo7nFjYo-?usp=sharing | Product heroes — RAPS keychain (home tile 05, `/raps` hero and steps) and SamirPay TPE (home tile 02, `/professionnels#tpe`). Most recent: prefer over every legacy render |
| **Shooting Resto – Sept 24** | `1xmOrrp3eeQl3qiQPgE8oxTR9yDaG5u-d` | https://drive.google.com/drive/folders/1xmOrrp3eeQl3qiQPgE8oxTR9yDaG5u-d?usp=share_link | Use cases — restaurants and shops: Services (`#lien-de-paiement`, `#encaissement-multicanal`), RAPS cards (Commerces, Entreprises — restauration), Particuliers (Paiement marchand) |

> The folders' contents were **not** inventoried during research (Drive blocked automated listing). The first P0 task is to download, inventory and curate them.

#### A.0.1 Download — `scripts/fetch-drive.sh`
The folders must stay shared as "Anyone with the link".
```bash
#!/usr/bin/env bash
# Downloads the client's Google Drive photo shoots into assets/drive/<shoot>/ (git-ignored).
# Needs gdown: `pipx install gdown` (or `uv tool install gdown`).
set -euo pipefail
cd "$(dirname "$0")/.."
command -v gdown >/dev/null || { echo "gdown not found — install it: pipx install gdown" >&2; exit 1; }

while IFS='|' read -r shoot url; do
  mkdir -p "assets/drive/$shoot"
  gdown --folder "$url" -O "assets/drive/$shoot" --remaining-ok </dev/null \
    || echo "WARN $shoot incomplete — download the folder as a .zip from Drive and unzip it into assets/drive/$shoot" >&2
done <<'LIST'
marchands-2025|https://drive.google.com/drive/folders/1SrbHgUyiAEQSKvA5mk3aQ6KhmjXKMCe2
raps-tpe-2026|https://drive.google.com/drive/folders/1YsUN3JOeoBwwZJQzPHvt5GnTo7nFjYo-
resto-2024|https://drive.google.com/drive/folders/1xmOrrp3eeQl3qiQPgE8oxTR9yDaG5u-d
LIST

find assets/drive -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.tif' -o -iname '*.tiff' \
  -o -iname '*.webp' -o -iname '*.heic' -o -iname '*.dng' -o -iname '*.cr2' -o -iname '*.cr3' -o -iname '*.nef' -o -iname '*.arw' \) \
  | sort > assets/drive/INVENTORY.txt
echo "Inventory: $(wc -l < assets/drive/INVENTORY.txt | tr -d ' ') files → assets/drive/INVENTORY.txt"
```
- gdown downloads at most 50 files per folder (`--remaining-ok` takes the first 50 instead of failing) and can hit Drive quotas. For bigger shoots, use Drive's "Télécharger" (zip) and unzip into the same paths, or `rclone` with a Drive remote.
- RAW (`.cr2`, `.cr3`, `.nef`, `.arw`, `.dng`) and HEIC files are not supported by sharp's prebuilt binaries: ask the client or photographer for graded JPEG/TIFF exports (sharp does not develop RAW).

#### A.0.2 Curate — `assets/selection.json` (committed)
One entry per **slot**. Slots: `tile-samir-money`, `tile-tpe`, `tile-business`, `tile-web-admin`, `tile-raps`, `home-s6-bg`, `pro-hero`, `pro-tpe-1…3`, `pro-business-shop`, `raps-hero`, `raps-step-1…3`, `raps-case-cantines`, `raps-case-commerces`, `raps-case-entreprises`, `raps-case-autres`, `svc-encaissement`, `svc-collecte`, `svc-masse`, `svc-lien`, `about-mission`, `og-default`.

```json
[
  { "slot": "raps-hero", "file": "assets/drive/raps-tpe-2026/<FILE>.jpg", "kind": "hero", "ratio": "16/9", "position": "attention",
    "alt": "Porte-clés RAPS présenté devant un terminal de paiement", "release": "ok" },
  { "slot": "tile-tpe", "file": "assets/drive/raps-tpe-2026/<FILE>.jpg", "kind": "tile", "ratio": "4/5",
    "alt": "Terminal de paiement SamirPay TPE", "release": "n/a" }
]
```
- `kind`: `hero` (full-bleed) · `card` · `tile` · `thumb` — sets the budget (§13). `ratio` optional (`"16/9"`, `"4/5"`, `"1/1"`, `"3/4"`). `position`: `attention` (default), `entropy`, `centre`, `north`… `budgetKb`: optional override when a busy but essential frame exceeds its budget (justify it in the PR).
- `release`: `ok` (signed), `n/a` (no identifiable person), `pending` (do not ship), `minor-consent` (parental consent on file).
- Selection criteria: product sharp and clearly visible; real context; diverse merchants; no readable personal data on screens (blur if needed); no prominent competitor branding; straight horizons; consistent grade.

#### A.0.3 Resize and optimise for fast loading — `scripts/optimize-images.mjs`
For each slot, in one decode: apply the EXIF orientation → crop to the slot ratio (smart crop) → downscale to ≤ 2560 px (never upscale) → convert to sRGB and drop all metadata (EXIF, GPS, XMP) → write a content-hashed master for `next/image` (JPEG q82 mozjpeg, or PNG for cut-outs with transparency) → check the AVIF weight budget at display width → make a blur placeholder and background colour → write `src/content/media.json`. `next/image` then serves AVIF/WebP at the right width for each screen. `--variants` also writes static AVIF / WebP / JPEG files at 480 / 768 / 1080 / 1440 / 1920 / 2560 px. The script exits non-zero on a budget overrun, missing alt text, unreleased photo or unreadable file. Tested with sharp 0.35: a few seconds per photo; `--variants` takes several times longer.

```js
// scripts/optimize-images.mjs — usage: node scripts/optimize-images.mjs [assets/selection.json] [--variants]
// Crops, resizes and compresses every curated image for fast loading, then writes src/content/media.json.
// --variants also writes static AVIF/WebP/JPEG files at each width (OG images, e-mails, hosting without next/image).
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const args = process.argv.slice(2);
const SELECTION = args.find((a) => !a.startsWith("--")) ?? "assets/selection.json";
const VARIANTS = args.includes("--variants");
const OUT = "public/media/photos";
const MANIFEST = "src/content/media.json";
const WIDTHS = [480, 768, 1080, 1440, 1920, 2560];
const MAX_EDGE = 2560;
const AVIF = { quality: 50, effort: 4 }; // effort 6+ is ~4× slower for no real size gain
const BUDGET = { // max AVIF weight at the width each kind of slot is displayed
  hero: { width: 1920, kb: 200 },
  card: { width: 1080, kb: 70 },
  tile: { width: 768, kb: 45 },
  thumb: { width: 480, kb: 20 },
};
const RELEASES = ["ok", "n/a", "minor-consent"];

const selection = JSON.parse(await fs.readFile(SELECTION, "utf8"));
await fs.rm(OUT, { recursive: true, force: true }); // full regeneration: no stale files
await fs.mkdir(OUT, { recursive: true });
const manifest = {};
const problems = [];

for (const item of selection) {
  try {
    if (!RELEASES.includes(item.release)) throw new Error(`release is "${item.release}" — not exported`);
    if (typeof item.alt !== "string") throw new Error(`missing "alt" (use "" for decorative images)`);
    const budget = BUDGET[item.kind];
    if (!budget) throw new Error(`unknown kind "${item.kind}"`);
    if (item.ratio && !/^\d+\/\d+$/.test(item.ratio)) throw new Error(`ratio must look like "16/9"`);

    // 1. Upright source size (EXIF orientations 5–8 swap width and height).
    const meta = await sharp(item.file).metadata();
    const turned = (meta.orientation ?? 1) >= 5;
    let w = turned ? meta.height : meta.width;
    let h = turned ? meta.width : meta.height;

    // 2. Target size: optional crop to the slot ratio, long edge ≤ 2560 px, never upscaled.
    if (item.ratio) {
      const [rw, rh] = item.ratio.split("/").map(Number);
      if (w / h > rw / rh) w = Math.round((h * rw) / rh);
      else h = Math.round((w * rh) / rw);
    }
    const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
    w = Math.round(w * scale);
    h = Math.round(h * scale);

    // 3. One decode: auto-orient → crop + downscale → sRGB → raw pixels. Outputs carry no metadata (EXIF, GPS, XMP).
    const { data, info } = await sharp(item.file, { failOn: "none" })
      .rotate()
      .resize({ width: w, height: h, fit: "cover", position: item.position ?? "attention" })
      .toColourspace("srgb")
      .raw()
      .toBuffer({ resolveWithObject: true });
    const raw = { width: info.width, height: info.height, channels: info.channels };
    const px = () => sharp(data, { raw });
    const alpha = info.channels === 4;

    // 4. Master for next/image, content-hashed so no cache ever serves a replaced photo.
    const master = await (alpha ? px().png({ compressionLevel: 9 }) : px().jpeg({ quality: 82, mozjpeg: true })).toBuffer();
    const id = `${item.slot}-${createHash("sha1").update(master).digest("hex").slice(0, 8)}`;
    const ext = alpha ? "png" : "jpg";
    await fs.writeFile(path.join(OUT, `${id}.${ext}`), master);

    // 5. Weight budget: AVIF at the width this kind of slot is displayed (override per item with "budgetKb").
    const checkW = Math.min(budget.width, info.width);
    const kb = Math.round((await px().resize({ width: checkW }).avif(AVIF).toBuffer()).length / 1024);
    const limit = item.budgetKb ?? budget.kb;
    if (kb > limit) problems.push(`${item.slot}: ${kb} KB AVIF @${checkW}w > ${limit} KB — crop tighter or pick a calmer frame`);

    // 6. Optional static variants, never upscaled.
    let variants;
    if (VARIANTS) {
      const widths = [...new Set([...WIDTHS.filter((x) => x < info.width), info.width])];
      const dir = path.join(OUT, id);
      await fs.mkdir(dir, { recursive: true });
      for (const x of widths) {
        const at = () => px().resize({ width: x });
        await at().avif(AVIF).toFile(path.join(dir, `${x}.avif`));
        await at().webp({ quality: 72 }).toFile(path.join(dir, `${x}.webp`));
        if (!alpha) await at().jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(dir, `${x}.jpg`));
      }
      variants = { base: `/media/photos/${id}/`, widths, formats: alpha ? ["avif", "webp"] : ["avif", "webp", "jpg"] };
    }

    // 7. Blur placeholder + dominant colour, shown while the image loads.
    const lqip = await px().resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
    const { dominant: c } = await px().stats();

    manifest[item.slot] = {
      src: `/media/photos/${id}.${ext}`,
      width: info.width,
      height: info.height,
      alt: item.alt,
      blurDataURL: `data:image/webp;base64,${lqip.toString("base64")}`,
      color: alpha ? "transparent" : `rgb(${c.r} ${c.g} ${c.b})`,
      ...(variants && { variants }),
    };
    console.log(`ok   ${item.slot.padEnd(24)} ${info.width}×${info.height}  ${kb} KB AVIF @${checkW}w`);
  } catch (err) {
    problems.push(`${item.slot}: ${err.message}`);
  }
}

await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${Object.keys(manifest).length}/${selection.length} images optimised → ${MANIFEST}`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
```
- `src/content/media.json` is keyed by slot: `{ src, width, height, alt, blurDataURL, color, variants? }`.
- Run every image on the site through it: shoot photos, curated legacy renders and store screenshots alike.
- AVIF uses effort 4: in testing, effort 6 was about 4× slower for no size gain.

### A.1 Brand

| ID | Asset | Source URL | Size | Use |
|---|---|---|---|---|
| A-LOGO-SM | Samir Money logo (header) | https://samirmoney.com/wp-content/uploads/2024/06/logo-samirmoney-header.png | — | Header on light — request SVG |
| A-LOGO-SM-W | Samir Money logo (white) | https://samirmoney.com/wp-content/uploads/2024/06/logo-samirmoney-white.png | — | Header / footer on ink |
| A-LOGO-SM-F | Samir Money logo (footer) | https://samirmoney.com/wp-content/uploads/2019/02/logo-samirmoney-footer.png | — | Reference |
| A-ICON-SM | App icon / favicon | https://samirmoney.com/wp-content/uploads/2024/07/cropped-favicon-2.png | 512×512 | Favicon, apple-touch-icon |
| A-LOGO-SP | SamirPay logo | https://samirpay.com/wp-content/uploads/2024/08/logo_samir_pay3.png | — | Product lockup |
| A-LOGO-SP-HR | SamirPay logo (hi-res) | https://samirpay.com/wp-content/uploads/2024/08/Logo-samirpay-.webp | 1500×391 | Product lockup (preferred) |
| A-LOGO-SP-W | SamirPay logo (white) | https://samirpay.com/wp-content/uploads/2024/08/logo_samir_pay_white1.webp | 476×97 | On ink |
| A-ICON-SP | SamirPay favicon | https://samirpay.com/wp-content/uploads/2024/08/favicons.webp | 96×87 | Reference |

### A.2 Products and interfaces (fallbacks for A.0, plus screenshots)

| ID | Asset | Source URL | Size | Use |
|---|---|---|---|---|
| A-TPE-01 | TPE render (Dec 2024) | https://samirpay.com/wp-content/uploads/2024/12/TPE.-V2-1-1.png | 645×985 | Fallback tile 02 / `#tpe` |
| A-TPE-02 | TPE render | https://samirpay.com/wp-content/uploads/2024/11/TPE-22.png | 467×1007 | Fallback |
| A-TPE-03 | TPE render | https://samirpay.com/wp-content/uploads/2024/11/TPE-V2-.jpg | 766×1080 | Fallback |
| A-TPE-04 | TPE render (tall) | https://samirpay.com/wp-content/uploads/2024/08/TPE-resized1.webp | 700×1503 | Fallback |
| A-TPE-05 | TPE render | https://samirpay.com/wp-content/uploads/2024/08/TPE-1.webp | 766×1080 | Fallback |
| A-TPE-06 | Terminal front (file named "QashierXS") | https://samirmoney.com/wp-content/uploads/2024/09/QashierXS-front-ph-reviewed.png | 454×999 | Fallback — confirm it is the current SamirPay TPE |
| A-APP-01 | Samir Money phone mockup | https://samirmoney.com/wp-content/uploads/2024/09/rev-tel-1-1-1-reviewed.png | 433×698 | Fallback until new screenshots |
| A-APP-02 | Samir Money phone mockup (older) | https://samirmoney.com/wp-content/uploads/2024/06/rev-tel-1-1-1.png | 433×698 | Reference |
| A-APP-03 | Mobile mockup (samirpay) | https://samirpay.com/wp-content/uploads/2024/08/mobile1-2-709x1024-1.webp | 709×1024 | Reference |
| A-APP-04 | "Inscription" visual | https://samirpay.com/wp-content/uploads/2024/08/inscription.webp | 681×1024 | `#demarrer` (check content) |
| A-WEB-01 | Web Admin dashboard | https://samirpay.com/wp-content/uploads/2024/11/dashboard.png | 1536×964 | Tile 04, `#web-admin` |
| A-WEB-02 | Web Admin capture | https://samirpay.com/wp-content/uploads/2024/11/Capture-decran-2024-11-10-a-22.01.40.png | 927×574 | Hotspots alternative |
| A-INT-01 | Integration illustration | https://samirpay.com/wp-content/uploads/2024/08/integration-content-img1.webp | 881×929 | Reference for the API visual |
| A-SVC-01/02 | Services illustrations | https://samirpay.com/wp-content/uploads/2024/12/services-updated2.png · https://samirpay.com/wp-content/uploads/2024/12/services-updated.png | 881×929 | Reference only |
| A-ILL-01 | Composite visual | https://samirpay.com/wp-content/uploads/2024/08/IMAGES-.webp | 1790×1608 | Inspect; may contain product shots |
| A-SPB-01…09 | SamirPay Business App Store screenshots (simulator captures) | `is1-ssl.mzstatic.com` URLs in A.6 | 471×1024 | `#business` — ask for clean hi-res exports |

Samir Money app screenshots could not be extracted from the store page → TODO(client): export from App Store Connect.

### A.3 Video

| ID | Asset | Source URL | Specs | Use |
|---|---|---|---|---|
| A-VID-01 | « SAMIR PAY – DÉCAISSEMENT – WOLOF » | https://samirpay.com/wp-content/uploads/2025/02/SAMIR-PAY-DECAISSEMENT-WOLOF.mp4 | 1920×1080, 44 s, 59 MB | `/services#paiement-de-masse` with French subtitles |
| A-VID-02 | « Presentation SAMIRPAY French 9-16 v5 » | https://samirpay.com/wp-content/uploads/2024/12/Presentation-SAMIRPAY-French-9-16-v5.mp4 | 1080×1920, 81 s, 49 MB | `/professionnels#business` in a phone frame |

### A.4 Partners and billers (validation and authorisation required)

| ID | Name | Source URL |
|---|---|---|
| A-PTN-01 | Senelec | https://samirmoney.com/wp-content/uploads/2024/06/client_senelect.png |
| A-PTN-02 | Woyofal | https://samirmoney.com/wp-content/uploads/2024/06/client_woyofal.png |
| A-PTN-03 | Sen’Eau | https://samirmoney.com/wp-content/uploads/2024/06/client_seneau.png |
| A-PTN-04 | Oolu | https://samirmoney.com/wp-content/uploads/2024/06/client_oolu.png |
| A-PTN-05 | Rapido | https://samirmoney.com/wp-content/uploads/2024/06/client_rapidio.png |
| A-PTN-06 | DER/FJ | https://samirmoney.com/wp-content/uploads/2024/06/client_der.png |
| A-BIL-01…06 | Biller icons from the legacy animation (Senelec, Sen’Eau, Rapido, DER, DGID, "Touba") | `https://samirmoney.com/wp-content/uploads/2024/06/anim_<name>.png` (588×690) — reference for the Factures feature; clarify DGID and "Touba" |

### A.5 Reference only / do not reuse
- **Reference only** (legacy decoration): `bgimage-1536x1127-V2-.jpg`, `bgimage.png` (samirpay); `aa_bg_1_captivis2.jpg`, `au_img_layer_1_captivis.png`, `au_img_layer_2-_captivis.png`, `images-3-A-propos-.jpg`, `2.png`, `images_layers_1-01-copie.png`, `s_img_layer_1-1.png` (samirmoney).
- **Do not reuse — unclear stock licence:** `image-from-rawpixel-id-1226980-reviewed.png` (samirmoney), `pexels-768x856-1.webp`, `man-2-2-1.webp` (+ `-1363x2048-2`) (samirpay).
- **Do not reuse — AI-generated:** the DALL·E account-deletion illustration on `/suppression-de-compte`.
- **Do not reuse — template leftovers:** `placeholder*.png/webp`, Slider Revolution `dummy.png`, theme-demo testimonial avatars hot-linked from finestwp.co, `number_01…06.png`, `page_title_bg-new.png`, `footer_home_1-new.png`, `letter-q-new.png`, `shape.webp`, `l6-fea-content*.webp`, `Job-View*.png`.

### A.6 Legacy fetch — `scripts/legacy-assets.txt` + `scripts/fetch-legacy-assets.sh`
```bash
#!/usr/bin/env bash
# Downloads the legacy assets listed in scripts/legacy-assets.txt (one "dest|url" per line) into assets/legacy/.
set -euo pipefail
cd "$(dirname "$0")/.."
fail=0
while IFS='|' read -r dest url || [[ -n "${dest:-}" ]]; do
  [[ -z "${dest// }" || "$dest" == \#* ]] && continue
  mkdir -p "assets/legacy/$(dirname "$dest")"
  if curl -fsSL --retry 3 --max-time 180 "$url" -o "assets/legacy/$dest"; then echo "ok   $dest"; else echo "FAIL $url" >&2; fail=$((fail + 1)); fi
done < scripts/legacy-assets.txt
echo "Done — $fail failure(s)."
```

```text
# brand
brand/samirmoney-logo-header.png|https://samirmoney.com/wp-content/uploads/2024/06/logo-samirmoney-header.png
brand/samirmoney-logo-white.png|https://samirmoney.com/wp-content/uploads/2024/06/logo-samirmoney-white.png
brand/samirmoney-logo-footer.png|https://samirmoney.com/wp-content/uploads/2019/02/logo-samirmoney-footer.png
brand/samirmoney-icon-512.png|https://samirmoney.com/wp-content/uploads/2024/07/cropped-favicon-2.png
brand/samirpay-logo.png|https://samirpay.com/wp-content/uploads/2024/08/logo_samir_pay3.png
brand/samirpay-logo-hires.webp|https://samirpay.com/wp-content/uploads/2024/08/Logo-samirpay-.webp
brand/samirpay-logo-white.webp|https://samirpay.com/wp-content/uploads/2024/08/logo_samir_pay_white1.webp
brand/samirpay-favicon.webp|https://samirpay.com/wp-content/uploads/2024/08/favicons.webp
# products
products/tpe-01.png|https://samirpay.com/wp-content/uploads/2024/12/TPE.-V2-1-1.png
products/tpe-02.png|https://samirpay.com/wp-content/uploads/2024/11/TPE-22.png
products/tpe-03.jpg|https://samirpay.com/wp-content/uploads/2024/11/TPE-V2-.jpg
products/tpe-04.webp|https://samirpay.com/wp-content/uploads/2024/08/TPE-resized1.webp
products/tpe-05.webp|https://samirpay.com/wp-content/uploads/2024/08/TPE-1.webp
products/tpe-06-front.png|https://samirmoney.com/wp-content/uploads/2024/09/QashierXS-front-ph-reviewed.png
# screens
screens/samir-money-phone-01.png|https://samirmoney.com/wp-content/uploads/2024/09/rev-tel-1-1-1-reviewed.png
screens/samir-money-phone-02.png|https://samirmoney.com/wp-content/uploads/2024/06/rev-tel-1-1-1.png
screens/mobile-mockup-samirpay.webp|https://samirpay.com/wp-content/uploads/2024/08/mobile1-2-709x1024-1.webp
screens/inscription.webp|https://samirpay.com/wp-content/uploads/2024/08/inscription.webp
screens/web-admin-dashboard.png|https://samirpay.com/wp-content/uploads/2024/11/dashboard.png
screens/web-admin-capture.png|https://samirpay.com/wp-content/uploads/2024/11/Capture-decran-2024-11-10-a-22.01.40.png
screens/samirpay-business-01.webp|https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/2d/77/00/2d770055-3716-e6f7-a5e0-e8817da726df/Simulator_Screenshot_-_iPhone_16_-_2025-03-26_at_14.52.01.png/471x1024.webp
screens/samirpay-business-02.webp|https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/a7/80/10/a78010a0-6763-bebe-d2f9-160f32f4bb58/Simulator_Screenshot_-_iPhone_16_-_2025-03-26_at_14.52.18.png/471x1024.webp
screens/samirpay-business-03.webp|https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/b7/bd/c6/b7bdc610-52fb-9355-53b9-42203049b808/Simulator_Screenshot_-_iPhone_16_-_2025-03-26_at_14.52.22.png/471x1024.webp
screens/samirpay-business-04.webp|https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/a4/31/34/a43134ad-adba-80a6-4b33-9c53f0ffe7c3/Simulator_Screenshot_-_iPhone_16_-_2025-03-26_at_14.52.27.png/471x1024.webp
screens/samirpay-business-05.webp|https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/da/2d/82/da2d82a9-23c2-b7b2-913d-38c39c4a8849/Simulator_Screenshot_-_iPhone_16_-_2025-03-26_at_14.53.01.png/471x1024.webp
screens/samirpay-business-06.webp|https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/56/4d/6d/564d6d88-d7f7-222c-c13c-9a4fc97ce90c/Simulator_Screenshot_-_iPhone_16_-_2025-03-26_at_14.53.24.png/471x1024.webp
screens/samirpay-business-07.webp|https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/2a/f5/fd/2af5fd17-22dc-f7f9-62da-dd553b92068a/Simulator_Screenshot_-_iPhone_16_-_2025-03-26_at_14.54.13.png/471x1024.webp
screens/samirpay-business-08.webp|https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/f2/5d/6a/f25d6ad5-b7b2-c39e-c987-f0620803a424/Simulator_Screenshot_-_iPhone_16_-_2025-03-26_at_14.53.54.png/471x1024.webp
screens/samirpay-business-09.webp|https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/97/1d/62/971d6238-bffc-1bb2-0e8e-130b97c19130/Simulator_Screenshot_-_iPhone_16_-_2025-03-26_at_14.53.35.png/471x1024.webp
# illustrations (reference)
illustrations/services-updated2.png|https://samirpay.com/wp-content/uploads/2024/12/services-updated2.png
illustrations/services-updated.png|https://samirpay.com/wp-content/uploads/2024/12/services-updated.png
illustrations/integration.webp|https://samirpay.com/wp-content/uploads/2024/08/integration-content-img1.webp
illustrations/images-composite.webp|https://samirpay.com/wp-content/uploads/2024/08/IMAGES-.webp
# partners & billers (validation required)
partners/senelec.png|https://samirmoney.com/wp-content/uploads/2024/06/client_senelect.png
partners/woyofal.png|https://samirmoney.com/wp-content/uploads/2024/06/client_woyofal.png
partners/seneau.png|https://samirmoney.com/wp-content/uploads/2024/06/client_seneau.png
partners/oolu.png|https://samirmoney.com/wp-content/uploads/2024/06/client_oolu.png
partners/rapido.png|https://samirmoney.com/wp-content/uploads/2024/06/client_rapidio.png
partners/der.png|https://samirmoney.com/wp-content/uploads/2024/06/client_der.png
billers/anim-senelec.png|https://samirmoney.com/wp-content/uploads/2024/06/anim_senelec.png
billers/anim-seneau.png|https://samirmoney.com/wp-content/uploads/2024/06/anim_seneau.png
billers/anim-rapido.png|https://samirmoney.com/wp-content/uploads/2024/06/anim_rapido.png
billers/anim-der.png|https://samirmoney.com/wp-content/uploads/2024/06/anim_der.png
billers/anim-dgid.png|https://samirmoney.com/wp-content/uploads/2024/06/anim_dgid.png
billers/anim-touba.png|https://samirmoney.com/wp-content/uploads/2024/06/anim_touba2.png
# video (transcode before use — A.7)
video/decaissement-wolof.mp4|https://samirpay.com/wp-content/uploads/2025/02/SAMIR-PAY-DECAISSEMENT-WOLOF.mp4
video/presentation-samirpay-9x16.mp4|https://samirpay.com/wp-content/uploads/2024/12/Presentation-SAMIRPAY-French-9-16-v5.mp4
# reference only
reference/samirpay-hero-bg.jpg|https://samirpay.com/wp-content/uploads/2024/11/bgimage-1536x1127-V2-.jpg
reference/samirpay-bg.png|https://samirpay.com/wp-content/uploads/2024/08/bgimage.png
reference/samirmoney-about-bg.jpg|https://samirmoney.com/wp-content/uploads/2024/07/aa_bg_1_captivis2.jpg
reference/samirmoney-about-layer-1.png|https://samirmoney.com/wp-content/uploads/2024/07/au_img_layer_1_captivis.png
reference/samirmoney-about-layer-2.png|https://samirmoney.com/wp-content/uploads/2024/07/au_img_layer_2-_captivis.png
reference/samirmoney-about-image.jpg|https://samirmoney.com/wp-content/uploads/2024/07/images-3-A-propos-.jpg
reference/samirmoney-section-2.png|https://samirmoney.com/wp-content/uploads/2024/06/2.png
reference/samirmoney-layers.png|https://samirmoney.com/wp-content/uploads/2024/06/images_layers_1-01-copie.png
reference/samirmoney-services-layer.png|https://samirmoney.com/wp-content/uploads/2019/02/s_img_layer_1-1.png
```

### A.7 Video transcoding (ffmpeg, local)
```bash
# A-VID-01 (landscape) → 720p H.264 + VP9 + poster
ffmpeg -i decaissement-wolof.mp4 -vf "scale=-2:720" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k public/media/video/decaissement-720.mp4
ffmpeg -i decaissement-wolof.mp4 -vf "scale=-2:720" -c:v libvpx-vp9 -crf 34 -b:v 0 -c:a libopus -b:a 64k public/media/video/decaissement-720.webm
ffmpeg -ss 2 -i decaissement-wolof.mp4 -frames:v 1 -vf "scale=-2:720" -q:v 3 public/media/video/decaissement-poster.jpg
# A-VID-02 (portrait) → 720×1280
ffmpeg -i presentation-samirpay-9x16.mp4 -vf "scale=720:-2" -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k public/media/video/samirpay-presentation-720x1280.mp4
ffmpeg -ss 3 -i presentation-samirpay-9x16.mp4 -frames:v 1 -vf "scale=720:-2" -q:v 3 public/media/video/samirpay-presentation-poster.jpg
```
Target ≤ 5 MB per file; poster images also go through `pnpm images`. If still too heavy, host on a video CDN (Mux, Cloudflare Stream) and update the CSP.

### A.8 Remaining visual gaps (ask the client)
1. Samir Money app: 9 clean feature screens (transferts, PI-SPI, factures, rechargements, QR, solde/historique, cagnottes, RAPS, bons d’achat), demo data, French UI.
2. SamirPay Business: high-res exports of the current screens.
3. Web Admin: 3–4 captures with demo data (dashboard, transactions par opérateur, export, lot de paiement).
4. SVG logos (Samir Money, SamirPay, RAPS) + brand guidelines.
5. Anything the three shoots don't cover (checked during P0 curation).

---

## Appendix B — Content

### B.1 Client brief — verbatim (source of truth)
```text
REFONTE SITE WEB — SAMIR MONEY
Brief créatif et contenus

1. Direction artistique
Créer un site premium, minimaliste et interactif, inspiré de www.apple.com.
● Grandes typographies et messages courts.
● Véritables visuels de nos produits.
● Animations fluides, mockups et démonstrations des fonctionnalités.
● Navigation intuitive, adaptée au mobile.
● Chaque produit doit être identifiable et compréhensible immédiatement.
PRIORITÉ : le visiteur doit comprendre nos solutions dès son arrivée sur le site, sans avoir à chercher l’information.

2. Page d’accueil
Section 1 — Introduction
Tous vos paiements. Un seul écosystème.
Samir Money accompagne les particuliers, commerçants, entreprises et institutions avec des solutions de paiement simples, sécurisées et connectées.
Nos solutions
● Samir Money — Votre application de paiement et de gestion financière au quotidien.
● SamirPay TPE — Encaissez plusieurs moyens de paiement sur un seul terminal.
● SamirPay Business — Encaissez et suivez votre activité depuis votre smartphone.
● SamirPay Web Admin — Centralisez et pilotez vos opérations professionnelles.
● RAPS — Payez sans contact grâce à la technologie NFC.
● API SamirPay — Intégrez nos solutions de paiement à vos applications et plateformes.
DESIGN : afficher immédiatement ces six solutions sous forme de visuels produits interactifs, avec une courte description et un bouton « Découvrir ».

Section 2 — Nos services
Des solutions pour chaque besoin.
● Encaissement multicanal — Acceptez différents moyens de paiement depuis une seule solution.
● Collecte — Collectez les paiements de vos clients, adhérents ou usagers et centralisez leur suivi.
● Paiement de masse — Effectuez vos versements groupés : salaires, commissions, prestataires et autres bénéficiaires éligibles.
● Lien de paiement — Encaissez à distance grâce à un lien partagé par WhatsApp, SMS ou e-mail.
● API & intégrations — Connectez nos solutions à vos applications, sites e-commerce et systèmes d’information.
● Paiement NFC — Simplifiez les transactions du quotidien avec RAPS.

Section 3 — Nos API
Votre plateforme. Notre technologie.
Intégrez les solutions de paiement SamirPay directement à votre environnement digital.
● API d’encaissement.
● API de paiement de masse.
● Intégrations e-commerce.
● Plugin WooCommerce.
● Solutions d’intégration adaptées aux besoins des entreprises.
BOUTON : Découvrir nos API
DESIGN : présenter un visuel de connexion entre une plateforme e-commerce, une application et l’infrastructure SamirPay.

Section 4 — Sécurité, agrément et certifications
La confiance au cœur de chaque transaction.
ÉTABLISSEMENT DE PAIEMENT AGRÉÉ PAR LA BCEAO — Samir Money SA est agréé sous la référence EP.SN.005/2025.
CERTIFICATION PCI DSS — Une certification attestant de notre conformité aux exigences de sécurité applicables à notre périmètre certifié pour la protection des données de cartes de paiement.
DESIGN : valoriser visuellement l’agrément BCEAO et la certification PCI DSS, avec leurs mentions officielles validées.

Section 5 — Nos partenaires
Ils nous font confiance.
Afficher les logos des partenaires commerciaux et technologiques validés.

Section 6 — Contact
La solution qu’il vous faut commence ici.
Vous êtes commerçant, entreprise, institution ou développeur ? Échangeons sur vos besoins.
BOUTONS : Nous contacter | Devenir partenaire

3. Pages intérieures
● Samir Money — Particuliers — Présentation de l’application et de ses fonctionnalités : transferts, factures, rechargements, gestion financière, cagnottes et autres services disponibles.
● SamirPay — Professionnels — Présentation du TPE, de SamirPay Business et du Web Admin, avec leurs avantages et fonctionnalités.
● RAPS — Paiement NFC — Présentation du porte-clés, de son fonctionnement et des cas d’usage : cantines, commerces, entreprises et autres environnements compatibles.
● Nos services — Détail de l’encaissement, de la collecte, du paiement de masse et des liens de paiement.
● Développeurs — API — Présentation des API, des possibilités d’intégration et accès à la documentation technique.
● À propos — Présentation institutionnelle de Samir Money, agrément BCEAO, certification PCI DSS, engagements et partenaires.
● Contact — Formulaire commercial, coordonnées et accès WhatsApp.
Le visiteur doit pouvoir identifier immédiatement nos produits, comprendre leur utilité et accéder facilement à la solution qui correspond à son besoin.
RÉSULTAT ATTENDU : un site premium, clair et orienté conversion, qui transforme les visiteurs en utilisateurs ou prospects.
```

### B.2 Legacy and store content worth keeping (client's own text)

**SamirPay — Missions & Valeurs** [Legacy]
- Mission (rewrite to drop "révolutionner"): *Chez Samir Pay, notre mission est de révolutionner la manière dont les transactions financières sont réalisées en offrant une solution centralisée, accessible et sécurisée.* → **[Proposition]** `Notre mission : simplifier les transactions financières grâce à une solution centralisée, accessible et sécurisée.`
- **Simplicité** — Nous nous efforçons de rendre les transactions financières aussi simples et transparentes que possible, pour que nos utilisateurs puissent se concentrer sur ce qui compte vraiment.
- **Accessibilité** — Nous croyons que tout le monde devrait avoir accès à des services financiers fiables. Nos solutions sont accessibles à tous, quel que soit l’emplacement ou le niveau de compétence technologique.
- **Modernité** — Nous intégrons les dernières innovations technologiques pour offrir des services de paiement modernes et performants. Nous restons à la pointe des évolutions pour répondre aux besoins de nos clients.
- **Innovation** — L’innovation est au cœur de notre stratégie. Nous développons constamment des solutions nouvelles et efficaces pour améliorer l’expérience de paiement de nos utilisateurs.
- **Responsabilité** — Nous opérons avec une transparence totale et nous nous engageons à assurer la sécurité de toutes les transactions. Nous prenons notre responsabilité envers nos clients très au sérieux, garantissant fiabilité et confiance.
- **Collaboration** — Nous croyons en la force des partenariats et travaillons en étroite collaboration avec nos clients et partenaires pour co-créer des solutions qui répondent à leurs besoins spécifiques.

**Samir Money — atouts** [Legacy, cleaned]
- Simple et accessible — Samir Money s’intègre facilement à vos opérations existantes et offre une expérience fluide.
- Besoins personnalisés — Samir Money sait répondre aux besoins spécifiques de ses partenaires.
- Sécurisé et fiable — Des normes de sécurité élevées pour la fiabilité et la protection de vos transactions.
- Support dédié — Un service client dédié aux entreprises utilisant notre plateforme.
- Tarification transparente — Une structure tarifaire transparente et compétitive. *(validate)*
- Formation — Samir Money accompagne et forme les entreprises pour tirer le meilleur parti du mobile money et renforcer l’inclusion financière.

**Samir Money — particuliers** [Legacy]
- Gestion simplifiée des paiements : payez vos factures (Senelec, Sen’Eau, Woyofal, Rapido, Expresso), rechargez vos cartes et achetez du crédit téléphonique en quelques clics.
- Transferts rapides et sécurisés : envoyez de l’argent à vos proches sans tracas, grâce à des transferts instantanés et sécurisés.
- Paiement marchand simplifié : effectuez vos achats auprès de vos marchands préférés de manière rapide et sécurisée.

**Samir Money — business** [Legacy]
- Paiements simplifiés : payez vos salariés, fournisseurs et bénéficiaires en toute simplicité *(legacy adds "sans frais cachés" — validate before reuse)*.
- Optimisation de la collecte : collectez efficacement auprès de vos clients et intégrez facilement nos solutions de paiement grâce à nos API.

**SamirPay — services (legacy names)** — Paiement marchand · Sites e-commerce (plateforme acceptant les wallets et les cartes bancaires) · **Samir AutoPay** (programmer des paiements via opérateur mobile ou banque de manière automatique) · Commerçants physiques (TPE acceptant les paiements via wallets) · Intégration API · Paiement de masse avec **Samir Pay GP** (salaires, primes ou remboursements). → AutoPay and "GP" names: not in the brief; confirm before mentioning (Appendix D).

**SamirPay Business — store description** [Store, verbatim]
> SamirPay Business est l’application incontournable pour vos encaissements via tous les opérateurs mobiles. Rapide, sécurisée et ultra simple à utiliser, elle vous permet d’accepter des paiements de manière fluide, où que vous soyez. Spécialement conçue pour les entrepreneurs et commerçants, SamirPay Business centralise toutes vos transactions en un seul endroit.
> * Compatible avec tous les opérateurs mobiles
> * Interface intuitive et ergonomique pour une prise en main rapide
> * Transactions rapides et sécurisées, sans tracas
> * Gestion simplifiée de vos paiements au quotidien
> * Lien de paiement personnalisé : Facilitez la vie de vos clients en leur envoyant un lien direct pour régler leurs achats en quelques clics.

(The site drops "incontournable" per §4.3.)

**Samir Money app — release-note facts** [Store] (versions 1.2 → 2.1, Nov 2025 – Oct 2026)
- PI-SPI instant payment: send and receive in seconds, 24/7, to all banks and e-money institutions of the UEMOA (v1.9).
- RAPS: recharge and manage NFC keychains to pay instantly, contactless (v1.2).
- Vouchers: digital gift vouchers, easy to give and use (v1.2).
- Merchant payments via Samir Money (v1.2); QR-code scan and PIN entry improved (v2.0).
- Payment methods added: Mixx by Yas (v1.2, v1.4), KPay and Flash Kalpé (v1.8).
- New "Liquid Glass" interface on iOS (v2.0) — the site's frosted-glass header echoes it.
- Sign-off: *« Une seule application, tous vos paiements : rapides, modernes et 100 % sénégalais. Samir Money. Link bou baax bi. »*
- The store description still presents the app as **"Samir Link"** (bill payment, Orange Money ↔ Wave exchange at a preferential rate, subscriptions) → naming and the exchange feature to confirm (Appendix D).

### B.3 FAQ — SamirPay (legacy, cleaned)
1. **Qu’est-ce que SamirPay ?** — SamirPay est une plateforme qui regroupe les grands opérateurs de mobile money du Sénégal et vous permet de gérer toutes vos opérations financières en un seul endroit, de manière simple et sécurisée.
2. **Comment m’inscrire à SamirPay ?** — Rendez-vous sur notre site web ou téléchargez notre application mobile, puis suivez les instructions pour créer un compte en fournissant les informations et les documents requis.
3. **Quels sont les documents requis pour s’inscrire ?** — Pour les entreprises : NINEA, registre de commerce, justificatif d’adresse et carte d’identité du gérant. Pour les particuliers : carte nationale d’identité.
4. **Quels sont les plafonds de transaction ?** — Les opérateurs de mobile money appliquent un plafond de 2 000 000 FCFA par jour et 10 000 000 FCFA par mois. **[Hidden until validated]**
5. **Puis-je utiliser SamirPay sur plusieurs appareils ?** — Pour des raisons de sécurité, SamirPay est conçu pour être utilisé sur un seul appareil à la fois.
6. **Quels sont les délais de remboursement ?** *(the legacy label wrongly repeated Q5)* — Les remboursements via mobile money prennent généralement J+1, et les virements bancaires J+3 après validation par l’équipe de Samir Money. **[Hidden until validated]**
7. **Puis-je annuler une transaction ?** — Les transactions effectuées sur SamirPay sont généralement définitives. Si vous avez besoin d’assistance, contactez notre support client immédiatement après la transaction.
8. **Comment consulter mon solde et mes transactions ?** — Rendez-vous sur votre tableau de bord pour consulter votre solde global et le détail des transactions par opérateur. Vous pouvez également exporter des rapports de vos transactions.

---

## Appendix C — Crawl findings (facts, conflicts, risks)

1. **Contact data conflicts.** samirmoney.com footer displays "+221 33 889 72 72" but its `tel:` link dials +221 33 824 24 33; the samirmoney.com contact page shows +221 33 824 24 33; samirpay.com shows +221 33 824 24 33 and +221 77 300 25 23. E-mails: contact@samirmoney.com (samirmoney.com) vs contact@samirservices.com (samirpay.com). Footer address has a typo ("AImmeuble").
2. **Store links.** Both legacy "App Store" / "Google Play" buttons point to `#`. Verified: Samir Money iOS `id6740030422`; SamirPay Business iOS `id6743798245` and Android `sn.samirmoney.samirpaybusiness` (publisher SAMIR MONEY SA, updated 14 Oct 2026; its Play description exists only in English — worth adding the French one from the App Store). Samir Money Android: not found.
3. **Social links** on both sites are empty placeholders (facebook.com/, linkedin.com, instagram.com/, twitter.com/, github.com/).
4. **Pricing claim** "1 % on the initial deposit, then all transactions free" appears on several samirmoney.com pages → do not migrate without compliance sign-off.
5. **Testimonials** on both sites are template placeholders (avatars hot-linked from a theme demo domain, "Founder at Brain.co") → dropped.
6. **Legal entity.** The privacy policy names "Samir Services, Mermoz Pyrotechnie Villa N 11" as the company and lists Sénégal, Côte d’Ivoire, Mali, Burkina Faso; the brief and the BCEAO list name **Samir Money SA** at Point E → legal to reconcile before publishing `/confidentialite` and `/mentions-legales`.
7. **FAQ issues.** Duplicate question label (Q6); ceilings and delays may be outdated.
8. **App Store listing issues** (outside website scope, worth fixing): the privacy-policy URL points to samirpay.com/politique-de-confidentialite, which is the default WordPress template text, not the real policy; "Data Not Collected" privacy label while the app collects ID documents and a selfie (per the policy); description still says "Samir Link"; developer website = samirpay.com/#contact (handled by §8.4).
9. **WordPress exposure.** The REST API is publicly readable (`/wp-json/wp/v2/media` lists the whole media library with author IDs) → lock down or shut down both WordPress instances once redirects are live.
10. **Legacy design tokens.** Greens `#40B289`, `#007552`, `#5CB293`; ink `#161616`; slate `#8B9BAF`. Theme leftovers `#6A4BC4`, `#FF9501` → dropped.
11. **Heavy media.** Videos are 49–59 MB → transcode (A.7). The samirmoney.com hero slider (Slider Revolution) lazy-loads layers that couldn't be captured — not needed.
12. **Google Maps embed** on samirpay.com exposes an API key in the page → don't copy; static map + link.
13. **Bank vocabulary** in legacy copy ("expérience bancaire simplifiée") → avoid (§1.5).
14. **Unverified achievements** (from LinkedIn posts): Prix de l’Innovation Digitale, Salon Firifinance 2026 (31 mars 2026); PI-SPI integration and "API Business" certification → official sources needed.
15. **Drive photo shoots** couldn't be listed automatically during research → inventory in P0 (A.0).

---

## Appendix D — Open questions (TODO(client) register)

| # | Question | Blocks | Default until answered |
|---|---|---|---|
| 1 | Canonical domain (samirmoney.com?) | §8 | samirmoney.com |
| 2 | Main phone number(s) | Contact, footer, JSON-LD | +221 33 824 24 33 in preview only |
| 3 | Contact e-mail | Contact, footer | contact@samirmoney.com in preview only |
| 4 | WhatsApp number | Contact, mobile menu, S6 | WhatsApp hidden |
| 5 | Opening hours | Contact | Hidden |
| 6 | Samir Money Google Play URL | Store badges | Badge hidden |
| 7 | Web Admin login URL | `#web-admin` CTA | CTA hidden |
| 8 | API docs URL, sandbox access process | `/developpeurs` | Docs CTA hidden; contact CTA only |
| 9 | WooCommerce plugin link | `/developpeurs` | Card without link |
| 10 | Validated partner list + logo files + authorisation | Home S5, À propos | Section hidden |
| 11 | Accepted payment methods per product; **written permission for the payment badges now orbiting the home globe** (Visa, Mastercard, Wave, Orange Money, Wizall Money, Mixx by Yas, KPay, PI-SPI/BCEAO — files supplied 16 Oct 2026 in `icone/`, see `src/content/fr/payment-methods.ts`) | Home S1, TPE, Business, e-commerce, Services | Badges shown on the home globe at the client's request (illustration only, never a list of accepted methods); no logos elsewhere |
| 12 | RAPS details: purchase/where, loss/theft, recharge limits, compatible terminals | `/raps` FAQ | FAQ hidden |
| 13 | TPE technical sheet; OEM naming | `#tpe` SpecList | SpecList hidden |
| 14 | PCI DSS scope and date; permission to show any badge | S4 | Typographic seal only |
| 15 | Approval of the BCEAO seal rendering and verification link | S4 | As specified |
| 16 | Fees / pricing — publish or not | Anywhere | Not published |
| 17 | Transaction ceilings and refund delays (FAQ 4, 6) | `#faq` | Hidden |
| 18 | Samir AutoPay and "Samir Pay GP" — still marketed? names? | Services, Professionnels | Not mentioned |
| 19 | App naming ("Samir Link" in store copy); OM ↔ Wave exchange; cagnottes; vouchers | `/particuliers` | §9.2 with [Store] items flagged |
| 20 | Photo selection sign-off + model releases (incl. minors in cantine scenes) | All pages with people | Product-only / hands shots |
| 21 | RAW / HEIC files in the shoots → graded JPEG/TIFF exports | Pipeline | Use available JPEGs |
| 22 | SVG logos + brand guidelines | Header, footer, OG | Legacy PNG/WebP, §6 greens |
| 23 | Mentions légales data (RCCM, NINEA, capital, directeur de la publication, hébergeur); "Samir Services" vs "Samir Money SA" | Legal pages | Skeleton with TODO |
| 24 | CGU text; account-deletion procedure | Legal pages | Skeleton |
| 25 | Awards (Firifinance 2026) and PI-SPI — approval to publish | À propos, Particuliers | Hidden (PI-SPI row flagged) |
| 26 | Wolof: transcript of the décaissement video; any Wolof microcopy ("Link bou baax bi") | Services, footer | French subtitles TODO; no Wolof copy |
| 27 | Newsletter wanted? Provider? | Footer | None |
| 28 | Lead destination (CRM?) | Contact | E-mail only |
| 29 | English version? | i18n | French only, i18n-ready content files |
| 30 | Social media URLs | Footer, JSON-LD | Icons hidden |
| 31 | Approver for [Proposition] copy | All | Client marketing lead |
| 32 | French App Store badge artwork ("Télécharger dans l’App Store") — the localized file could not be downloaded | Store badges | Official English badge with a French accessible name |
| 33 | Confirm the legacy screens may be shown with operator logos and phone numbers masked (`scripts/prepare-legacy.mjs`) | Tile 01, tile 04, `#web-admin` | Masked versions shown |
