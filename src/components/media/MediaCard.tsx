
/**
 * Composant de carte pour afficher les détails d'un média (film ou série)
 */

import React from 'react';
import { TMDB_IMAGE_BASE_URL, POSTER_SIZES } from '../../services/tmdb/config';

// Interface pour les propriétés du composant
interface MediaCardProps {
  id: number;
  title: string;           // Titre du film ou nom de la série
  overview: string;        // Description du média
  posterPath: string | null;
  voteAverage: number;
  releaseDate?: string;    // Date de sortie (films)
  firstAirDate?: string;   // Date de première diffusion (séries)
  mediaType: 'movie' | 'tv';
  onClick?: () => void;
}

/**
 * Composant MediaCard pour afficher une carte de film ou série
 */
const MediaCard: React.FC<MediaCardProps> = ({
  id,
  title,
  overview,
  posterPath,
  voteAverage,
  releaseDate,
  firstAirDate,
  mediaType,
  onClick
}) => {
  // Construction de l'URL de l'image d'affiche
  const posterUrl = posterPath 
    ? `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZES.MEDIUM}${posterPath}`
    : '/placeholder.svg'; // Image par défaut si pas d'affiche

  // Formatage de la date (sortie ou première diffusion)
  const formattedDate = releaseDate || firstAirDate 
    ? new Date(releaseDate || firstAirDate || '').toLocaleDateString('fr-FR')
    : 'Date inconnue';

  // Troncature de la description si elle est trop longue
  const truncatedOverview = overview && overview.length > 150 
    ? `${overview.substring(0, 150)}...` 
    : overview || 'Aucune description disponible';

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      {/* Image d'affiche */}
      <div className="relative w-full h-64">
        <img 
          src={posterUrl}
          alt={`Affiche de ${title}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Badge indiquant s'il s'agit d'un film ou d'une série */}
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-bold">
          {mediaType === 'movie' ? 'Film' : 'Série'}
        </div>
      </div>

      {/* Contenu textuel */}
      <div className="p-4">
        {/* Titre et note */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">{title}</h3>
          <div className="flex items-center bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
            <span>★</span>
            <span className="ml-1">{voteAverage.toFixed(1)}</span>
          </div>
        </div>

        {/* Date de sortie ou première diffusion */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{formattedDate}</p>
        
        {/* Description */}
        <p className="text-sm text-gray-700 dark:text-gray-400 line-clamp-3">{truncatedOverview}</p>
      </div>
    </div>
  );
};

export default MediaCard;
