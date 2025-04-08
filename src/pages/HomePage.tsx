
/**
 * Page d'accueil affichant les films et séries populaires
 */

import React, { useState } from 'react';
import { usePopularMovies, usePopularTVShows } from '../hooks/useTMDB';
import MediaGrid from '../components/media/MediaGrid';
import { useNavigate } from 'react-router-dom';

/**
 * Composant de la page d'accueil
 */
const HomePage: React.FC = () => {
  // État pour la pagination
  const [moviePage, setMoviePage] = useState(1);
  const [tvShowPage, setTvShowPage] = useState(1);
  
  // Utilisation des hooks de récupération de données
  const { 
    data: moviesData, 
    isLoading: isLoadingMovies, 
    error: moviesError 
  } = usePopularMovies(moviePage);
  
  const { 
    data: tvShowsData, 
    isLoading: isLoadingTVShows, 
    error: tvShowsError 
  } = usePopularTVShows(tvShowPage);
  
  const navigate = useNavigate();

  // Préparation des données pour les films
  const movies = moviesData?.results.map(movie => ({
    ...movie,
    media_type: 'movie' as const
  })) || [];

  // Préparation des données pour les séries
  const tvShows = tvShowsData?.results.map(tvShow => ({
    ...tvShow,
    media_type: 'tv' as const
  })) || [];

  // Gestion du clic sur un média
  const handleMediaClick = (item: any) => {
    navigate(`/${item.media_type}/${item.id}`);
  };

  // Gestion de la pagination des films
  const handleMoviePageChange = (newPage: number) => {
    if (newPage > 0 && (!moviesData || newPage <= moviesData.total_pages)) {
      setMoviePage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Gestion de la pagination des séries
  const handleTVShowPageChange = (newPage: number) => {
    if (newPage > 0 && (!tvShowsData || newPage <= tvShowsData.total_pages)) {
      setTvShowPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Titre de la page */}
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Découvrez les meilleurs films et séries
      </h1>

      {/* Section Films populaires */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          Films populaires
        </h2>
        
        <MediaGrid 
          items={movies}
          isLoading={isLoadingMovies}
          error={moviesError as Error | null}
          onItemClick={handleMediaClick}
        />
        
        {/* Pagination pour les films */}
        {!isLoadingMovies && moviesData && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => handleMoviePageChange(moviePage - 1)}
              disabled={moviePage <= 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
            >
              Précédent
            </button>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
              Page {moviePage} sur {moviesData.total_pages}
            </span>
            <button
              onClick={() => handleMoviePageChange(moviePage + 1)}
              disabled={moviePage >= moviesData.total_pages}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
            >
              Suivant
            </button>
          </div>
        )}
      </section>

      {/* Section Séries populaires */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          Séries populaires
        </h2>
        
        <MediaGrid 
          items={tvShows}
          isLoading={isLoadingTVShows}
          error={tvShowsError as Error | null}
          onItemClick={handleMediaClick}
        />
        
        {/* Pagination pour les séries */}
        {!isLoadingTVShows && tvShowsData && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => handleTVShowPageChange(tvShowPage - 1)}
              disabled={tvShowPage <= 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
            >
              Précédent
            </button>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
              Page {tvShowPage} sur {tvShowsData.total_pages}
            </span>
            <button
              onClick={() => handleTVShowPageChange(tvShowPage + 1)}
              disabled={tvShowPage >= tvShowsData.total_pages}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
            >
              Suivant
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
