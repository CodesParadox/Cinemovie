# Cinephile — Movie Database

A production-style React SPA for discovering movies, viewing full details, and building a personal watchlist.

Built with **Vite + React + React Router v6**, powered by the **OMDb API**.

---

## Features

- Live search with 400 ms debounce
- Responsive movie grid with skeleton/shimmer loading
- Movie detail page with cinematic hero backdrop, full plot, and cast
- Add to Watchlist — persisted in `localStorage` across refreshes
- Sort results by Title A–Z, Year, or Rating
- Dark / Light mode toggle (also persisted)
- Proper loading, error, and no-results states
- Accessible markup (`aria-label`, semantic HTML, keyboard-navigable)
- Zero backend — pure static SPA deployable to Vercel or Netlify

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd Cinemovie
npm install
```

### 2. Set up your OMDb API key

Copy `.env.example` to `.env` and add your free key from [omdbapi.com](https://www.omdbapi.com/apikey.aspx):

```bash
cp .env.example .env
```

`.env`:

```
VITE_OMDB_API_KEY=your_key_here
```

> The free OMDb tier allows **1,000 requests per day**. The app uses debounce and a minimum query length of 2 characters to avoid wasting requests.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 4. Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── api/
│   └── omdb.js               # OMDb API fetch functions
├── context/
│   ├── ThemeContext.jsx       # Dark/light mode
│   └── WatchlistContext.jsx   # Watchlist state
├── hooks/
│   ├── useDebounce.js
│   └── useLocalStorage.js
├── components/
│   ├── Navbar.jsx
│   ├── SearchBar.jsx
│   ├── SortControls.jsx
│   ├── MovieGrid.jsx
│   ├── MovieCard.jsx
│   ├── MovieCardSkeleton.jsx
│   ├── WatchlistButton.jsx
│   └── HeroBackdrop.jsx
└── pages/
    ├── HomePage.jsx
    ├── MovieDetailPage.jsx
    └── WatchlistPage.jsx
```

---

## Deployment

### Vercel (recommended)

1. Push to GitHub.
2. Import the repo on [vercel.com](https://vercel.com).
3. Set `VITE_OMDB_API_KEY` in the project's **Environment Variables** settings.
4. Deploy — `vercel.json` handles SPA routing automatically.

### Netlify

1. Push to GitHub and import on Netlify.
2. Build command: `npm run build` | Publish directory: `dist`
3. Add `VITE_OMDB_API_KEY` in **Site settings → Environment variables**.
4. `public/_redirects` handles SPA routing.

---

## Environment Variables


| Variable            | Required | Description                                     |
| ------------------- | -------- | ----------------------------------------------- |
| `VITE_OMDB_API_KEY` | Yes      | Your OMDb API key (never commit the real value) |


---

## Tech Stack


| Technology      | Purpose                       |
| --------------- | ----------------------------- |
| Vite            | Build tool / dev server       |
| React 18        | UI library                    |
| React Router v6 | Client-side routing           |
| OMDb API        | Movie data source             |
| localStorage    | Watchlist + theme persistence |
| Plain CSS       | Styling (no CSS framework)    |


