
import React from 'react';
import { Heart, Film, Tv } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';

const FavoritesPage: React.FC = () => {
  // Pour cette démo, nous affichons simplement un message indiquant qu'il n'y a pas de favoris
  const hasFavorites = false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold">Mes Favoris</h1>
        </div>
        
        {!hasFavorites ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 text-center">
            <Heart className="mx-auto h-16 w-16 text-gray-600 mb-4" />
            <h2 className="text-xl font-bold mb-3">Vous n'avez pas encore de favoris</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Explorez notre catalogue et ajoutez des films et séries à vos favoris pour les retrouver facilement.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/movies" 
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
              >
                <Film className="h-5 w-5" />
                <span>Explorer les films</span>
              </Link>
              <Link 
                to="/tv" 
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
              >
                <Tv className="h-5 w-5" />
                <span>Découvrir les séries</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* Ici, nous afficherions les médias favoris si l'utilisateur en avait */}
            <p>Liste des favoris...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
