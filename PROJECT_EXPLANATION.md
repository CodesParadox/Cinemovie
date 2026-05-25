# CineMovie — Full Project Explanation

> A complete English walkthrough of the **Cinephile Movie Database** (a.k.a. CineMovie):
> what it is, how it is structured, **what was updated and why**, and a long Q&A section
> with answers to every question you are likely to be asked in a code review, interview,
> or bootcamp presentation.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Application Architecture & Data Flow](#4-application-architecture--data-flow)
5. [What Changed — Full Update Log](#5-what-changed--full-update-log)
6. [Configuration Files](#6-configuration-files)
7. [The API Layer — TMDB](#7-the-api-layer--tmdb)
8. [Custom Hooks](#8-custom-hooks)
9. [Context — Global State](#9-context--global-state)
10. [Routing](#10-routing)
11. [Components (UI Building Blocks)](#11-components-ui-building-blocks)
12. [Pages](#12-pages)
13. [Styling — SCSS Architecture](#13-styling--scss-architecture)
14. [Search, Debouncing & Race-Condition Safety](#14-search-debouncing--race-condition-safety)
15. [Sorting](#15-sorting)
16. [Watchlist Persistence](#16-watchlist-persistence)
17. [Loading, Empty & Error States](#17-loading-empty--error-states)
18. [Dark / Light Theme](#18-dark--light-theme)
19. [Accessibility](#19-accessibility)
20. [Error Boundaries](#20-error-boundaries)
21. [Local Development vs Production Build](#21-local-development-vs-production-build)
22. [Deployment](#22-deployment)
23. [Edge Cases Handled](#23-edge-cases-handled)
24. [Q&A — Every Question You Might Be Asked](#24-qa--every-question-you-might-be-asked)

---

## 1. Project Overview

**CineMovie** (formerly *Cinephile Movie Database*) is a Single Page Application (SPA) built with React.
It lets a user discover movies, view rich details for any title, watch the official trailer, and curate a personal **Watchlist** that survives page reloads — all powered by **The Movie Database (TMDB) API**, with **zero backend**.

### What the app does

- A cinematic **home page** with a trending-movies hero slider (auto-play, swipeable) and a live search.
- A dedicated **Movies catalog page** (`/movies`) that shows TMDB's popular feed, supports search inside the catalog, and offers **Load More** pagination.
- A **detail page** (`/movie/:id`) with a full-bleed backdrop hero, poster, plot, top-billed cast, embedded YouTube trailer, and a metadata grid (director, writer, release date, runtime, genres, language, country, box-office).
- A **Watchlist page** (`/watchlist`) that lists every saved movie and persists across browser sessions via `localStorage`.
- A **Dark / Light** theme toggle that also persists.
- Proper **loading**, **empty**, and **error** states for every async surface.
- Accessible markup, keyboard navigation, ARIA labels, semantic HTML.
- **No backend** — the entire app is a static SPA deployable to Vercel or Netlify.

### What we deliberately did *not* build

- No backend, no database (only `localStorage`).
- No UI framework (Tailwind / MUI). Styling is hand-written SCSS + CSS variables.
- No TypeScript — plain JS + JSX + `prop-types` for runtime prop checks.
- No global state library (Redux / Zustand). React Context covers our needs.

---

## 2. Tech Stack

| Technology | Version | Purpose |
| --- | --- | --- |
| **Vite** | ^6.0.5 | Build tool / dev server (fast HMR). |
| **React** | ^18.3.1 | UI library. |
| **React DOM** | ^18.3.1 | DOM rendering for React. |
| **React Router DOM** | ^6.28.0 | Client-side routing. |
| **Sass** | ^1.100.0 | SCSS preprocessor for the styling layer. |
| **Swiper** | ^12.1.4 | Touch-enabled slider for the trending hero. |
| **prop-types** | ^15.8.1 | Runtime prop validation for reusable components. |
| **@vitejs/plugin-react** | ^4.3.4 | React Fast Refresh + JSX support for Vite. |
| **TMDB API** | v3 | Source of all movie data. |
| **localStorage** | — | Persists Watchlist + Theme. |

---

## 3. Folder Structure

```
Cinemovie/
├── public/
│   ├── clapperboard.svg          # favicon
│   └── _redirects                # Netlify SPA fallback
├── dist/                         # production build output (generated)
├── src/
│   ├── api/
│   │   └── tmdb.js               # TMDB fetch wrapper + endpoint functions
│   ├── context/
│   │   ├── ThemeContext.jsx      # dark/light theme + persistence
│   │   └── WatchlistContext.jsx  # watchlist state + persistence (v2 schema)
│   ├── hooks/
│   │   ├── useDebounce.js        # generic debounce hook
│   │   └── useLocalStorage.js    # useState-like hook backed by localStorage
│   ├── routes/
│   │   └── Routes.jsx            # all <Route> definitions
│   ├── scss/
│   │   ├── _variables.scss       # design tokens ($colors, $sizes, $fonts)
│   │   ├── _breakpoint.scss      # named breakpoints
│   │   ├── _mixin.scss           # reusable mixins (mobile/tablet/flex/overlay)
│   │   └── _index.scss           # forwards all partials
│   ├── components/               # each component is its own folder (jsx + scss)
│   │   ├── button/               # Button + OutlineButton + button.scss
│   │   ├── error-boundary/       # ErrorBoundary (class component)
│   │   ├── footer/               # Footer + footer.scss
│   │   ├── header/               # Header + header.scss   (the real top nav)
│   │   ├── navbar/               # Navbar + navbar.scss   (legacy/alt top nav)
│   │   ├── hero-backdrop/        # cinematic detail-page hero
│   │   ├── hero-slide/           # Swiper-powered trending slider on Home
│   │   ├── input/                # styled <input>
│   │   ├── modal/                # Modal + ModalContent (reusable dialog)
│   │   ├── movie-card/           # poster + title + rating + watchlist btn
│   │   ├── movie-card-skeleton/  # shimmer placeholder
│   │   ├── movie-grid/           # grid + loading/empty/error states
│   │   ├── page-header/          # banner used by /movies
│   │   ├── search-bar/           # search input with clear button
│   │   ├── sort-controls/        # pill buttons for sorting
│   │   └── watchlist-button/     # add/remove watchlist button
│   ├── pages/
│   │   ├── HomePage.jsx          # /         — hero slider + search
│   │   ├── CatalogPage.jsx       # /movies   — popular + search + pagination
│   │   ├── MovieDetailPage.jsx   # /movie/:id
│   │   └── WatchlistPage.jsx     # /watchlist
│   ├── App.jsx                   # Header + Routes + Footer (wrapped in error boundaries)
│   ├── main.jsx                  # createRoot, BrowserRouter, providers
│   └── index.scss                # global resets, CSS vars (themes), layout utils
├── .env                          # VITE_TMDB_API_KEY=...   (not committed)
├── .env.example                  # template for the env file
├── index.html                    # Vite HTML entry
├── vite.config.js                # @vitejs/plugin-react
├── vercel.json                   # SPA fallback for Vercel
├── package.json
└── README.md
```

### Component-folder convention

Every reusable component lives in its **own folder** with the `.jsx` and a matching `.scss`
(e.g. `src/components/movie-card/MovieCard.jsx` + `src/components/movie-card/movie-card.scss`).
This keeps styles colocated with the markup that owns them and prevents class-name leaks
because each partial is `@use`-imported by the component file itself.

---

## 4. Application Architecture & Data Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│ main.jsx                                                             │
│   <StrictMode>                                                       │
│     <BrowserRouter>                                                  │
│       <ThemeProvider>                                                │
│         <WatchlistProvider>                                          │
│           <App />                                                    │
│         </WatchlistProvider>                                         │
│       </ThemeProvider>                                               │
│     </BrowserRouter>                                                 │
│   </StrictMode>                                                      │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│ App.jsx                                                              │
│   <ErrorBoundary silent>  <Header /> </ErrorBoundary>                │
│   <ErrorBoundary>         <AppRoutes /> </ErrorBoundary>             │
│   <ErrorBoundary silent>  <Footer /> </ErrorBoundary>                │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                ┌──────────── AppRoutes ────────────┐
                │ /            → HomePage           │
                │ /movies      → CatalogPage        │
                │ /movie/:id   → MovieDetailPage    │
                │ /watchlist   → WatchlistPage      │
                │ *            → Navigate("/")      │
                └───────────────────────────────────┘
```

### End-to-end search flow

```
User types
   │
   ▼
SearchBar  ── onChange ──▶  setQuery() in page state
   │
   ▼
useDebounce(query, 400ms)  ──▶ debouncedQuery
   │
   ▼
useEffect (depends on debouncedQuery)
   │
   ├── new AbortController()
   ├── searchMovies(query, signal) from api/tmdb.js
   └── on response → setMovies(results)
   │
   ▼
useMemo sorts the array
   │
   ▼
MovieGrid receives `movies` + `loading` + `error`
   │
   ├── loading → render N MovieCardSkeleton
   ├── error   → render <state-screen role="alert">
   ├── empty   → render context-aware empty state
   └── results → render MovieCard for each item
```

---

## 5. What Changed — Full Update Log

This is the most important section: it lists every meaningful change made on top of the original starter and explains **why** each change was made.

### 5.1 API migration: OMDb → TMDB
- **Old:** `src/api/omdb.js` calling `https://www.omdbapi.com/` with `imdbID`, `Title`, `Year`, `Poster`, `Plot`, etc.
- **New:** `src/api/tmdb.js` calling `https://api.themoviedb.org/3/`. Field names changed to TMDB's schema: `id`, `title`, `release_date`, `poster_path`, `backdrop_path`, `vote_average`, `overview`, `genres`, `runtime`, `revenue`, `production_countries`, `spoken_languages`, `credits`, `videos`.
- **Why:** TMDB is the richer source — it gives us **backdrops** for the cinematic hero, **videos** (trailers), **credits** (cast + crew), **trending feeds**, and **pagination metadata** (`page` / `total_pages` / `total_results`).
- New endpoints added: `getTrending`, `getPopular`, `getPopularPaged`, `searchMoviesPaged`, plus enrichments via `append_to_response=credits,videos` on `getMovieDetails`.
- New image base helpers: `IMG_URL` (w500) for cards and `BACKDROP_URL` (original) for hero backgrounds.

### 5.2 Watchlist storage key bumped to v2
- Storage key changed from `cinephile_watchlist` → `cinephile_watchlist_v2`.
- **Why:** the persisted shape is no longer OMDb-compatible (`Title/Year/Poster/imdbID`); it now stores TMDB fields (`id/title/release_date/poster_path/vote_average/media_type`). Old v1 entries are intentionally retired by changing the key.

### 5.3 Component architecture: flat → folder-per-component
- **Old:** flat files like `src/components/Navbar.jsx`, `MovieCard.jsx`, `MovieGrid.jsx` with their styles in one big `index.css`.
- **New:** every component lives in its own folder with a matching SCSS partial:
  - `components/navbar/Navbar.jsx` + `navbar.scss`
  - `components/movie-card/MovieCard.jsx` + `movie-card.scss`
  - `components/movie-grid/MovieGrid.jsx` + `movie-grid.scss`
  - …and so on for every component.
- **Why:** keeps styles colocated with the markup that owns them, makes deletion safe (delete the folder = delete the styles), and prevents one giant CSS file from becoming a dumping ground.

### 5.4 CSS → SCSS
- `src/index.css` was replaced by `src/index.scss`.
- A new `src/scss/` folder hosts:
  - `_variables.scss` — design tokens (`$main-color`, `$header-height`, `$mobile-width`, `$font-family`).
  - `_breakpoint.scss` — re-exported breakpoint constants.
  - `_mixin.scss` — `@mixin mobile`, `tablet`, `flex(...)`, `overlay`.
  - `_index.scss` — `@forward`s all the above so component files can do a single `@use '../../scss' as *`.
- **Why:** SCSS gives us mixins for media queries and reusable variables for spacing/colors. Runtime-switchable values (light/dark) still live in CSS custom properties, so the theme switch can happen instantly without rebuilding any CSS.

### 5.5 New page: CatalogPage (`/movies`)
- Lists TMDB's popular movies by default; switches to search results when the user types ≥ 2 characters.
- Implements **Load More** pagination using `getPopularPaged` / `searchMoviesPaged`.
- Uses a `useRef` request-id counter to ensure **stale responses from older queries cannot overwrite newer results** (classic race-condition fix).
- **Why:** the original starter only had a single search page. A real catalog needs a discoverable "popular" feed plus pagination.

### 5.6 New component: HeroSlide (Home page)
- A `Swiper`-powered carousel of the top 5 weekly trending movies, with auto-play, navigation arrows, and clickable pagination dots.
- Each slide shows the backdrop, title, truncated overview, TMDB rating, "Watch Now" button (navigates to `/movie/:id`), and a watchlist toggle.
- Falls back to a skeleton during fetch and to `null` on error (silent).
- **Why:** transforms the landing page from a search box on a blank background into a true cinematic discovery surface.

### 5.7 New component: HeroBackdrop (Detail page)
- A full-bleed image hero on `/movie/:id` using `BACKDROP_URL` (or poster fallback), with a gradient overlay, year/runtime/rating/genre badges, and a large watchlist button.
- **Why:** matches the "production-style" cinematic look promised in the README.

### 5.8 New components: Header & Footer
- `Header.jsx` is the real top navigation — a fixed bar with a scroll-shrink effect (`shrink` class added once `scrollY > 50`), `NavLink`-based highlights, a watchlist badge counter, and the theme toggle.
- `Footer.jsx` shows the brand, navigation links, a credit to TMDB, and the year.
- The original `Navbar.jsx` is still in the tree as an alternative styling, but `App.jsx` actually mounts `Header`.

### 5.9 New routing module: `src/routes/Routes.jsx`
- Routes used to be declared inline in `App.jsx`. They are now in their own file (`AppRoutes`), which makes `App.jsx` very small (Header + Routes + Footer wrapped in error boundaries) and keeps route declarations in one obvious place.

### 5.10 Error boundaries everywhere it matters
- New `components/error-boundary/ErrorBoundary.jsx` (class component using `getDerivedStateFromError` + `componentDidCatch`).
- `App.jsx` wraps **Header**, **Routes**, and **Footer** in their own error boundaries with `silent` for Header/Footer (renders nothing instead of an alert) and a normal boundary around Routes.
- `HomePage.jsx` also wraps `HeroSlide` in a boundary so a Swiper or trending-fetch failure cannot blank the home page.
- **Why:** isolates flaky widgets (slider, banner ads, embed) so a single render failure cannot blank the whole app.

### 5.11 Trailer embed
- `MovieDetailPage.jsx` picks the first **official YouTube Trailer** from `movie.videos.results`, falling back to any YouTube `Trailer` if no official one exists, and embeds it via an `<iframe>` with `aspect-ratio: 16/9`, lazy-loading, and proper `allow` permissions for fullscreen + autoplay.
- **Why:** delivers the "Watch the trailer" feature with no extra API calls (we already requested `videos` via `append_to_response`).

### 5.12 Race-condition guards
- `CatalogPage.jsx` uses `requestIdRef = useRef(0)` and increments it on every new query. Each in-flight request remembers its own `myId`; if a newer request has already incremented the counter, the older response is discarded.
- `HomePage.jsx` and `MovieDetailPage.jsx` use the cleaner `AbortController` pattern with `controller.abort()` returned from `useEffect`.
- **Why:** prevents the "last-fetch-wins instead of latest-fetch-wins" bug that happens when an earlier request finishes after a later one.

### 5.13 New reusable UI components
- `Button` (filled) + `OutlineButton` (ghost) — both `prop-types`-validated.
- `Input` — a styled controlled input used by the catalog search.
- `Modal` + `ModalContent` — a reusable dialog with Esc-to-close, backdrop click, and proper `role="dialog"` / `aria-modal`.
- `PageHeader` — a banner with optional `backgroundImage` used at the top of `/movies`.

### 5.14 Trending / popular / paginated endpoints
- `getTrending('week' | 'day', signal)` — feeds HeroSlide.
- `getPopular(page, signal)` — non-paginated convenience helper.
- `getPopularPaged(page, signal)` and `searchMoviesPaged(query, page, signal)` — return the full TMDB envelope (`results`, `page`, `total_pages`, `total_results`) so `CatalogPage` can render a correct **Load More** button.

### 5.15 Tooling additions
- Added `sass`, `swiper`, and `prop-types` as runtime dependencies.
- `index.html` now preconnects to Google Fonts and pulls in **Montserrat** (300/400/500/600/700).
- The `<html>` element ships with `data-theme="light"` so the page does not flash dark on first paint.

---

## 6. Configuration Files

### `package.json`
- Scripts:
  - `npm run dev` → starts Vite dev server on `http://localhost:5173`.
  - `npm run build` → builds to `dist/`.
  - `npm run preview` → serves the production build locally for sanity-checking.
- ES module project (`"type": "module"`).

### `vite.config.js`
- Minimal — just registers `@vitejs/plugin-react` for React Fast Refresh and JSX. No custom aliases on purpose, to keep imports explicit.

### `vercel.json`
- Tells Vercel to rewrite all unknown URLs back to `index.html` so React Router can handle them client-side. Without this, refreshing `/movie/123` would 404.

### `public/_redirects`
- Same purpose as `vercel.json` but for Netlify (`/*  /index.html  200`).

### `.env.example`
```
VITE_OMDB_API_KEY=your_key_here
VITE_TMDB_API_KEY=your_key_here
```
- The OMDb variable is kept around so older code that referenced it does not need to be deleted; **only `VITE_TMDB_API_KEY` is read by the current code**.
- Vite exposes `import.meta.env.VITE_*` to the client, so anything prefixed with `VITE_` is shipped to the browser. Never put server secrets there.

### `index.html`
- Sets `lang="en"` and `data-theme="light"` on `<html>` (so the theme is correct before React boots).
- Preconnects to Google Fonts; loads Montserrat.
- Single `<div id="root">` for React to mount into.
- Imports `/src/main.jsx` as a module.

---

## 7. The API Layer — TMDB

File: `src/api/tmdb.js`

```js
const API_KEY  = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const IMG_URL      = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';
```

All TMDB calls go through a single `tmdbFetch(path, signal)` helper that:
1. Appends the API key with the correct separator (`?` or `&`).
2. Calls `fetch` with the optional `AbortSignal`.
3. Parses the response body even on errors so we can surface TMDB's `status_message` instead of a generic "Network error".

### Exported functions

| Function | Endpoint | Returns | Used By |
| --- | --- | --- | --- |
| `searchMovies(query, signal, page=1)` | `/search/movie` | `Array` of TMDB movie objects | `HomePage` |
| `searchMoviesPaged(query, page, signal)` | `/search/movie` | `{ results, page, total_pages, total_results }` | `CatalogPage` |
| `getMovieDetails(id, signal)` | `/movie/:id?append_to_response=credits,videos` | Full movie object incl. cast + trailers | `MovieDetailPage` |
| `getTrending(timeWindow='week', signal)` | `/trending/movie/:window` | `Array` of trending movies | `HeroSlide` |
| `getPopular(page=1, signal)` | `/movie/popular` | `Array` of popular movies | (helper) |
| `getPopularPaged(page=1, signal)` | `/movie/popular` | `{ results, page, total_pages, total_results }` | `CatalogPage` |

### Why `append_to_response`
A single `/movie/:id?append_to_response=credits,videos` call returns full details, the cast/crew, **and** the trailer list in one round-trip. That avoids 3 sequential requests and keeps the detail page snappy.

---

## 8. Custom Hooks

### `useDebounce(value, delay)` — `src/hooks/useDebounce.js`
- Sets a timeout to copy `value` into an inner state after `delay` ms.
- Returns the inner state.
- The timeout is **cleared on every change** in `useEffect`'s cleanup, so rapid typing only resolves once the user pauses.

### `useLocalStorage(key, initialValue)` — `src/hooks/useLocalStorage.js`
- `useState`-shaped hook (`[value, setValue]`) backed by `localStorage`.
- Reads the initial value lazily in the `useState` initializer (so we never block the first render).
- Wraps both read and write in `try / catch` so private-browsing or quota errors fall back to in-memory state instead of crashing.

---

## 9. Context — Global State

### `ThemeContext.jsx`
- Stores `theme: 'light' | 'dark'`, hydrated from `localStorage.getItem('cinephile_theme')` (default `'light'`).
- Whenever the theme changes, an effect sets `data-theme` on `<html>` and writes the new value back to `localStorage`.
- Exposes `useTheme()` which throws if called outside the provider — that catches the classic "forgot the provider" bug at runtime.

### `WatchlistContext.jsx`
- Backed by `useLocalStorage('cinephile_watchlist_v2', [])`.
- Exposes:
  - `addToWatchlist(movie)` — guards against duplicates with `prev.some(m => m.id === movie.id)` and stores **only the fields a card needs** to render (`id`, `title`, `release_date`, `poster_path`, `vote_average`, `media_type: 'movie'`) so the watchlist works without re-fetching.
  - `removeFromWatchlist(id)`.
  - `isInWatchlist(id)`.
- All callbacks are `useCallback`-wrapped to keep their identity stable across renders.

---

## 10. Routing

File: `src/routes/Routes.jsx`

```jsx
<Routes>
  <Route path="/"          element={<HomePage />} />
  <Route path="/movies"    element={<CatalogPage />} />
  <Route path="/movie/:id" element={<MovieDetailPage />} />
  <Route path="/watchlist" element={<WatchlistPage />} />
  <Route path="*"          element={<Navigate to="/" replace />} />
</Routes>
```

- `*` route uses `<Navigate to="/" replace />` so deep links to unknown URLs land on Home **without** polluting the back-button history.
- `<BrowserRouter>` lives in `main.jsx` so all providers (theme, watchlist) can read routing state.

---

## 11. Components (UI Building Blocks)

Every component lives in `src/components/<folder>/`.

### `header/Header.jsx`
- Fixed top bar with `scrollY > 50` → `shrink` class for the typical "compact-on-scroll" effect.
- Logo links to `/`. `NavLink`s to `/`, `/movies`, `/watchlist` with active styling.
- Renders a small **badge** with the watchlist count when it is non-empty.
- Theme toggle button on the right.

### `footer/Footer.jsx`
- Brand column, navigation column, "Powered by TMDB" credit, year-aware copyright line.

### `navbar/Navbar.jsx`
- An alternative / legacy header (Discover + Watchlist + theme). Kept in the tree but `App.jsx` mounts the newer `Header`.

### `error-boundary/ErrorBoundary.jsx`
- Class component implementing `getDerivedStateFromError` and `componentDidCatch`.
- Supports three rendering modes: `fallback` (node **or** function `(err, reset) => node`), `silent` (renders `null`), and a default banner.

### `hero-slide/HeroSlide.jsx`
- Fetches `getTrending('week')`, slices to 5 results, and renders a `Swiper` with autoplay (5s, paused on hover), navigation arrows, and clickable pagination dots.
- Each slide shows the backdrop, rating badge, title (linked), 150-char truncated overview, a primary "Watch Now" button, and a watchlist toggle.
- Renders a skeleton while loading and `null` on error (so the home page is never broken by a slider failure).

### `hero-backdrop/HeroBackdrop.jsx`
- Cinematic hero used on the detail page.
- Prefers `backdrop_path`, falls back to `poster_path`, then to a CSS gradient.
- Shows title, year, runtime, rating, and genres as badges, plus a large `WatchlistButton`.

### `movie-card/MovieCard.jsx`
- The grid tile: poster (with no-poster fallback), rating badge top-right, watchlist button overlay, title + year.
- Wrapped in a `<Link to="/movie/:id">` for full-card click + keyboard activation.

### `movie-card-skeleton/MovieCardSkeleton.jsx`
- Shimmer placeholder matching the dimensions of `MovieCard`.
- `aria-hidden="true"` so screen readers do not announce the placeholders during loading.

### `movie-grid/MovieGrid.jsx`
- Owns the four states: **loading** (10 skeletons), **error** (`role="alert"`), **empty** (contextual messages for watchlist / search / first-visit), and **results**.

### `search-bar/SearchBar.jsx`
- Controlled input with `autoFocus` on first mount and a clear button (✕) that resets the value and refocuses the input.
- `type="search"` + `autoComplete="off"` + `spellCheck="false"`.

### `sort-controls/SortControls.jsx`
- Three pill buttons (Title A–Z, Year, Rating) with `aria-pressed` reflecting the active sort.

### `watchlist-button/WatchlistButton.jsx`
- Two visual variants: a compact icon button (default) and a `large` pill button.
- `e.preventDefault() + e.stopPropagation()` on click so it does not also trigger the surrounding card's `Link`.

### `button/Button.jsx` + `button/OutlineButton.jsx`
- Generic filled and outline buttons with `prop-types`. `OutlineButton` is a thin wrapper that adds a `btn--outline` class.

### `input/Input.jsx`
- Styled controlled input (`prop-types`).

### `modal/Modal.jsx` + `modal/ModalContent.jsx`
- A reusable dialog. `Modal` handles the overlay, Escape key, and click-outside; `ModalContent` is the inner content box with an absolutely positioned close button.

### `page-header/PageHeader.jsx`
- Banner used at the top of `/movies`. Renders a gradient by default; if `backgroundImage` is supplied, the gradient is layered over the image.

---

## 12. Pages

### `HomePage.jsx` — `/`
1. Renders `HeroSlide` (wrapped in an `ErrorBoundary`).
2. Below it: `SearchBar` + (when there are results) a results-count line + `SortControls` + `MovieGrid`.
3. Owns `query`, `movies`, `loading`, `error`, `sortBy` state.
4. Uses `useDebounce(query, 400)` and a fresh `AbortController` per fetch.
5. Skips fetching when `query.length < 2` (saves the free-tier quota).
6. `useMemo` sorts the results — re-runs only when `movies` or `sortBy` change.

### `CatalogPage.jsx` — `/movies`
1. Defaults to TMDB popular (no query); flips to `searchMoviesPaged` once the debounced query reaches 2 chars.
2. Owns `query`, `movies`, `page`, `totalPages`, `loading`, `loadingMore`, `error`.
3. Uses a `requestIdRef` counter to discard stale responses (see §14).
4. Renders a `Load More` button when `page < totalPages` and there is no error.

### `MovieDetailPage.jsx` — `/movie/:id`
1. Reads the TMDB id from `useParams`.
2. Calls `getMovieDetails(id, signal)` and renders:
   - `HeroBackdrop` at the top
   - "← Back to Discover" link
   - Poster + plot + cast chips (first 8) + trailer iframe + metadata grid
3. Shows a custom skeleton (hero block + poster + lines) while loading and a friendly error screen on failure.
4. Picks the best trailer with: `type === 'Trailer' && site === 'YouTube' && official` → fall back to any YouTube Trailer.

### `WatchlistPage.jsx` — `/watchlist`
1. Reads `watchlist` from `WatchlistContext`.
2. Renders a page header with the count + a `MovieGrid` (`isWatchlist` is `true` so the empty state shows the right message).
3. No loading or error state — the watchlist is local and synchronous.

---

## 13. Styling — SCSS Architecture

- **Design tokens** (static values shared everywhere): `src/scss/_variables.scss`.
  - `$main-color: #e50914` (Netflix-red accent), `$header-height: 70px`, `$mobile-width: 768px`, `$tablet-width: 1024px`, `$font-family: 'Montserrat'`.
- **Breakpoints** are re-exported via `_breakpoint.scss` as `$bp-mobile` / `$bp-tablet`.
- **Mixins** in `_mixin.scss`:
  - `@mixin mobile / tablet` — guard a block with the right `max-width` media query.
  - `@mixin flex($align, $justify)` — one-liner for common flex patterns.
  - `@mixin overlay` — `background-color: rgba(0,0,0,0.6)`.
- **`_index.scss`** uses `@forward` to expose all three so component partials just `@use '../../scss' as *`.
- **Runtime theme values** live in `src/index.scss` as CSS custom properties:
  - `:root, [data-theme='light']` defines the light palette.
  - `[data-theme='dark']` redefines the same variables.
  - All components reference `var(--text)`, `var(--bg)`, `var(--accent)`, etc. — flipping `data-theme` on `<html>` swaps everything instantly with no rebuild.
- **`.skeleton`** is a global utility that paints a moving gradient (`@keyframes shimmer`) and is reused by every skeleton variant.
- **Layout primitives** in the same file: `.container` (max-width 1280, centered), `.page-content`, plus a few page-scoped layouts (`.home-page`, `.catalog-page`, `.detail-layout`).

---

## 14. Search, Debouncing & Race-Condition Safety

### Why debounce
Without debounce, every keystroke would fire a TMDB request. Typing "inception" would burn ~9 requests in under a second. With `useDebounce(query, 400)` the request only fires once the user pauses for 400 ms — exactly when the user actually wants results.

### Why a minimum query length
TMDB returns wildly broad results for 1-char queries. We require `query.length >= 2` to avoid wasting the free-tier quota (1,000 requests / day) and to give better UX (no thrashing on the first keystroke).

### AbortController (HomePage, MovieDetailPage)
- We create a fresh `AbortController` inside the effect.
- We pass `controller.signal` to `fetch`.
- The effect's cleanup calls `controller.abort()`. If the dependencies change before the fetch resolves, the in-flight request is cancelled and its catch block ignores `AbortError`.

### Request-ID counter (CatalogPage)
For paginated screens we also use `requestIdRef.current` (a `useRef` counter incremented on every new query). Even if a response sneaks past the abort (e.g. it was already in the resolved microtask queue), we check `requestIdRef.current === myId` before committing the state. This is a belt-and-braces protection against "older request wins".

---

## 15. Sorting

`HomePage` exposes three sorts via `SortControls`:

```js
function sortMovies(movies, sortBy) {
  const copy = [...movies];
  switch (sortBy) {
    case 'year':   return copy.sort((a, b) => (parseInt(b.release_date) || 0) - (parseInt(a.release_date) || 0));
    case 'rating': return copy.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    case 'title':
    default:       return copy.sort((a, b) => a.title.localeCompare(b.title));
  }
}
```

Key points:
- We **copy** the array (`[...movies]`) because `Array.prototype.sort` mutates in place — sorting the original would break React's referential equality assumptions.
- `localeCompare` for titles so accented characters sort correctly.
- Missing `release_date` or `vote_average` defaults to `0` so undefined values don't crash the comparison.
- The whole thing is wrapped in `useMemo([movies, sortBy])` so we don't re-sort on every unrelated render.

---

## 16. Watchlist Persistence

- Storage key: `cinephile_watchlist_v2` (bumped from `v1` because the schema changed).
- Stored shape per movie:
  ```json
  {
    "id": 27205,
    "title": "Inception",
    "release_date": "2010-07-16",
    "poster_path": "/.../poster.jpg",
    "vote_average": 8.4,
    "media_type": "movie"
  }
  ```
- Why those fields exactly: they are the **minimum required to render a `MovieCard`** without re-hitting TMDB. The watchlist page is therefore offline-friendly and instant.
- Add/remove is guarded by `prev.some(m => m.id === movie.id)` so adding the same movie twice is a no-op.
- The whole state is persisted by `useLocalStorage` on every change, inside a `try/catch` so private-browsing failures don't crash the app.

---

## 17. Loading, Empty & Error States

`MovieGrid` is the single source of truth for these four states:

| State | Trigger | What renders |
| --- | --- | --- |
| Loading | `loading === true` | 10 `MovieCardSkeleton`s in the grid, `aria-busy="true"` |
| Error | `error !== null` | `state-screen` with `role="alert"` and the error message |
| Empty (watchlist) | `movies.length === 0 && isWatchlist` | "Your watchlist is empty" message |
| Empty (search) | `movies.length === 0 && query.length >= 2` | "No results for …" |
| Empty (first visit) | `movies.length === 0 && no query` | "Find your next favourite film" |
| Results | otherwise | `MovieCard` per movie |

`MovieDetailPage` ships its own skeleton (hero block + poster + meta lines) and its own error screen (with a "← Back to Discover" link).

---

## 18. Dark / Light Theme

- The state lives in `ThemeContext`.
- It is read **synchronously** from `localStorage` in the `useState` initializer so the first paint already uses the saved theme.
- `useEffect` writes `document.documentElement.setAttribute('data-theme', theme)` so all our CSS variables flip in one paint.
- `index.html` also hard-codes `data-theme="light"` so we never flash dark before React boots.
- The toggle button lives in the `Header` and switches between `🌙` and `☀️` with `aria-label`s that announce the upcoming theme.

---

## 19. Accessibility

- Every interactive icon has an `aria-label` (search clear button, theme toggle, watchlist button, modal close button, sort buttons via `aria-pressed`, navigation badges).
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<aside>` (poster), `<section>`s with `aria-labelledby`.
- Skeleton wrappers use `aria-busy="true"` and skeletons themselves are `aria-hidden="true"` so SRs don't read them.
- Error screens use `role="alert"` so they're announced.
- Modal uses `role="dialog"` + `aria-modal="true"`, listens for `Escape`, and closes on backdrop click.
- All interactive elements are real `<button>` or `<a>` elements (no `div onClick`), so keyboard navigation and focus rings come for free.
- Images that are purely decorative (hero backgrounds) use `alt=""` + `aria-hidden="true"`. Movie posters use a meaningful `alt={`${title} poster`}`.

---

## 20. Error Boundaries

- `ErrorBoundary` is a generic class component that prevents a child render error from crashing the whole React tree.
- Used in three places in `App.jsx`:
  - `<ErrorBoundary label="Header" silent>` — if the Header throws (e.g. theme context misuse), the app renders without it instead of crashing.
  - `<ErrorBoundary label="Routes">` — if a page throws, we show the default banner so the user knows something went wrong, but the Header and Footer keep working.
  - `<ErrorBoundary label="Footer" silent>` — same idea as Header.
- Also used inside `HomePage` around `HeroSlide`, so a Swiper bug or a trending fetch failure can never blank Home.
- The boundary logs the error + component stack to the console so you can debug in DevTools.

---

## 21. Local Development vs Production Build

| | Dev (`npm run dev`) | Build (`npm run build`) |
| --- | --- | --- |
| Bundler | Vite (esbuild + native ESM, HMR) | Rollup-based production build |
| URL | http://localhost:5173 | served from `dist/` |
| Sourcemaps | Yes | Configured by Vite defaults |
| Env vars | `.env` is read on boot | `.env` is **inlined at build time** (`import.meta.env.VITE_*` becomes a literal string) |
| Output | None (in-memory) | `dist/` with hashed assets ready for any static host |
| Preview | — | `npm run preview` to sanity-check the production build |

---

## 22. Deployment

### Vercel
1. Push the repo to GitHub.
2. Import the repo on vercel.com.
3. Set `VITE_TMDB_API_KEY` in **Settings → Environment Variables**.
4. Deploy. `vercel.json` already rewrites unknown URLs to `index.html` so React Router takes over.

### Netlify
1. Import the repo on Netlify.
2. Build command: `npm run build`. Publish directory: `dist`.
3. Set `VITE_TMDB_API_KEY` in **Site settings → Environment variables**.
4. `public/_redirects` is already in place for SPA fallback.

> Both hosts inject env vars at build time. If you change the key, you must redeploy.

---

## 23. Edge Cases Handled

- TMDB rate-limit / 4xx / 5xx → we read `status_message` from the body and surface it.
- Empty / missing poster → "No poster" placeholder card.
- Missing `release_date` / `vote_average` → graceful fallbacks in the card and sort functions.
- Aborted fetches → caught via `err.name === 'AbortError'` and ignored.
- Stale responses → discarded via `requestIdRef`.
- `localStorage` throwing in private browsing → swallowed by `try/catch`, app keeps working in memory.
- Duplicate watchlist add → `prev.some(...)` early-return.
- Slider failure → silent fallback to no slider, home page still works.
- Theme flash on first paint → `data-theme="light"` baked into `index.html`.
- Network-aborted strings from Firefox (`NS_BINDING_ABORTED`) → detected and treated as aborts in `HeroSlide`.
- Deep-linking to an unknown route → `<Navigate to="/" replace />`.

---

## 24. Q&A — Every Question You Might Be Asked

### About the project

**Q: In one sentence, what is this app?**
A React + Vite SPA that lets users discover, search and inspect movies from TMDB and curate a Watchlist persisted in `localStorage`, with no backend.

**Q: Why React?**
Because the UI is highly interactive (live search, sorting, theme toggle, watchlist) and React's component model + hooks make state and effects easy to reason about.

**Q: Why Vite over Create React App?**
CRA is deprecated and slow. Vite uses native ESM in dev (instant cold start, instant HMR) and a Rollup-based production build that produces smaller bundles.

**Q: Why no Redux?**
We only have two pieces of global state — theme and watchlist — and neither is contested or asynchronous. React Context with `useCallback` is enough and adds zero external dependencies.

**Q: Why no TypeScript?**
Scope decision. We compensate with `prop-types` on the reusable components so prop misuse still surfaces at runtime in dev.

---

### About the API

**Q: Why did you migrate from OMDb to TMDB?**
TMDB gives us **backdrops** for the cinematic hero, **videos** (trailers), **credits** (cast + crew), **trending feeds**, a **popular** feed, and **pagination metadata** — none of which OMDb offers cleanly. TMDB's free tier is also more generous and doesn't require a paid key for basic queries.

**Q: How is the API key kept out of the bundle?**
It's not, and that's intentional. The TMDB key is a public client key (free, per-account). Vite exposes anything prefixed with `VITE_` to the client — that's expected for public APIs. We just keep the actual value out of git via `.gitignore` + `.env.example`.

**Q: How do you handle rate limits?**
We debounce the search (400 ms) and require ≥ 2 characters before firing a request, which cuts the request volume by an order of magnitude. If TMDB does return an error body, we surface its `status_message` to the user.

**Q: Why `append_to_response=credits,videos`?**
It collapses 3 sequential requests (`/movie/:id`, `/movie/:id/credits`, `/movie/:id/videos`) into one. The detail page renders sooner and we use one TMDB quota slot instead of three.

**Q: Why do you have paginated *and* non-paginated helpers (`getPopular` vs `getPopularPaged`)?**
The home page only ever wants the first page (it isn't a catalog), so it uses the simple array-returning helper. The catalog page needs `total_pages` to render a correct "Load More" button, so it uses the paginated variant.

---

### About state management

**Q: Why is the Watchlist key `cinephile_watchlist_v2`?**
Because the persisted shape changed when we moved from OMDb (`imdbID/Title/Year/Poster`) to TMDB (`id/title/release_date/poster_path`). Bumping the key gracefully retires old data instead of crashing when an old card is read with the wrong fields.

**Q: How is the theme persisted?**
The `ThemeContext` reads `localStorage.cinephile_theme` synchronously in its `useState` initializer (so the first paint is correct), and writes the new value back inside a `useEffect`. The same effect also sets `data-theme` on `<html>`, which flips all the CSS variables in one paint.

**Q: What happens if `localStorage` is unavailable (private browsing)?**
Reads and writes are wrapped in `try/catch`. The app falls back to in-memory state so it keeps working — you just lose persistence for that session.

**Q: Why are the watchlist context callbacks wrapped in `useCallback`?**
So that consumers (like `WatchlistButton`) don't see a new function reference on every render. That matters for `React.memo`, `useEffect` deps, and to avoid surprising re-renders.

---

### About data fetching

**Q: Walk me through what happens when I type "inception" into the search bar.**
1. Each keystroke updates `query` in `HomePage`.
2. `useDebounce` waits 400 ms after the last keystroke and only then updates `debouncedQuery`.
3. A `useEffect` reacts to `debouncedQuery`, opens a new `AbortController`, and calls `searchMovies(query, signal)`.
4. On success, `setMovies(results)` triggers a re-render.
5. `useMemo` sorts the array.
6. `MovieGrid` re-renders the cards. If a new keystroke arrives while the request is in flight, the cleanup function aborts the request and a fresh one starts.

**Q: How do you prevent a stale fetch from overwriting fresh results?**
Two layers: (1) `AbortController` cancels in-flight requests when the effect re-runs, and (2) on the catalog page we also keep a `useRef` request-id counter and discard responses whose `myId !== requestIdRef.current`.

**Q: Why a minimum query length of 2?**
TMDB's response for 1-char queries is noisy and burns the daily quota. Two characters is a good balance between responsiveness and signal.

---

### About routing

**Q: Why `/movie/:id` instead of `/movies/:id`?**
Convention from the README. The singular reads like "open this one movie". Both are valid; we just stayed consistent.

**Q: Why does the catch-all use `<Navigate replace>`?**
`replace` swaps the bad URL out of the history stack so the back button doesn't take the user back to a 404. Without `replace`, going Back from Home would land you on `/foobar` again.

**Q: Why is `<BrowserRouter>` in `main.jsx` instead of `App.jsx`?**
So both providers (`ThemeProvider`, `WatchlistProvider`) can read routing state if they ever need to, and so that `App.jsx` stays focused on layout (Header + Routes + Footer).

---

### About UI / UX

**Q: Why the scroll-shrink header effect?**
It gives the home page more visual breathing room when the user starts reading, while the search/nav stays accessible. It's a tiny detail that makes the app feel "designed".

**Q: Why use Swiper instead of a hand-built carousel?**
Touch gestures, keyboard navigation, accessibility (focusable slides), autoplay-on-hover-pause and pagination dots are non-trivial to implement well. Swiper is battle-tested and tree-shakes cleanly with Vite.

**Q: Why a skeleton instead of a spinner?**
Skeletons set the user's expectation of the final layout. The grid doesn't pop into a different shape when the data arrives; the cards just "materialize" in place. Empirically this feels faster even when total load time is the same.

**Q: How do you avoid layout shift in the cards?**
Posters use a fixed `aspect-ratio: 2/3` container. The `<img>` is laid over that container, so even before it loads, the grid is already at its final dimensions.

---

### About styling

**Q: Why CSS variables for theming instead of SCSS variables?**
Because SCSS is preprocessed at build time. We need to **swap colors at runtime** when the theme toggles. CSS custom properties live in the cascade, so setting `data-theme="dark"` on `<html>` instantly re-resolves every `var(--...)` reference.

**Q: Why both SCSS and CSS variables?**
SCSS variables (`$mobile-width`, `$header-height`, etc.) are for static design tokens used inside media queries and computed values (where CSS vars can't be used in `@media (...)`). CSS variables are for runtime-switchable values. They're complementary.

**Q: Why give every component its own `.scss` file?**
- Locality: the styles live next to the markup they style.
- Deletability: deleting a component deletes its styles automatically.
- Scope clarity: each partial uses class names rooted in the component's BEM-style prefix (`movie-card__poster`, `header__nav`, etc.), which keeps selector specificity low.

**Q: Why the BEM-ish naming (`movie-card__poster-wrap`, `header__badge`)?**
Two reasons: (1) clear intent — you can read a class and know "this is the poster wrapper inside a movie card", and (2) collision-proof — no two components share the same root, so we never accidentally style each other's elements.

---

### About error handling

**Q: How do you handle a failed fetch?**
- We catch the error in the `try/catch`.
- If it's an `AbortError`, we ignore it (the request was cancelled on purpose).
- Otherwise we `setError(err.message)`, which makes `MovieGrid` render its alert state with `role="alert"`.
- For the detail page, we render a friendly screen with a "← Back to Discover" link.

**Q: What's an Error Boundary and why use one?**
A React error boundary is a class component that catches errors thrown by descendants during render or lifecycle methods. Without one, a single render error crashes the whole React tree (white screen of death). We wrap Header, Routes, Footer, and the HeroSlide in boundaries so a single failure stays contained.

**Q: Why is the Header/Footer boundary `silent`?**
If the Header or Footer crashes, rendering an error banner there would also probably crash. Silent rendering lets the rest of the app keep working while we see the error in DevTools.

**Q: What happens if TMDB returns 401 / 403?**
The body is parsed (`status_message`) and surfaced verbatim in the alert. The watchlist and theme still work because they're client-only. The detail page shows the "Could not load this movie" screen with a back link.

---

### About accessibility

**Q: Walk me through your accessibility considerations.**
- Real semantic elements: `<header>`, `<nav>`, `<main>`, `<button>`, `<a>` everywhere — no `div onClick`.
- ARIA labels on every icon-only button.
- `aria-pressed` on the sort pills (toggle state).
- `aria-busy` on loading containers, `aria-hidden` on shimmer placeholders.
- `role="alert"` on error screens, `role="dialog" + aria-modal="true"` on modals.
- `aria-labelledby` on the detail-page sections (Plot, Cast, Trailer, Details) so the headings act as section labels.
- Decorative images use `alt=""` + `aria-hidden`, meaningful images use a descriptive `alt`.
- Focus is preserved on the search input on mount and after clearing.

**Q: How do you test keyboard navigation?**
Tab through the page: Tab order should be Header logo → nav links → theme toggle → main content (search, cards, etc.) → footer. Enter activates buttons and follows links. Escape closes the modal.

---

### About performance

**Q: Why `useMemo` around the sort?**
Sorting is `O(n log n)`. Without memoization it would re-run on every parent re-render (e.g. when the theme changes or a watchlist add triggers a context update). `useMemo([movies, sortBy])` makes it run only when something it actually depends on changes.

**Q: Why `useCallback` in `WatchlistContext`?**
Otherwise every render of the provider creates new function identities. Components that depend on `addToWatchlist` etc. would see "different" props and re-render unnecessarily.

**Q: Why lazy-load images?**
`loading="lazy"` on `<img>` tells the browser to defer fetching off-screen images until the user is about to scroll to them. On a results page with 20+ posters, this is a huge bandwidth win.

**Q: Why preconnect to Google Fonts?**
`<link rel="preconnect">` opens the TLS connection to the font CDN early in the page load, so when the CSS asks for the font file the connection is already warm. It typically shaves ~100–200ms off first text paint.

**Q: How do you keep bundle size down?**
- No CSS framework (Tailwind/Bootstrap would add a static cost we don't need).
- Swiper is tree-shakable: we only import the modules we use (`Autoplay, Navigation, Pagination`).
- No global state library.
- Vite produces hashed, gzipped chunks per route — pages that aren't visited cost zero bytes.

---

### About deployment

**Q: How would you deploy this to Vercel?**
Push to GitHub → import the repo on Vercel → set `VITE_TMDB_API_KEY` in Environment Variables → click Deploy. `vercel.json` already rewrites unknown URLs to `index.html` so React Router takes over.

**Q: Why is `vercel.json` / `_redirects` necessary?**
Without them, hosts return 404 for any URL that isn't a real file. React Router lives in `index.html`; the rewrite tells the host "send any non-asset URL to index.html and let the SPA route it".

**Q: Why is `dist/` checked in?**
It usually shouldn't be (it's build output). It's currently checked in for offline-preview convenience. In a real production repo we'd add `dist/` to `.gitignore` and rely on CI to produce it on each deploy.

---

### Tricky / opinion questions

**Q: What would you change if you had another week?**
- Add **Vitest + React Testing Library** unit tests for hooks (`useDebounce`, `useLocalStorage`) and components.
- Add an **IntersectionObserver-based "infinite scroll"** instead of a Load More button on `/movies`.
- Add **genre filters** on the catalog (`/discover/movie` endpoint).
- Move to **TanStack Query** so caching / dedupe / retries are automatic.
- Add a **service worker** so the Watchlist page works offline.

**Q: What's the biggest weakness of the current design?**
The `MovieGrid` component is a state machine encoded as if/else branches. As we add more variants (no-network, rate-limited, login-required…), it'll get unwieldy. Refactoring it to a tagged-union `status: 'loading' | 'error' | 'empty' | 'ready'` would scale better.

**Q: What's the trickiest bug you fixed?**
The race condition on the catalog page: a slow request for `"bat"` could resolve **after** a fast request for `"batman"`, overwriting the correct results. We fixed it by combining `AbortController` (best-effort cancellation) with a `requestIdRef` counter (deterministic discard of stale resolves).

**Q: Why is `Navbar.jsx` still in the codebase if `Header.jsx` is the one used?**
It's a leftover from an earlier iteration kept as an alternative styling option. In a real PR review I'd either delete it or move it under a `legacy/` folder so it's not confusing.

**Q: Why do you store both TMDB id and `media_type` in the watchlist?**
TMDB ids aren't globally unique — a movie id `27205` and a TV id `27205` are different entities. Storing `media_type: 'movie'` future-proofs the watchlist for when we add TV support without having to migrate the storage shape again.

**Q: Is `import.meta.env` safe?**
It's safe in the sense that anything prefixed with `VITE_` is **deliberately** exposed to the client. It's **not** safe for server secrets. Treat `.env` like config, not like a vault — and never put server-side API tokens there in a real backend-connected project.

**Q: Why class component for the ErrorBoundary?**
Because **React still doesn't expose error-boundary hooks**. `getDerivedStateFromError` and `componentDidCatch` only exist on class components, so a class is the canonical (and currently only) way to implement a boundary.

---

### Lightning round — quick fire questions

- **What's the entry point?** `src/main.jsx` (mounted by `index.html`).
- **What's the root component?** `App.jsx`.
- **Where are routes defined?** `src/routes/Routes.jsx`.
- **Where are environment vars read?** `src/api/tmdb.js` (`import.meta.env.VITE_TMDB_API_KEY`).
- **What's the debounce delay?** 400 ms.
- **What's the minimum query length?** 2.
- **How many skeletons are shown while loading?** 10.
- **How many slides in the hero?** Up to 5 (`getTrending('week').slice(0, 5)`).
- **Where does the watchlist live?** `localStorage` under key `cinephile_watchlist_v2`.
- **Where does the theme live?** `localStorage` under key `cinephile_theme`, plus `data-theme` on `<html>`.
- **What library powers the slider?** Swiper.
- **What library handles prop validation?** `prop-types`.
- **What's the SPA fallback?** `vercel.json` (Vercel) + `public/_redirects` (Netlify).
- **What font?** Montserrat (300–700) from Google Fonts, with preconnect.
- **What's the accent color?** `#e50914` (the "Netflix red", defined in `_variables.scss`).

---

## Appendix — Common files at a glance

```jsx
// src/main.jsx — entry point: BrowserRouter → ThemeProvider → WatchlistProvider → App
```

```jsx
// src/App.jsx — Header + AppRoutes + Footer, each wrapped in an ErrorBoundary
```

```jsx
// src/routes/Routes.jsx
<Routes>
  <Route path="/"          element={<HomePage />} />
  <Route path="/movies"    element={<CatalogPage />} />
  <Route path="/movie/:id" element={<MovieDetailPage />} />
  <Route path="/watchlist" element={<WatchlistPage />} />
  <Route path="*"          element={<Navigate to="/" replace />} />
</Routes>
```

```js
// src/api/tmdb.js — single fetch wrapper + endpoints (search, details, trending, popular, paged variants)
```

```js
// src/hooks/useDebounce.js — generic debounce
// src/hooks/useLocalStorage.js — localStorage-backed useState
```

```jsx
// src/context/ThemeContext.jsx       — light/dark, persists to localStorage
// src/context/WatchlistContext.jsx   — add/remove/isInWatchlist, persists to localStorage (v2)
```

```scss
// src/index.scss — CSS variables for both themes + global resets + layout utilities
// src/scss/_variables.scss — design tokens
// src/scss/_mixin.scss     — mobile/tablet/flex/overlay mixins
// src/scss/_breakpoint.scss — named breakpoints
// src/scss/_index.scss     — @forward of the above
```

---

*This document is the single source of truth for understanding the project. If you read it top to bottom you should be able to walk through the codebase, answer any reviewer question, and explain every decision with the trade-offs that motivated it.*
