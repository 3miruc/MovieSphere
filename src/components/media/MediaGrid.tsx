
/**
 * Composant de grille pour afficher une collection de médias (films ou séries)
 */

import React from 'react';
import MediaCard from './MediaCard';

// Interface pour les éléments média à afficher
interface MediaItem {
  id: number;
  title?: string;          // Pour les films
  name?: string;           // Pour les séries
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;   // Pour les films
  first_air_date?: string; // Pour les séries
  media_type: 'movie' | 'tv';
}

// Interface pour les propriétés du composant
interface MediaGridProps {
  items: MediaItem[];
  isLoading: boolean;
  error: Error | null;
  onItemClick?: (item: MediaItem) => void;
}

/**
 * Composant MediaGrid pour afficher une grille de films ou séries
 */
const MediaGrid: React.FC<MediaGridProps> = ({ 
  items, 
  isLoading, 
  error,
  onItemClick 
}) => {
  // Affichage du chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Erreur: </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );
  }

  // Affichage si aucun résultat
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-300">
        Aucun résultat trouvé.
      </div>
    );
  }

  // Affichage de la grille de médias
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <MediaCard
          key={`${item.media_type}-${item.id}`}
          id={item.id}
          title={item.title || item.name || 'Sans titre'}
          overview={item.overview}
          posterPath={item.poster_path}
          voteAverage={item.vote_average}
          releaseDate={item.release_date}
          firstAirDate={item.first_air_date}
          mediaType={item.media_type}
          onClick={() => onItemClick && onItemClick(item)}
        />
      ))}
    </div>
  );
};

export default MediaGrid;
