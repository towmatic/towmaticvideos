# Towmatic Marketing Site Redesign: Handoff

This folder is an approved, static prototype of the towmatic.ai **marketing pages**. Rebuild these pages
in the live stack so they match it exactly: layout, copy, images, colors, type, motion and the SEO tags in
each page's `<head>`.

Preview: open `index.html` in a browser (no build step). Everything is plain HTML, one stylesheet
(`styles.css`) and one script (`main.js`).

---

## 1. Do not touch

- **`/login`, `/demo`, `/api` and every dashboard or app route** (`/app`, `/dashboard`, `/companies`,
  `/users`, `/drivers`, `/booked-calls`, `/call-logs`, `/analytics`, `/billing`, `/onboarding`,
  `/settings`, `/support`, `/admin` and the password pages). Only link to them.
- **`robots.txt`**: keep the live file as is. It already allows search and AI crawlers and blocks the
  dashboard and `/api`.
- **DNS and hosting.** The same domain serves the client dashboard, the API and the native app's backend.

---

## 2. Pages and URLs

### Rebuilt in this redesign

| Prototype file | Live URL | Notes |
|---|---|---|
| `index.html` | `/` | Homepage |
| `ai-voice-agent-tow-dispatch.html` | `/ai-voice-agent-tow-dispatch` | **Voice AI page.** Uses this existing URL to keep its ranking. There is no `/voice-ai` page. |
| `web-forms.html` | `/web-forms` | Instant Dispatch Forms |
| `native-app.html` | `/native-app` | Branded Customer App |
| `pricing.html` | `/pricing` | Plans and pricing |
| `contact.html` | `/contact` | Contact form (see section 7) |
| `blog.html` | `/blog` | Blog index |
| `blog-ai-vs-traditional-towing-dispatch.html` | `/blog/ai-vs-traditional-towing-dispatch` | Blog post |
| `blog-book-tow-jobs-in-10-seconds.html` | `/blog/book-tow-jobs-in-10-seconds` | Blog post |

Blog post files sit in the root of this folder only so the prototype opens from disk. Live, they belong
under `/blog/`. Internal links between prototype files (`pricing.html` and so on) become the live URLs above.

### Keep live exactly as they are (not part of this redesign)

These are in the live sitemap and may rank in search. **Do not remove or rename them.** If one is ever
retired, 301-redirect it to the closest page above.

- `/after-hours-tow-answering-service`
- `/ai-towing-dispatch`
- `/towing-company-automation`
- `/towing-dispatch-software-comparison`
- `/about`
- `/special-offer`
- `/signup`
- `/privacy-policy` and `/terms-and-conditions` (linked from the footer)

### Link targets used in the prototype

| Link | Target |
|---|---|
| Login | `/login` |
| Interactive Demo / Try the Interactive Demo | `/demo` |
| Start Free Trial | `/signup` |
| Privacy Policy / Terms & Conditions | `/privacy-policy`, `/terms-and-conditions` |

### Shared nav and footer

Every page carries its own copy of the nav and footer, marked `NAV (shared)` and `FOOTER (shared)` in
comments. They are identical on every page; build them once as shared components live.

---

## 3. Design system

All values are CSS variables at the top of `styles.css`. Components use only these.

### Color

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0F0F0F` | Page background, text on orange buttons |
| `--color-bg-alt` | `#141414` | Alternate sections |
| `--color-surface` | `#1E1E1E` | Cards, panels, menus |
| `--color-border` | `#2A2A2A` | 1px borders and dividers |
| `--color-text` | `#F5F5F5` | Headlines and body |
| `--color-text-muted` | `#A3A3A3` | Subheads, captions |
| `--color-accent` | `#E8722A` | Primary buttons, cycling hero word, key numbers only |

The accent is `#E8722A` everywhere. It replaces the old `#F36F21`, including in `theme-color`.

### Type

- **Bebas Neue** (Google Fonts) for headlines, nav links, buttons, labels and big numbers. Always
  uppercase, letter-spacing `0.01em` (labels `0.08em`).
- **Inter** 400/500/600 (Google Fonts) for body text and subheads, 17–18px, line-height 1.6.
- Sizes: hero 52px (phone) to 110px (desktop); section headings 40px to 72px; labels 14–16px.

### Layout and components

- Content max width 1200px; side gutter 20–40px. Section padding 72px on phones, 120px from 1024px up.
- Cards: 16px radius, 1px border, no heavy shadows.
- Buttons: 52px tall, 10px radius. Primary is solid `#E8722A` with `#0F0F0F` text. Secondary is a 1px
  white outline with white text. Nav buttons are 44px tall.
- Nav: sticky, transparent over photo heroes, solid `#0F0F0F` with a bottom border after scrolling (and
  on pages without a photo hero). From 1080px it shows the full nav with a Products mega-menu; below
  that, a full-screen menu with the two buttons pinned to the bottom.
- Breakpoints used: 480, 600, 640, 720, 768, 900, 960, 1024, 1080, 1100px.

### Motion

- Sections fade in and rise 16px over 500ms, once, when scrolled into view.
- The hero word cycles every 2.5s: call → online booking → app request.
- No parallax or bouncing. With reduced motion on, everything is static and visible.

---

## 4. Images

All images are WebP in `images/` and lazy-loaded below the first screen. The hero is 117 KB (limit
400 KB); every other image is under 160 KB (limit 250 KB).

| File | Used on | Source |
|---|---|---|
| `hero.webp` | Homepage hero (also the hero video poster) | kie.ai, seedream-5-pro |
| `closing.webp` | Closing section on most pages | kie.ai, seedream-5-pro |
| `voice-ai.webp` | Voice AI hero | kie.ai, seedream-5-pro |
| `web-forms.webp` | Web Forms hero | kie.ai, seedream-5-pro |
| `native-app.webp` | Branded App hero | kie.ai, seedream-5-pro |
| `tab-voice.webp`, `tab-forms.webp`, `tab-app.webp`, `tab-dispatch.webp` | Homepage platform tabs | kie.ai, nano-banana-pro |
| `va-voice.webp`, `va-quote.webp`, `va-log.webp` | Voice AI feature blocks | kie.ai, nano-banana-pro |
| `wf-quote.webp`, `wf-locate.webp`, `wf-rotation.webp` | Web Forms feature blocks | kie.ai, nano-banana-pro |
| `app-home.webp`, `app-book.webp`, `app-driver.webp` | Branded App feature blocks | kie.ai, nano-banana-pro |
| `blog-ai-vs-traditional.webp` | AI vs Traditional post cover and blog card | Owner (from the live post) |
| `blog-10-seconds.webp` | 10 Seconds post cover and blog card | Owner (from the live post) |
| `blog-mobile-booking.webp` | Inside the 10 Seconds post | Owner (from the live post) |
| `logo.webp` | Nav and footer logo (transparent) | Owner |
| `favicon.png`, `apple-touch-icon.png` | Browser tab and home-screen icon | Cropped from the owner's logo |

`source/towmatic-logo-original.png` is the owner's original logo file, kept for reference.

**Hero video slot.** The homepage hero has a `<video>` element with `hero.webp` as its poster and the
source commented out ("Add hero video here"). Phones and reduced-motion visitors only ever see the poster.

---

## 5. SEO (all in each page's `<head>`, between `<!-- SEO (generated) -->` and `<!-- /SEO -->`)

Carry every tag over exactly. Each page has:

- A unique `<title>` and `<meta name="description">` (below).
- `<link rel="canonical">` with its live URL.
- Open Graph and Twitter tags. Pages use `https://towmatic.ai/towmatic-og-image.png`; blog posts use their
  cover image. **Make sure these image URLs and the logo URL in the structured data
  (`https://towmatic.ai/towmatic-logo-color.png`) resolve wherever the files are hosted.** Update the paths
  if they are stored elsewhere.
- JSON-LD structured data:
  - Homepage: `Organization` and `SoftwareApplication` (all five plans at current prices).
  - Pricing: `SoftwareApplication`.
  - Homepage, Voice AI, Web Forms, Branded App, Pricing: `FAQPage` built from the visible FAQs. Keep
    it in sync if an FAQ changes.
  - Blog posts: `BlogPosting` and `BreadcrumbList`.
  - **The old self-awarded `aggregateRating` (5 stars from 1 review) has been removed on purpose. Do not
    add it back.**

| Page | Title | Description |
|---|---|---|
| `/` | Towmatic \| AI Dispatch Automation for Tow Companies | Towmatic answers calls, quotes from your rate sheet and dispatches your next driver in seconds, 24/7. Voice AI, online booking and your own branded app. |
| `/ai-voice-agent-tow-dispatch` | AI Voice Agent for Tow Dispatch \| Towmatic | Towmatic Voice AI answers every tow call 24/7, quotes from your real rate sheet and books the job. Multilingual, including Spanish. Every call logged. |
| `/web-forms` | Online Tow Booking Forms \| Towmatic | Let customers book a tow online. Instant quotes by text, one-tap GPS with SmartLocate, and automatic dispatch to your next driver. |
| `/native-app` | Branded Tow Booking App \| Towmatic | Put your tow company in the App Store. A custom app with your name and logo for dealers, body shops and repeat customers, with every booking dispatched automatically. |
| `/pricing` | Pricing \| Towmatic | Towmatic pricing for tow companies. Month-to-month plans for Voice AI, online booking forms and your own branded app. No contracts. |
| `/contact` | Contact \| Towmatic | Contact Towmatic about AI dispatch for your tow company. Sales, customer service and partnership questions. |
| `/blog` | Towmatic Blog \| Insights from Inside the Towing Industry | Real talk about AI dispatch, towing automation and running a tow company, from operators with 90+ years of combined experience. |
| `/blog/ai-vs-traditional-towing-dispatch` | AI vs. Traditional Towing Dispatch: Which Wins in 2026? \| Towmatic Blog | (kept from the live post) Honest, data-backed comparison of AI-powered tow dispatching vs traditional human dispatchers — cost, response time, accuracy, after-hours coverage. |
| `/blog/book-tow-jobs-in-10-seconds` | Book a Tow in 10 Seconds — How Web Forms & QR Codes Change Towing \| Towmatic Blog | (kept from the live post) Customers no longer want to call. Learn how QR-code-driven web forms let drivers book a tow in under 10 seconds — and why partner locations love them. |

**`sitemap.xml`** in this folder lists all 18 live URLs, including the pages kept as is. Replace the live
sitemap with it (or merge it into whatever generates `/sitemap.xml`). `robots.txt` also points to
`/api/sitemap.xml`; leave that as is.

---

## 6. Behavior (`main.js`)

- Nav turns solid on scroll; Products mega-menu (click, hover on desktop, Escape to close).
- Full-screen phone menu; while open, the page behind it is `inert` so keyboard focus stays in the menu.
- Hero cycling word (every 2.5s, paused for reduced motion).
- Hero video plays only on screens 768px and wider without reduced motion, once a source is added.
- Homepage platform tabs: click or arrow keys, Home/End.
- Contact form validation (section 7).
- Scroll-reveal animation.

FAQs use native `<details>`/`<summary>`, so they need no script.

**Scroll position on page change.** Every new page must open at the top. If the live site is a
single-page app, reset the scroll position to the top on each route change, except for Back/Forward
(restore the previous position) and `#anchor` links. The prototype does the same at the top of `main.js`.

---

## 7. Contact form: must be wired up

The prototype form is **visual only**. On submit it checks the required fields and shows "This preview form
isn't connected yet". Connect it to wherever contact messages go today. Fields, matching the current live form:

| Field | Required | Options |
|---|---|---|
| Name | Yes | |
| Email | Yes | |
| Phone | No | |
| Company | No | |
| Inquiry type | Yes | Sales, Customer Service, Partnership |
| How did you hear about us? | No | Google, Referral, Social Media, Trade Show, Other |
| Message | Yes | |

---

## 8. Changes the owner made to the original brief

These are intentional. Build them as shown in the prototype.

- **Product visuals are realistic AI images**, not HTML/CSS mockups (homepage tabs and all three product pages).
- **Voice AI page URL** is `/ai-voice-agent-tow-dispatch`, not `/voice-ai`.
- **Hero proof strip:** "$28,488 captured for one client in one month, nights and weekends only" ·
  "Thousands of tows booked for clients" · "Month-to-month. No contracts."
- **Real Results panel:** $28,488 total, 164 jobs, nights and weekends only. Voice AI 85 jobs / 52% /
  $14,799; Online Form 69 / 42% / $11,895; App 10 / 6% / $1,794.
- **Testimonial** is attributed to **Overland Tow Service**, Towmatic client.
- **Homepage FAQ** added (six owner-supplied questions).
- **Closing section** on every page: "Take Towmatic for a test drive." / "Click around the full dashboard,
  call our AI agent to book a test tow, and try the online booking form yourself." (The demo is a
  sandbox dashboard with a callable AI agent and a test booking form; it is not customized per company.)
- **"Play sample call" buttons removed**; the Voice AI page links to the interactive demo instead.
- **Branded App goes live in 2–3 weeks** (App Store and Google Play).
- **Pricing:** Max and Edge shown as limited-time offers with crossed-out regular prices
  ($1,291/mo + $1,997 setup and $794/mo + $1,997 setup). Voice AI Pro includes Web Forms Pro free. No
  setup fee on Voice AI Pro or Web Forms Pro. The $30/month communication credit is per account.
- **Blog posts** recreated word for word from the live site, with two owner edits: driver dispatch is
  described as a push notification in the Towmatic app (text or phone call as the fallback), and "over
  1,000 jobs" became "thousands of jobs".
- **Official Towmatic logo** used in the nav, the footer and as the favicon.

- **No "live the same day" claim** for Instant Dispatch Forms anywhere (removed at the owner's request).
- **Start Free Trial** buttons go to `/signup`.

### Confirmed by the owner

- All prices and setup fees on the Pricing page.
- The FAQ answers on every page.
- Overland Tow Service approved being quoted by name.

---

## 9. Quality checks already done

- Every page checked at 390px and 1440px: no horizontal scrolling, one `<h1>` per page, headings in order.
- Automated accessibility audit (axe-core, WCAG 2.1 A/AA plus best practices): no violations on any page
  at either width. The color tokens meet WCAG AA contrast.
- Keyboard: skip link, visible focus ring, Products menu (Enter/Escape), tabs (arrow keys), FAQs, and a
  focus-contained phone menu.
- No Towbook references anywhere, including meta tags and structured data.
