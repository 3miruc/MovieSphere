
/**
 * Composant de mise en page principale de l'application
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Interface pour les propriétés du composant
interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Composant Layout pour la structure globale de l'application
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Vérification si un lien est actif
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">MovieSphere</span>
            </Link>
            
            {/* Menu principal */}
            <div className="flex space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Accueil
              </Link>
              <Link 
                to="/movies" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/movies') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Films
              </Link>
              <Link 
                to="/tvshows" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/tvshows') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Séries
              </Link>
              <Link 
                to="/search" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/search') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Recherche
              </Link>
              <Link 
                to="/favorites" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/favorites') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Favoris
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main>
        {children}
      </main>

      {/* Pied de page */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>&copy; {new Date().getFullYear()} MovieSphere - Tous droits réservés</p>
            <p className="mt-2 text-sm">
              Données fournies par 
              <a 
                href="https://www.themoviedb.org" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 ml-1 hover:underline"
              >
                TMDb - The Movie Database
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
