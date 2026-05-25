import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import WatchlistPage from './pages/WatchlistPage';

function NotFoundPage() {
  return (
    <main className="page-content">
      <div className="container">
        <div className="state-screen">
          <span className="state-screen__icon">🎭</span>
          <p className="state-screen__title">Page not found</p>
          <p className="state-screen__subtitle">
            This scene doesn&apos;t exist in our database.
          </p>
          <Link to="/" className="state-screen__action">
            Back to Discover
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"                  element={<HomePage />} />
        <Route path="/movie/:imdbID"     element={<MovieDetailPage />} />
        <Route path="/watchlist"         element={<WatchlistPage />} />
        <Route path="*"                  element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
