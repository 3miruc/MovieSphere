
import React from 'react';
import Navbar from '../common/Navbar';

const FavoritesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mes Favoris</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Vous n'avez pas encore de favoris. Explorez nos films et séries pour en ajouter !
          </p>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
