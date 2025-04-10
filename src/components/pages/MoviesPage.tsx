
import React from 'react';
import Navbar from '../common/Navbar';

const MoviesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Films</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Chargement des films...
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
