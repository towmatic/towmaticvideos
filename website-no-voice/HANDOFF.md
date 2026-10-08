# Towmatic Marketing Site Redesign: Handoff (version without Voice AI)

> **This is the "no Voice AI" version of the site.** Towmatic no longer offers Voice AI in this version: the
> product is online booking (Instant Dispatch Forms and the Branded Customer App) with automatic dispatch,
> plus the Towmatic Local add-on. Positioning: booking online is faster and easier than a phone call, so
> customers would rather tap than call. Do not mention Voice AI, an AI phone agent, call minutes or
> "unlimited calls" anywhere.

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

**Reference screenshots** of every page are in `screenshots/` (full page, desktop at 1440px and phone at
390px, e.g. `pricing-desktop.webp`, `pricing-phone.webp`). Match them. They are a visual reference only, not
site assets: don't publish the folder.

### Rebuilt in this redesign

| Prototype file | Live URL | Notes |
|---|---|---|
| `index.html` | `/` | Homepage |
| `web-forms.html` | `/web-forms` | Instant Dispatch Forms |
| `native-app.html` | `/native-app` | Branded Customer App |
| `google-business-profile-management.html` | `/google-business-profile-management` | **New page.** Towmatic Local (Google Business Profile posts and review replies) |
| `pricing.html` | `/pricing` | Plans and pricing |
| `contact.html` | `/contact` | Contact form (see section 7) |
| `blog.html` | `/blog` | Blog index |
| `blog-book-tow-jobs-in-10-seconds.html` | `/blog/book-tow-jobs-in-10-seconds` | Blog post |

Blog post files sit in the root of this folder only so the prototype opens from disk. Live, they belong
under `/blog/`. Internal links between prototype files (`pricing.html` and so on) become the live URLs above.

### Removed pages: set up these 301 redirects

| Old URL | Redirect (301) to | Why |
|---|---|---|
| `/ai-voice-agent-tow-dispatch` | `/web-forms` | Voice AI is no longer offered. Web Forms is the closest replacement and keeps the old page's search value. |
| `/blog/ai-vs-traditional-towing-dispatch` | `/blog` | The post is about AI phone dispatch and is left out of this version. |

### Keep live exactly as they are (not part of this redesign)

These are in the live sitemap and may rank in search. **Do not remove or rename them.** If one is ever
retired, 301-redirect it to the closest page above.

**Owner to review before launch:** some of these older pages (for example `/after-hours-tow-answering-service`
and `/ai-towing-dispatch`) may still describe Voice AI. Keep them live, but have the owner decide whether to
update their copy or redirect them.

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
| `web-forms.webp` | Web Forms hero | kie.ai, seedream-5-pro |
| `native-app.webp` | Branded App hero | kie.ai, seedream-5-pro |
| `tab-forms.webp`, `tab-app.webp`, `tab-dispatch.webp` | Homepage platform tabs | kie.ai, nano-banana-pro |
| `wf-quote.webp`, `wf-locate.webp`, `wf-rotation.webp` | Web Forms feature blocks | kie.ai, nano-banana-pro |
| `app-home.webp`, `app-book.webp`, `app-driver.webp` | Branded App feature blocks | kie.ai, nano-banana-pro |
| `truck-qr-side.webp` (Web Forms, "Put it everywhere"), `truck-qr-back.webp` (homepage, "In the real world") | Real client truck photos with QR codes | Owner (Midwest Tow & Recovery, used with permission; Towmatic watermark cropped out; QR codes left real and scannable) |
| `local.webp`, `local-post.webp`, `local-review.webp` | Towmatic Local hero and feature blocks | kie.ai, nano-banana-pro |
| `blog-10-seconds.webp` | 10 Seconds post cover and blog card | Owner (from the live post) |
| `blog-mobile-booking.webp` | Inside the 10 Seconds post | Owner (from the live post) |
| `logo.webp` | Nav and footer logo (transparent) | Owner |
| `app-store-badge.webp`, `google-play-badge.svg` | Footer app badges | Owner (Apple badge); Google's current official badge |
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
  - Homepage: `Organization` and `SoftwareApplication` (Web Forms Pro, Branded Customer App and Towmatic Local, at current prices).
  - Pricing: `SoftwareApplication`.
  - Homepage, Web Forms, Branded App, Towmatic Local, Pricing: `FAQPage` built from the visible FAQs. Keep
    it in sync if an FAQ changes.
  - Blog posts: `BlogPosting` and `BreadcrumbList`.
  - **The old self-awarded `aggregateRating` (5 stars from 1 review) has been removed on purpose. Do not
    add it back.**

| Page | Title | Description |
|---|---|---|
| `/` | Towmatic \| Online Tow Booking with Automatic Dispatch | Let customers book a tow in seconds instead of calling. Instant quotes by text, one-tap GPS and automatic dispatch to your next driver, 24/7. Online booking forms and your own branded app. |
| `/web-forms` | Online Tow Booking Forms \| Towmatic | Let customers book a tow online. Instant quotes by text, one-tap GPS with SmartLocate, and automatic dispatch to your next driver. |
| `/native-app` | Branded Tow Booking App \| Towmatic | Put your tow company in the App Store. A custom app with your name and logo for dealers, body shops and repeat customers, with every booking dispatched automatically. |
| `/google-business-profile-management` | Google Business Profile Management for Tow Companies \| Towmatic | Towmatic Local keeps your Google Business Profile active with weekly posts that link to your booking form, and replies to every review. $197/mo, no setup fee. |
| `/pricing` | Pricing \| Towmatic | Towmatic pricing for tow companies. Month-to-month plans for online booking forms and your own branded app, with unlimited bookings. No contracts. |
| `/contact` | Contact \| Towmatic | Contact Towmatic about online booking and automatic dispatch for your tow company. Sales, customer service and partnership questions. |
| `/blog` | Towmatic Blog \| Insights from Inside the Towing Industry | Real talk about online booking, towing automation and running a tow company, from operators with 90+ years of combined experience. |
| `/blog/book-tow-jobs-in-10-seconds` | Book a Tow in 10 Seconds — How Web Forms & QR Codes Change Towing \| Towmatic Blog | (kept from the live post) Customers no longer want to call. Learn how QR-code-driven web forms let drivers book a tow in under 10 seconds — and why partner locations love them. |

**`sitemap.xml`** in this folder lists all 17 live URLs, including the pages kept as is. Replace the live
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
- Pricing cost calculator (`#calculator` on `/pricing`): plan picker (Web Forms Pro, Branded Customer App), an
  "Add Towmatic Local (+$197/mo)" checkbox, and sliders for quotes and booked jobs. Math: subscription + add-on
  + (quotes + 2 × jobs) × $0.016 − the $30 communication credit (applied to texts, never below $0; driver backup
  texts and calls also use the credit but aren't estimated), with the setup fee shown separately. Keep the rate in
  `main.js` in sync with billing.
  An **Average ticket price** box (example $175, close to the real results: $13,689 ÷ 79 jobs ≈ $173) adds
  "Revenue from booked jobs" (jobs booked × ticket).
  Below it, **Compare to a human dispatcher**: a Part-time / Full-time toggle and a monthly cost box (example
  starting amounts $2,000 and $4,000; each option remembers its own value). Shows two bars and "You'd save
  $X a month, about $Y a year", or says plainly when Towmatic would cost more.
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
- **No Voice AI.** The Voice AI page, the homepage Voice AI tab, the Voice AI Pro plan, the $97 Web Forms add-on and
  every call-minute and "unlimited calls" line are removed. See the redirects in section 2.
- **Homepage hero:** "Your customers would rather tap than call." (no cycling word).
- **Hero proof strip:** "$13,689 captured for one client in one month" ·
  "Thousands of tows booked for clients" · "Month-to-month. No contracts."
- **Real Results panel:** $13,689 total, 79 jobs, one client, one month. No "nights and weekends only" wording in this version: the forms take bookings 24/7. Online Form 69 jobs / 87% /
  $11,895; App 10 / 13% / $1,794. (The same client's Voice AI bookings are left out because Voice AI isn't offered.)
- **Testimonial** is attributed to **Overland Tow Service**, Towmatic client.
- **Homepage FAQ** (six questions, rewritten for online booking: cancel by text link, choose which booking forms, see every booking, rates, service area, change things myself).
- **Closing section** on every page: "Take Towmatic for a test drive." / "Click around the full dashboard
  and book a test tow with the online booking form yourself." (The demo is a sandbox dashboard with a test
  booking form; it is not customized per company. The owner is updating the demo separately.)
- **Branded App goes live in 2–3 weeks** (App Store and Google Play).
- **Pricing:** two products, Web Forms Pro ($397/mo, no setup fee) and Branded Customer App ($397/mo + $1,997
  setup), plus the Towmatic Local add-on. **The Towmatic Max and Towmatic Edge bundles are discontinued**: do not
  show them anywhere. The $30/month communication credit is per account.
- **Blog posts** recreated word for word from the live site, with two owner edits: driver dispatch is
  described as a push notification in the Towmatic app (text or phone call as the fallback), and "over
  1,000 jobs" became "thousands of jobs". In this version only "Book Jobs in 10 Seconds" is kept, and its
  "For Owners Reluctant to Use Voice AI…" section is retitled "For Owners Reluctant to Change…" (first line: "Some
  tow owners aren't ready to change how they take jobs."); its "Keep reading" link to the removed post is gone.
- **Official Towmatic logo** used in the nav, the footer and as the favicon.
- **Footer app badges:** "Get the Towmatic app for owners and drivers" with the App Store and Google Play badges,
  40px tall, on every page. **They are not linked to the store listings on purpose (owner's choice). Do not add
  links.** Use Google's current "GET IT ON Google Play" badge, never the old "Android app on Google Play" one.
- **Footer notice** reads "Towmatic® is a registered trademark. Patents pending." (Towmatic is a USPTO-registered
  trademark; the Smart feature names stay ™.)
- **The per-text price ($0.016) is not shown to visitors.**
- **The $30/month credit covers text messages** (quotes, booking confirmations, update/cancel/GPS links,
  driver dispatch texts, and review requests) **plus backup texts and calls to drivers** who aren't signed into
  the Towmatic app.
- **Monthly cost calculator** added to the Pricing page (section 6).
- **Unlimited bookings** on every plan: on both product cards on Pricing, the billing note, the calculator, and an FAQ on
  Pricing and the Web Forms and Branded App pages.

- **No "live the same day" claim** for Instant Dispatch Forms anywhere (removed at the owner's request).
- **Start Free Trial** buttons go to `/signup`.
- **Dispatch rules by truck type:** owners set each truck to take light, medium and heavy duty jobs **Always, Only
  If Needed, or Never** (use these exact setting names). Shown in a homepage FAQ and a Web Forms FAQ ("Can I control
  which trucks get which jobs?"), the homepage SmartDispatch tab, the Web Forms dispatch section and the Pricing
  "Every plan" tile.
- **Quotes are optional on the forms.** ASAP Tow, ASAP Service and Scheduled each come in two versions: quote first
  (dispatched when the customer replies YES) or book now (dispatched right away, no quote). Never write that every
  form or every booking is quoted.
- **"I already have a form on my website" objection** is answered in two places: a comparison section on the Web
  Forms page ("Already have a form?" / "Most website forms just send an email.": a typical website form vs the
  Towmatic Instant Dispatch Form, five rows that line up across both cards on desktop and stack on phones), and the
  first FAQ on both the Web Forms page and the homepage ("I already have a 'request a tow' form on my website. Why
  would I need this?", a three-paragraph answer).
- **Free website setup** for Web Forms Pro customers: Towmatic adds the booking form to the customer's website for
  free, as a "Book a Tow" button that opens the form or the whole form built into their page (their choice), on any
  website. Shown as a "We'll put it on your website for you" section on the Web Forms page, a Web Forms FAQ, a
  "Free setup on your website" bullet on the Web Forms Pro card, and a line in the homepage Web Forms tab.
- **Seven booking forms** grid on the Web Forms page ("A form for every kind of job."): ASAP Tow, ASAP Service,
  Private Property, Fleet/Account, Scheduled, Police Calls, Motor Club. Carried over from the original site's Voice AI
  call types, with "Transfer to Human" removed. The Web Forms Pro card and the homepage FAQ list the same seven.
- **Real truck photos** (Midwest Tow & Recovery, a client, approved): homepage "In the real world" section and the
  Web Forms "Put it everywhere" section.
- **Towmatic Local** (new product, new page `/google-business-profile-management`): Google Business Profile
  posts once or twice a week, each with a Book button linking to the customer's Instant Dispatch Form, plus a
  reply to every review (owners can turn on approvals or let Towmatic handle every reply). $197/month add-on to
  any Towmatic plan (not sold on its own for now), no setup fee, no other charges. It is the 3rd product in the nav,
  phone menu and footer, has its own "Grow your business" card on Pricing, and is a calculator add-on.
  Copy rules: present it as a done-for-you service ("we post", "we reply"); don't describe how posts and
  replies are produced; never promise a specific ranking. Benefit copy is framed on Google's own local
  ranking factors (relevance, distance, prominence), with no third-party statistics.

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
