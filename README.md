# daoho.dev — an overview of Dao Ho's portfolio site

**Languages:** [English](README.md) · [Русский](README.ru.md) · [Тоҷикӣ](README.tg.md)

> Written on 26 October 2026 from the live site at [daoho.dev](https://www.daoho.dev/) and its public source at [github.com/Dao-Ho/portfolio](https://github.com/Dao-Ho/portfolio). This is an independent study of the project and is not affiliated with its author.

## In one paragraph

daoho.dev is the personal website of **Dao Ho**, a software engineer and Northeastern University student (Boston, USA). The site's own description is two words: *"expression of self"*. It is not a template portfolio. The home page is a full-screen, non-scrolling **koi pond drawn out of text glyphs on a canvas**: koi swim around the intro text, follow the cursor, and when you click on empty water a food pellet drops in and the fish race to eat it. Around that centrepiece the site holds five product projects with their own case-study pages, a gallery of seven award-winning watercolours, and a blog that currently says "coming soon".

## Who made it

- **Dao Ho** — software engineer; joins **Google** in January 2027 to work on Shopping in Gemini.
- Before that: Google intern (May–Aug 2026, citation and evaluation infrastructure for Gemini); **Agency** (May–Dec 2025, Member of Technical Staff co-op; the company was later acquired by Klaviyo); **DesignAI** (Sept 2024–Jan 2025, an image platform for interior designers); **Paynalli Systems** (Jul–Sept 2024, RAG search over embeddings for recruiter–candidate matching).
- Now: **Chief of Software at Generate**, Northeastern's student development studio (since Sept 2024), and **Research Assistant at PARCS Lab** doing LLM research (since Sept 2026).
- Discrete Math Teaching Assistant at Khoury College (2023–2024) — took the course in high school, taught it in the first semester of college.
- Also a watercolour painter: *Best in Show* at the Baltimore Museum of Art.
- GitHub bio: "Caffeine Driven Development". Handles: [github.com/Dao-Ho](https://github.com/Dao-Ho), [linkedin.com/in/dao-ho](https://www.linkedin.com/in/dao-ho/), [x.com/daoho04](https://x.com/daoho04), art on [instagram.com/artdaoho](https://www.instagram.com/artdaoho/).

## What is on the site

The top navigation has four entries: **pond · projects · gallery · blog**, plus a sun/moon theme toggle. On phones the nav collapses into a floating pill.

### Pond — the home page (`/`)

- One screen, no scrolling, no overscroll bounce. Behind the text sits a `<canvas>` where a custom engine renders koi as **monospace characters** (an ASCII-art look), with shadows, wakes, ripples and bite flashes.
- Three koi varieties are generated at random with weighted odds: **kohaku, sanke, tancho**. Each fish has a 20-node spine, swims in bursts of tail beats then coasts, dives and resurfaces, sculls its pectoral fins while hovering, gets curious about the cursor, startles and flees when the pointer moves fast, and steers around the text blocks (elements marked `data-koi-avoid`), fading when it passes beneath them.
- **Click on empty water to feed.** The pellet falls for a moment, lands, drifts; nearby koi "rush", open their mouths as they close in, and a brief flash marks the bite. Clicks on links, buttons or selected text are ignored. Each feeding is logged to analytics as `koi_pond_fed`.
- A tiny counter in the top-right corner shows the number of koi and the number of pellets on the water; the pellet count flashes when it changes.
- If the OS asks for reduced motion, the pond lets the fish spread out and then holds a single still frame.
- The copy, all lowercase monospace: a two-line quote *"in an ocean of gluttony, / cast a fine net"* with a blinking cursor, then *"Xin chào, I'm Dao."* ("xin chào" is Vietnamese for "hello"), followed by three sentences about Google, Agency, the startups, Generate and PARCS Lab.
- Every company name is a **footnote-style citation**: hovering opens a small card with the logo, role, dates and a one-line summary; clicking opens the company's site. A grouped citation ("early-stage startups") lists DesignAI and Paynalli together. On touch devices the names simply link out.
- Social links at the bottom: github / linkedin / x.

### Projects (`/projects`)

A side-scrolling strip with slide transitions. A ring of project tiles spins when you arrive so that "scroll to spin" is discoverable. Each project has its own page with a tagline, a write-up, a demo video or poster, a wide cover image, a 1200×630 share card, a story told in paragraphs with clips between them, and captioned screenshot galleries.

| Project | What it is | Stack | When |
|---|---|---|---|
| **Selfserve** | "Jira for hotel operations" — an internal self-serve dashboard for hotel staff to manage tasks, requests and daily operations (a Generate project) | Next.js, TypeScript, Go | Spring 2026 |
| **Dynami** | "The Dynamic Island, for developers" — a Mac notch app: agent permission prompts, pull-request reviews and your calendar, glanceable without leaving your work | Swift, SwiftUI, GitHub API | Spring 2026 |
| **Vetruly** | Full-stack platform connecting pet owners with vetted care providers for recovering and medically complex pets; led a team of five from concept to production | Next.js, TypeScript, PostgreSQL | Spring 2025 |
| **Three Stones** | Mobile app where everyday investors crowdfund real-estate projects; built sign-in, home and search on a team of five | React Native, Go, Supabase | Fall 2024 |
| **Kairos** | "Job applications, filled for you" — send it a job link and it fills the application, leaving only the fields that need you | (in progress) | Fall 2026 |

### Gallery (`/gallery`)

Header: *"beauty in the mundane."* and *"Quiet observations of ordinary life."* Seven watercolours hung **salon-style on a 12-column wall**, each with its own column span and vertical drop so sizes and gaps vary the way works hang in a real show. Clicking opens a lightbox; arrow keys step through, Escape closes.

| Work | Size (in) | Year | Honours |
|---|---|---|---|
| The Transaction | 11×14 | 2023 | Best in Show, James Laubheimer's Award; Baltimore Watercolor Society Award for Excellence in Water-Media; Schwab Lipowitz & Solter 1st Place Award |
| Haku | 8.5×11 | 2023 | |
| Fish Market | 10×12 | 2023 | Featured at the Baltimore Museum of Art |
| Holding On | 10×8 | 2022 | |
| Duality | 22×17 | 2022 | |
| Held | | 2022 | |
| Engulfed | | 2022 | |

### Blog (`/blog`)

A single line, *"coming soon."*, with the same blinking cursor.

### Smaller pieces in the code

- An **experience section** where each employer's logo is rendered as an interactive field of dots (driven by per-logo JSON "logo maps") with scroll-reveal text.
- A **GitHub contributions graph** fed by an API route that queries GitHub's GraphQL API and caches the result in Redis for an hour.
- A **logo-map generator** page (`/generate-logo`) used to produce those dot maps from images.
- Shared UI: dock, animated list, circular text, radius dial, glass surface, scroll reveal, view transitions.

## How it is built

- **Framework:** Next.js 14 (App Router), React 18, TypeScript. Deployed on **Vercel** (the site is served from Vercel's edge; responses were seen coming from the `fra1` region).
- **Styling:** Tailwind CSS 3 with `tailwindcss-animate` and `tailwind-scrollbar-hide`; shadcn-style utilities (`class-variance-authority`, `clsx`, `tailwind-merge`); Radix UI primitives (slot, switch); Material Tailwind; Phosphor and Lucide icons.
- **Motion:** Framer Motion and Motion for UI transitions; GSAP with ScrollTrigger for scroll effects; Swiper and `react-fast-marquee` for strips; `react-scroll`.
- **The pond:** hand-written, no game engine. `world.ts` is the simulation (koi, pellets, bites, ripples, pointer, avoidance boxes), `renderer.ts` paints glyphs onto a 2D canvas, `koi-pond.tsx` runs a fixed 60 Hz step loop with a 4-step cap, re-measures the text boxes every 30 frames to follow layout shifts, pauses when off-screen, and honours `prefers-reduced-motion`.
- **Typography:** Geist Sans and Geist Mono bundled locally; Inter, Bebas Neue, Libre Baskerville, Roboto, Roboto Condensed, Oswald, Source Sans 3 and Playfair Display via `next/font`.
- **Images:** `next/image` with AVIF/WebP output and a 31-day cache; a `just webp` recipe converts Figma PNG exports to WebP with `sharp`.
- **Analytics:** PostHog (events and session replay), proxied through `/ingest/*` rewrites on the site's own domain so ad blockers do not drop events; Vercel Analytics as well.
- **Data:** Redis (`redis` client) for the contributions cache; GitHub GraphQL API; environment variables `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `GITHUB_TOKEN`, `REDIS_URL`.
- **Tooling:** ESLint + Prettier; a `justfile` with `install / dev / build / start / lint / format / typecheck / check / fix / clean / webp`; CI runs `just check` (lint, format check, typecheck) before building.

## Design language

- Warm, muted palette: light theme background `#f5f4f1` on foreground `#262523`; dark theme background `#1a1917` on foreground `#fff7f0`. Secondary text is the foreground at 50–64 % opacity via `color-mix`.
- Lowercase monospace copy at 13–15 px, generous line height, text column aligned at 20 vw on desktop.
- Recurring motifs: the blinking cursor, thin underlines that darken on hover, footnote cards, and content that the fish avoid rather than cover.
- Everything is quiet by default and reacts to the visitor — hover, click, scroll — instead of auto-playing.

## Repository facts

| | |
|---|---|
| Repo | github.com/Dao-Ho/portfolio (package name `port-web`, version 0.1.0) |
| Language | TypeScript |
| Created | 22 November 2023 |
| Commits | about 171 |
| Stars / forks | 24 / 1 (October 2026) |
| Topics | art, gallery, gallery-viewer, portfolio, portfolio-website, website |
| Size | about 410 MB, mostly original PNG artwork and an embedded `Design-Portfolio.git` pack |
| Activity | very active in October 2026: daily pull requests #59–#73 added the project pages, the pond quote, PostHog, image optimisation and the theme-toggle reveal |
| README | one line: "Hey! Get to know me @ daoho.dev :)" |

## Licence note

The repository has **no licence file**. Under GitHub's default terms that means all rights stay with the author: the code may be read and studied, but it may not be copied, modified or republished as your own site without the author's permission. The ideas — a living background that avoids the text, footnote citations for a résumé, a salon-hung gallery — are free to learn from.

## Links

- Site: https://www.daoho.dev/
- Source: https://github.com/Dao-Ho/portfolio
- Author: https://github.com/Dao-Ho · https://www.linkedin.com/in/dao-ho/ · https://x.com/daoho04 · https://www.instagram.com/artdaoho/
- Organisations mentioned: https://generatenu.com/ · https://parcslab.fyi/ · https://www.agency.inc/ · https://www.designai.co/ · https://paynalli.com/
