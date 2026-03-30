# Plan B Residency — modular assembly guide

Use this document to compose pages from reusable blocks. Full working pages also exist in the project root (`index.html`, `about.html`, etc.) and stay in sync with `partials/`.

## Global CSS (import order)

Single entry point for the browser:

```html
<link rel="stylesheet" href="css/styles.css">
```

`css/styles.css` contains only `@import` lines, in this order:

1. **`css/tokens.css`** — `:root` variables: `#333333`, `#0e3160`, `#375883`, `#ffffff`, `#edeff1`, `#f5f5f5`; `--radius-btn: 50px 50px 50px 0px`; `--radius-card: 30px`; `--radius-card-lg: 100px`; fonts.
2. **`css/base.css`** — box-sizing, `html`, `body`, links, images, `.container`, `.page`, utilities (`.sr-only`, `.text-center`, `.mt-0`, `.mb-0`).
3. **`css/typography.css`** — `h1`–`h3` (serif, H1 ≈54px at ≥900px), `.section-label` (12px, uppercase, 3px letter-spacing).
4. **`css/components-buttons.css`** — `.btn` with literal `border-radius: 50px 50px 50px 0px`, background `#0e3160`, hover `#375883`, uppercase, 3px tracking; `.btn--outline`, `.btn--light`.
5. **`css/components-header-footer.css`** — sticky `.site-header`, flex `.header-inner`, flex `.nav-primary`, mobile drawer; `.site-footer`, flex `.footer-inner`, flex `.footer-links`.
6. **`css/layout-homepage.css`** — hero; `.section` bands; **`display: grid`** for `.approach-grid`, `.service-cards`, `.split-section`, `.article-grid`, `.program-list`, `.program-row`; flex for `.hero`, `.split-section__content`, `.testimonials__track`, `.newsletter-form`, carousel controls.
7. **`css/layout-inner-pages.css`** — `.page-hero`; values arch; **`display: grid`** for `.resource-layout`, `.contact-layout`, `.contact-form .form-row`; assessment and insights filter (flex rows).

Edit one file at a time; avoid changing import order unless you intend to override rules.

## Head assets (fonts + stylesheet)

Copy **`partials/head-assets.html`** into `<head>` after `<meta charset>`, viewport, `<title>`, and meta description.

## Header / footer HTML

- **`partials/header.html`** — `<header class="site-header">` through closing `</header>`.
- **`partials/footer.html`** — `<footer class="site-footer">` through `</footer>`, plus `<script src="js/main.js"></script>`.

Insert between `<body class="page">` and your `<main>` content (header first, footer last).

## Homepage `<main>`

Copy **`partials/homepage-main.html`** in full (it includes the opening and closing `<main>` tags). It preserves:

- `<section class="hero">` with `.hero__bg` / `.hero__overlay`
- `.approach-grid` + `.service-cards` (2×2 grid)
- `.split-section` (two-column grid)
- `.team-section` + overlapping `.team-card`
- `.testimonials` carousel markup
- `.article-grid` (four columns desktop)
- Newsletter section with `form[data-endpoint="none"]` until you wire a backend

## Forms and JavaScript

- Forms that should not POST yet: add `data-endpoint="none"`. `js/main.js` prevents default submit and surfaces a short technical notice until you set `action` or fetch to your CRM/API.
- Remove `data-endpoint="none"` (or set a real endpoint) in production.

## Relative paths

From the site root, `css/styles.css` and `js/main.js` resolve as written. If you deploy in a subdirectory, prefix paths consistently (e.g. `/css/styles.css`).

## Inner pages

Subpages (`about.html`, `contact.html`, …) are not split into partials; copy their `<main>` interiors if you migrate to a templating system. Layout classes match the modules above.
