
/**
 * Page de détail pour une série spécifique
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTVShowDetails } from '../hooks/useTMDB';
import MediaDetails from '../components/media/MediaDetails';

/**
 * Composant de la page de détail d'une série
 */
const TVShowDetailPage: React.FC = () => {
  // Récupération de l'ID de la série depuis l'URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Conversion de l'ID en nombre
  const tvShowId = id ? parseInt(id, 10) : 0;
  
  // Récupération des détails de la série
  const { 
    data: tvShow, 
    isLoading, 
    error 
  } = useTVShowDetails(tvShowId);

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
  if (error || !tvShow) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">
            {error ? error.message : "Cette série n'a pas été trouvée."}
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
      
      {/* Affichage des détails de la série */}
      <MediaDetails
        mediaType="tv"
        id={tvShow.id}
        name={tvShow.name}
        overview={tvShow.overview}
        posterPath={tvShow.poster_path}
        backdropPath={tvShow.backdrop_path}
        firstAirDate={tvShow.first_air_date}
        voteAverage={tvShow.vote_average}
        genres={tvShow.genres}
      />
    </div>
  );
};

export default TVShowDetailPage;
