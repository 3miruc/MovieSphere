
/**
 * Composant principal de l'application
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import TVShowDetailPage from './pages/TVShowDetailPage';

// Création du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Composant App principal
 */
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/tv/:id" element={<TVShowDetailPage />} />
            {/* D'autres routes pourront être ajoutées ici */}
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
