<div align="center">

# 🐟 daoho.dev — a portfolio you can feed

**An overview of Dao Ho's personal site: an ASCII koi pond you can feed, five product case studies, seven award-winning watercolours.**

[🇬🇧 English](README.md) · [🇷🇺 Русский](README.ru.md) · [🇹🇯 Тоҷикӣ](README.tg.md)

[![Live site](https://img.shields.io/badge/live-daoho.dev-1a1917?style=flat-square)](https://www.daoho.dev/)
[![Source](https://img.shields.io/badge/source-Dao--Ho%2Fportfolio-262523?style=flat-square&logo=github)](https://github.com/Dao-Ho/portfolio)
![Next.js 14](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
[![Download ZIP](https://img.shields.io/badge/download-ZIP-2ea44f?style=flat-square&logo=github&logoColor=white)](https://github.com/boboevproject-rgb/daoho-portfolio-overview/archive/refs/heads/main.zip)

<img src="screenshots/pond-dark-light.png" alt="The daoho.dev home page in dark and light themes: ASCII koi swimming around the intro text" width="100%">

<sub>The home page in dark and light theme. Every fish is drawn from monospace characters on a canvas.</sub>

</div>

---

## ✨ Why this site is worth a look

- **A living background that is not a video.** The koi are simulated and rendered in real time with hand-written TypeScript, no game engine, no WebGL library.
- **You can feed the fish.** Click on empty water, a pellet drops in, the nearest koi rush over and bite. Honestly, people stay on the page just for this.
- **A résumé written as footnotes.** Company names in the intro are citations: hover to see the role, dates and a one-line summary; click to open the company.
- **Real work behind it.** Five case-study pages (a Mac notch app, a hotel-ops dashboard, a vet-care platform, a real-estate crowdfunding app, a job-application bot) and a gallery of watercolours that took *Best in Show* at the Baltimore Museum of Art.
- **Quiet craft everywhere.** Lowercase monospace copy, a warm two-tone palette, a blinking cursor, and fish that politely swim around the text instead of over it.

> Written on 26 October 2026 from the live site and its public source. This is an independent overview and is not affiliated with the author.

---

## 👤 Who is Dao Ho

- Software engineer and Northeastern University student (Boston, USA). GitHub bio: *"Caffeine Driven Development"*.
- Joins **Google** in January 2027 to work on Shopping in Gemini. Interned at Google in summer 2026 (citation and evaluation infrastructure for Gemini).
- Before that: **Agency** (2025, Member of Technical Staff co-op; later acquired by Klaviyo), **DesignAI** (2024–2025) and **Paynalli Systems** (2024).
- Now: **Chief of Software at Generate**, Northeastern's student development studio, and **Research Assistant at PARCS Lab** (LLM research).
- Taught Discrete Math as a TA at Khoury College in his first semester, having taken the course in high school.
- Painter: seven watercolours, one of them *Best in Show* at the Baltimore Museum of Art.

Links: [GitHub](https://github.com/Dao-Ho) · [LinkedIn](https://www.linkedin.com/in/dao-ho/) · [X](https://x.com/daoho04) · [Instagram (art)](https://www.instagram.com/artdaoho/)

---

## 🐟 The pond — home page

<img src="screenshots/pond-dark.png" alt="Dark theme: seven ASCII koi, the quote 'in an ocean of gluttony, cast a fine net' and the intro text" width="100%">

<sub>Top-right corner: the tiny counter shows 7 koi and 0 pellets on the water.</sub>

**What you see.** One screen, no scrolling. A canvas fills the viewport and koi of three varieties (kohaku, sanke, tancho) drift across it. The text sits on top: a two-line quote with a blinking cursor, *"Xin chào, I'm Dao."* ("xin chào" is Vietnamese for "hello"), three sentences about work, and three social links.

**What the fish do.** Each koi has a 20-node spine. It swims in bursts of tail beats and then coasts, dives and resurfaces, sculls its pectoral fins while hovering, gets curious about the cursor, startles and flees when the pointer moves fast, and steers around the text blocks, fading as it passes beneath them.

**Feeding.** Click on empty water. The pellet falls for a moment, lands and drifts. Nearby koi rush over, open their mouths as they close in, and a flash marks the bite. Clicks on links, buttons or selected text are ignored. Each feeding is logged as a `koi_pond_fed` event.

**Accessibility.** With *reduced motion* enabled in the OS, the pond lets the fish spread out and then holds a single still frame.

<img src="screenshots/pond-light.png" alt="Light theme: the same pond on a warm off-white background" width="100%">

<sub>Light theme. The moon icon in the nav flips it; the choice is remembered in localStorage.</sub>

### 📱 On a phone

<div align="center">
<img src="screenshots/mobile-dark-light.png" alt="The home page on a 390 px wide phone screen, dark and light" width="70%">
</div>

The nav collapses into a floating pill. Citations become plain links, because hover cards need a pointer.

---

## 🧰 Projects

<img src="screenshots/projects.jpg" alt="The projects page: a side-scrolling strip of cover images, Kairos and Selfserve visible" width="100%">

A side-scrolling strip with slide transitions. The ring of tiles spins when you arrive so that "scroll to spin" is discoverable. Each project has its own page with a tagline, a write-up, a demo video or poster, a wide cover, a 1200×630 share card, a story in paragraphs with clips between them, and captioned screenshot galleries.

| Project | What it is | Stack | When |
|---|---|---|---|
| **Kairos** | "Job applications, filled for you." Send it a job link and it fills the application, leaving only the fields that need you | in progress | Fall 2026 |
| **Selfserve** | "Jira for hotel operations." A self-serve dashboard for hotel staff: tasks, requests, daily operations (a Generate project) | Next.js, TypeScript, Go | Spring 2026 |
| **Dynami** | "The Dynamic Island, for developers." A Mac notch app: agent permission prompts, pull-request activity and your calendar, glanceable without leaving your work | Swift, SwiftUI, GitHub API | Spring 2026 |
| **Vetruly** | Trusted vet care for recovering and medically complex pets. Led a team of five from concept to production | Next.js, TypeScript, PostgreSQL | Spring 2025 |
| **Three Stones** | Real-estate crowdfunding for everyday investors. Built sign-in, home and search on a team of five | React Native, Go, Supabase | Fall 2024 |

<img src="screenshots/project-dynami.jpg" alt="The Dynami project page: a purple cover with stacked MacBooks, the tagline and the first screenshot of the notch" width="100%">

<sub>A project page: cover, tagline, write-up, then the story with screenshots and clips.</sub>

---

## 🎨 Gallery

<img src="screenshots/gallery.jpg" alt="The gallery page: 'beauty in the mundane', The Transaction and another ink-and-watercolour piece hung salon-style" width="100%">

Header: *"beauty in the mundane."* and *"Quiet observations of ordinary life."* Seven works hung **salon-style on a 12-column wall**: each piece gets its own column span and vertical drop, so sizes and gaps vary the way works hang in a real show. Click opens a lightbox; arrow keys step through, Escape closes.

| Work | Size (in) | Year | Honours |
|---|---|---|---|
| The Transaction | 11×14 | 2023 | Best in Show, James Laubheimer's Award · Baltimore Watercolor Society Award for Excellence in Water-Media · Schwab Lipowitz & Solter 1st Place |
| Haku | 8.5×11 | 2023 | |
| Fish Market | 10×12 | 2023 | Featured at the Baltimore Museum of Art |
| Holding On | 10×8 | 2022 | |
| Duality | 22×17 | 2022 | |
| Held | | 2022 | |
| Engulfed | | 2022 | |

---

## ✍️ Blog

<img src="screenshots/blog.png" alt="The blog page: a single line, 'coming soon.'" width="100%">

One line, *"coming soon."*, with the same blinking cursor.

---

## 🏗️ Under the hood

| Layer | What is used |
|---|---|
| Framework | Next.js 14 (App Router), React 18, TypeScript 5 |
| Styling | Tailwind CSS 3, `tailwindcss-animate`, `tailwind-scrollbar-hide`, shadcn-style utilities (`cva`, `clsx`, `tailwind-merge`), Radix UI (slot, switch), Material Tailwind, Phosphor and Lucide icons |
| Motion | Framer Motion + Motion for UI transitions, GSAP with ScrollTrigger for scroll effects, Swiper and `react-fast-marquee` for strips |
| The pond | Hand-written: `world.ts` simulates koi, pellets, bites, ripples and avoidance boxes; `renderer.ts` paints glyphs on a 2D canvas; `koi-pond.tsx` runs a fixed 60 Hz step loop (max 4 steps per frame), re-measures the text boxes every 30 frames, pauses off-screen and honours `prefers-reduced-motion` |
| Fonts | Geist Sans and Geist Mono bundled locally; Inter, Bebas Neue, Libre Baskerville, Roboto, Roboto Condensed, Oswald, Source Sans 3, Playfair Display via `next/font` |
| Images | `next/image` with AVIF/WebP output and a 31-day cache; a `just webp` recipe converts Figma PNG exports with `sharp` |
| Analytics | PostHog (events + session replay) proxied through `/ingest/*` so ad blockers do not drop events; Vercel Analytics |
| Data | An API route pulls the GitHub contributions calendar via GraphQL and caches it in Redis for an hour |
| Tooling | ESLint + Prettier, a `justfile` (`install / dev / build / lint / format / typecheck / check / fix / clean / webp`); CI runs `just check` before building |
| Hosting | Vercel |

**Design tokens.** Light: background `#f5f4f1`, foreground `#262523`. Dark: background `#1a1917`, foreground `#fff7f0`. Muted text is the foreground at 50–64 % opacity via `color-mix`. Copy is 13–15 px lowercase monospace; the text column sits at 20 vw on desktop.

---

## ⬇️ Download and run it yourself

**This overview** (text + screenshots):

```bash
git clone https://github.com/boboevproject-rgb/daoho-portfolio-overview.git
```

or grab the [ZIP](https://github.com/boboevproject-rgb/daoho-portfolio-overview/archive/refs/heads/main.zip).

**The original site**, to run it on your machine (Node 18.17+ required):

```bash
git clone https://github.com/Dao-Ho/portfolio.git
cd portfolio
npm ci
npm run dev
```

Then open http://localhost:3000. The pond, projects and gallery work with no keys at all. Three optional environment variables in `.env.local` switch on the extras: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` (analytics), `GITHUB_TOKEN` and `REDIS_URL` (the contributions graph). Heads-up: the repository is about **410 MB** because it carries the original PNG artwork and an embedded `Design-Portfolio.git` pack. If you have `just` installed, `just dev`, `just check` and `just webp in.png out.webp` are there too.

---

## 📊 Repository facts

| | |
|---|---|
| Repo | [github.com/Dao-Ho/portfolio](https://github.com/Dao-Ho/portfolio) (package `port-web` 0.1.0) |
| Language | TypeScript |
| Created | 22 November 2023 |
| Commits | about 171 |
| Stars / forks | 24 / 1 (October 2026) |
| Topics | art, gallery, gallery-viewer, portfolio, portfolio-website, website |
| Activity | very active in October 2026: daily pull requests #59–#73 added the project pages, the pond quote, PostHog, image optimisation and the theme-toggle reveal |
| README | one line: "Hey! Get to know me @ daoho.dev :)" |

---

## ⚖️ Licence and credits

- The original repository has **no licence file**. Under GitHub's default terms all rights stay with the author: read and learn from the code, run it locally, but do not republish it as your own site without permission.
- All artwork, screenshots and copy shown here belong to **Dao Ho** and appear for review and commentary, with links back to the source.
- Screenshots were taken on 26 October 2026 with headless Chrome at 1440×900 and 390×844.

---

<div align="center">

**Site:** https://www.daoho.dev/ · **Source:** https://github.com/Dao-Ho/portfolio

[Generate](https://generatenu.com/) · [PARCS Lab](https://parcslab.fyi/) · [Agency](https://www.agency.inc/) · [DesignAI](https://www.designai.co/) · [Paynalli](https://paynalli.com/)

</div>
