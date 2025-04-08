
/**
 * Barre de navigation principale de l'application
 */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Film, Tv, Heart, Home } from 'lucide-react';

/**
 * Composant de navigation principal
 */
const Navbar: React.FC = () => {
  // État pour gérer l'ouverture/fermeture du menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Récupération de l'emplacement actuel pour le surlignage des liens
  const location = useLocation();
  
  // Ferme le menu mobile lors du changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Liens de navigation avec leurs icônes et chemins
  const navLinks = [
    { name: 'Accueil', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Films', path: '/movies', icon: <Film className="h-5 w-5" /> },
    { name: 'Séries', path: '/tv', icon: <Tv className="h-5 w-5" /> },
    { name: 'Favoris', path: '/favorites', icon: <Heart className="h-5 w-5" /> },
    { name: 'Recherche', path: '/search', icon: <Search className="h-5 w-5" /> }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">MovieSphere</span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  location.pathname === link.path 
                    ? 'text-purple-600 dark:text-purple-400 font-medium' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Bouton du menu mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-3 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  location.pathname === link.path 
                    ? 'text-purple-600 dark:text-purple-400 font-medium' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
