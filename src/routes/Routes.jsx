import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CatalogPage from '../pages/CatalogPage';
import MovieDetailPage from '../pages/MovieDetailPage';
import WatchlistPage from '../pages/WatchlistPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"              element={<HomePage />} />
      <Route path="/movies"        element={<CatalogPage />} />
      <Route path="/movie/:id"     element={<MovieDetailPage />} />
      <Route path="/watchlist"     element={<WatchlistPage />} />
      <Route path="*"              element={<Navigate to="/" replace />} />
    </Routes>
  );
}
