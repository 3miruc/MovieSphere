
/**
 * Page de détail pour un film spécifique
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieDetails } from '../hooks/useTMDB';
import MediaDetails from '../components/media/MediaDetails';

/**
 * Composant de la page de détail d'un film
 */
const MovieDetailPage: React.FC = () => {
  // Récupération de l'ID du film depuis l'URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Conversion de l'ID en nombre
  const movieId = id ? parseInt(id, 10) : 0;
  
  // Récupération des détails du film
  const { 
    data: movie, 
    isLoading, 
    error 
  } = useMovieDetails(movieId);

  // Gestion du retour à la page précédente
  const handleGoBack = () => {
    navigate(-1);
  };

  // Affichage du chargement
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  // Affichage des erreurs
  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">
            {error ? error.message : "Ce film n'a pas été trouvé."}
          </span>
        </div>
        <button
          onClick={handleGoBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Bouton de retour */}
      <button
        onClick={handleGoBack}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center"
      >
        <span>← Retour</span>
      </button>
      
      {/* Affichage des détails du film */}
      <MediaDetails
        mediaType="movie"
        id={movie.id}
        title={movie.title}
        overview={movie.overview}
        posterPath={movie.poster_path}
        backdropPath={movie.backdrop_path}
        releaseDate={movie.release_date}
        voteAverage={movie.vote_average}
        genres={movie.genres}
      />
    </div>
  );
};

export default MovieDetailPage;
