
/**
 * Composant pour afficher les détails complets d'un média (film ou série)
 */

import React from 'react';
import { TMDB_IMAGE_BASE_URL, POSTER_SIZES, BACKDROP_SIZES } from '../../services/tmdb/config';

// Interface pour les propriétés du composant de film
interface MovieDetailsProps {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  genres: Array<{id: number, name: string}>;
}

// Interface pour les propriétés du composant de série
interface TVShowDetailsProps {
  id: number;
  name: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  firstAirDate: string;
  voteAverage: number;
  genres: Array<{id: number, name: string}>;
}

// Type union pour les propriétés combinées
type MediaDetailsProps = 
  | (MovieDetailsProps & { mediaType: 'movie' })
  | (TVShowDetailsProps & { mediaType: 'tv' });

/**
 * Composant MediaDetails pour afficher les détails complets d'un film ou d'une série
 */
const MediaDetails: React.FC<MediaDetailsProps> = (props) => {
  // Construction des URLs des images
  const posterUrl = props.posterPath 
    ? `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZES.LARGE}${props.posterPath}`
    : '/placeholder.svg';

  const backdropUrl = props.backdropPath 
    ? `${TMDB_IMAGE_BASE_URL}/${BACKDROP_SIZES.LARGE}${props.backdropPath}`
    : null;

  // Titre en fonction du type de média
  const title = props.mediaType === 'movie' ? props.title : props.name;
  
  // Date en fonction du type de média
  const date = props.mediaType === 'movie' 
    ? new Date(props.releaseDate).toLocaleDateString('fr-FR') 
    : new Date(props.firstAirDate).toLocaleDateString('fr-FR');

  // Si la description est vide, afficher un message par défaut
  const overview = props.overview || 'Aucune description disponible pour ce contenu.';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
      {/* Image d'arrière-plan en haut */}
      {backdropUrl && (
        <div className="relative w-full h-80">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
          <img 
            src={backdropUrl} 
            alt={`Arrière-plan de ${title}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 z-20 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
            <div className="flex items-center mt-2">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-bold flex items-center">
                <span>★</span>
                <span className="ml-1">{props.voteAverage.toFixed(1)}</span>
              </span>
              <span className="ml-3 text-sm">{date}</span>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="p-6">
        {/* Si pas d'image d'arrière-plan, afficher le titre ici */}
        {!backdropUrl && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <div className="flex items-center mt-2">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-bold flex items-center">
                <span>★</span>
                <span className="ml-1">{props.voteAverage.toFixed(1)}</span>
              </span>
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">{date}</span>
            </div>
          </div>
        )}

        {/* Layout principal */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Affiche du film/série */}
          <div className="md:w-1/3 lg:w-1/4">
            <img 
              src={posterUrl} 
              alt={`Affiche de ${title}`} 
              className="w-full rounded-lg shadow-md"
            />
          </div>

          {/* Informations détaillées */}
          <div className="md:w-2/3 lg:w-3/4">
            {/* Genres */}
            <div className="mb-4 flex flex-wrap gap-2">
              {props.genres.map(genre => (
                <span 
                  key={genre.id}
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Synopsis</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{overview}</p>
            </div>

            {/* Type de média */}
            <div className="mt-auto">
              <span className="inline-block bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 px-3 py-1 rounded-full text-sm">
                {props.mediaType === 'movie' ? 'Film' : 'Série TV'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetails;
