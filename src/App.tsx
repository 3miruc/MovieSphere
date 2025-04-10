
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Film, Tv, ChevronRight } from 'lucide-react';
import Navbar from './components/common/Navbar';
import FavoritesPage from './components/pages/FavoritesPage';
import MoviesPage from './components/pages/MoviesPage';
import TvShowsPage from './components/pages/TvShowsPage';

// Créer un client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const HomePage = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
    <Navbar />
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(https://source.unsplash.com/random/1920x1080/?movie,cinema)', 
            filter: 'brightness(0.4)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-90"></div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-2xl">
            Bienvenue sur <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">MovieSphere</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Découvrez les meilleurs films et séries du moment, créez vos listes de favoris, et restez informé des dernières sorties.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/movies"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors"
            >
              <Film className="h-5 w-5" />
              <span>Explorer les films</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/tv"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors"
            >
              <Tv className="h-5 w-5" />
              <span>Découvrir les séries</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv" element={<TvShowsPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
