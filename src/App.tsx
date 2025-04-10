
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Film, Tv, ChevronRight } from 'lucide-react';
import Navbar from './components/common/Navbar';
import HomePage from './components/pages/HomePage';
import FavoritesPage from './components/pages/FavoritesPage';
import MoviesPage from './components/pages/MoviesPage';
import TvShowsPage from './components/pages/TvShowsPage';
import SearchPage from './components/pages/SearchPage';

// Créer un client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv" element={<TvShowsPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
