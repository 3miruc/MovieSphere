
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tv, Filter } from 'lucide-react';
import Navbar from '../common/Navbar';
import MediaCard from '../ui/MediaCard';
import { fetchPopular, fetchGenres, getGenreNames, type MediaBasic } from '../../services/tmdb';

const TvShowsPage: React.FC = () => {
  // Récupération des séries populaires avec React Query
  const { data: tvShowsData, isLoading, error } = useQuery({
    queryKey: ['popularTvShows'],
    queryFn: () => fetchPopular('tv'),
  });

  // Récupération des genres de séries pour les cartes
  const { data: genres } = useQuery({
    queryKey: ['tvGenres'],
    queryFn: () => fetchGenres('tv'),
  });

  // Obtenir les noms de genres pour chaque série
  const getGenres = (tvShow: MediaBasic) => {
    if (!genres) return [];
    return tvShow.genre_ids
      .map(id => genres.find(genre => genre.id === id)?.name)
      .filter(Boolean) as string[];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Tv className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold">Séries Populaires</h1>
          </div>
          
          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition-colors duration-300">
            <Filter size={18} />
            <span>Filtrer</span>
          </button>
        </div>
        
        {error ? (
          <div className="bg-red-900/30 border border-red-600 text-white rounded-lg p-6 mt-4">
            <p className="text-center">
              Une erreur est survenue lors du chargement des séries.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {isLoading ? (
              // Squelettes de chargement
              Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              // Affichage des séries
              tvShowsData?.results.map((tvShow) => (
                <MediaCard 
                  key={tvShow.id} 
                  media={tvShow} 
                  genreNames={getGenres(tvShow)}
                  onToggleFavorite={() => {}} 
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TvShowsPage;
