# Agent guide: moisestrejo.com

This repository is the personal website of **Moises Trejo**: a portfolio, product showcase, blog surface, and collection of client-side experiments. It ships as **`new-moisestrejo.com`** (npm package name) and deploys as **moisestrejo.com**.

## Stack

- **Next.js 14** (App Router), **React 18**
- **Tailwind CSS** for styling; **Framer Motion** and **lucide-react** on marketing-style pages
- **Mongoose** + MongoDB for persistence where routes need a database (e.g. likes, comments)
- **Analytics / monitoring**: Google Analytics (`@next/third-parties`), PostHog (`app/providers.js`), LogRocket (initialized in `app/layout.js`)

## Layout and navigation

- Root layout: `app/layout.js` — Geist fonts, global CSS, Navbar, Footer, PostHog provider.
- Shared chrome: `app/components/NavBar.js`, `app/components/Footer.js`.
- Home: `app/page.js` renders `app/components/About.js` (hero, Product Hunt–linked products grid, comments section).

## Main surface areas

| Area | Typical path | Notes |
|------|----------------|-------|
| Products (full list) | `app/products/` | Reads `public/information/externalApps.json`. |
| Tools | `app/tools/` | External tool links and related UI. |
| Resume | `app/resume/` | Resume content and layout. |
| Blog / Medium | `app/blog/` | Blog presentation. |
| Poetry | `app/poetry/` | Poetry page. |
| Music / Spotify | `app/music/` | Spotify integration UI. |
| Generative art | `app/p5art/` | p5.js–backed art listing and `[id]` pages. |
| Internal “playground” apps | `app/internal/[id]/page.js` | Many one-off widgets under `app/components/internalApps/*.jsx`. |
| Dynamic project pages | `app/[id]/page.js` | Project detail routing (validate against existing data sources when editing). |
| Contact | `app/contact/` | Contact UI. |
| Misc | `app/college/`, `app/art/`, `app/tester/`, `app/smile-detector-privacy-policy/`, etc. | Feature-specific routes. |

## Data and configuration

- **`public/information/*.json`** — Static lists: external apps/products (`externalApps.json`, includes optional `product_hunt` / `product_hunt_embed`), internal apps, projects, work, education, skills, etc. Prefer extending these files over hardcoding long lists in components.
- **`public/`** — Images and other static assets referenced by paths like `/images/...`.

## API routes (`app/api/`)

Route handlers under `app/api/**/route.js` include:

- **Comments**: `comment/`, `comment/like/[id]/`
- **Project likes**: `like/[id]/`, `like/all/`
- **Email subscribe**: `subscribe/`
- **Market/ticker helpers**: `ticker/`, `get-tickers/`
- **Utilities**: `time/`, `analyze-chess-board/`

These usually expect env vars or Mongo connectivity where applicable; check each route before assuming they work without configuration.

## Conventions for changes

1. **Match existing patterns** in the touched folder (imports, `'use client'` only where needed, Tailwind utility style).
2. **Products / Product Hunt**: New shipped products typically get a row in `public/information/externalApps.json` with `link`, `description`, `date`, and optional `product_hunt` + `product_hunt_embed`. Home (`About.js`) surfaces entries that include Product Hunt fields.
3. **Internal apps**: Add the app component under `app/components/internalApps/` and wire it through `app/internal/[id]/page.js` / `internalApps.json` as the repo already does for siblings.
4. **Do not** expand scope beyond the task; avoid unrelated refactors.
5. **JSON** exported from `public/information/` must stay valid UTF-8 JSON (escape quotes and `&` in embedded HTML strings as in existing entries).

## Scripts

```bash
npm run dev    # Next dev server
npm run build  # Production build
npm run start  # Run production server
npm run format # Prettier
```

## This file

`agents.md` is the canonical agent-oriented project overview. **`clade.md`** is a symlink to this file so tools that look for either name see the same content.
