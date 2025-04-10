
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import FavoritesPage from './components/pages/FavoritesPage';
import MoviesPage from './components/pages/MoviesPage';

const HomePage = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">MovieSphere</h1>
      <p className="text-center text-lg mb-6">
        Bienvenue sur MovieSphere, votre application de films et séries préférée.
      </p>
      <div className="text-center">
        <Link 
          to="/movies" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Explorer les films
        </Link>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/movies" element={<MoviesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
