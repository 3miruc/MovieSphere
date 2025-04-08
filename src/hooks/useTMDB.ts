
/**
 * Hook personnalisé pour interagir avec l'API TMDB
 * Ce hook utilise react-query pour la gestion des requêtes et du cache
 */

import { useQuery } from '@tanstack/react-query';
import {
  getMovieDetails,
  getTVShowDetails,
  searchMoviesAndTVShows,
  getPopularMovies,
  getPopularTVShows,
  getMoviesByGenre,
  getTVShowsByGenre
} from '../services/tmdb/api';

/**
 * Hook pour récupérer les détails d'un film
 * @param movieId - Identifiant du film
 * @returns Objet contenant les données, l'état de chargement et les erreurs
 */
export function useMovieDetails(movieId: number) {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: !!movieId, // Désactive la requête si movieId est falsy
  });
}

/**
 * Hook pour récupérer les détails d'une série
 * @param tvShowId - Identifiant de la série
 * @returns Objet contenant les données, l'état de chargement et les erreurs
 */
export function useTVShowDetails(tvShowId: number) {
  return useQuery({
    queryKey: ['tvShow', tvShowId],
    queryFn: () => getTVShowDetails(tvShowId),
    enabled: !!tvShowId, // Désactive la requête si tvShowId est falsy
  });
}

/**
 * Hook pour effectuer une recherche de films et séries
 * @param query - Terme de recherche
 * @returns Objet contenant les résultats, l'état de chargement et les erreurs
 */
export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchMoviesAndTVShows(query),
    enabled: query.length > 2, // Active la recherche uniquement si la requête a plus de 2 caractères
  });
}

/**
 * Hook pour récupérer les films populaires
 * @param page - Numéro de page
 * @returns Objet contenant les résultats, l'état de chargement et les erreurs
 */
export function usePopularMovies(page: number = 1) {
  return useQuery({
    queryKey: ['popularMovies', page],
    queryFn: () => getPopularMovies(page),
  });
}

/**
 * Hook pour récupérer les séries populaires
 * @param page - Numéro de page
 * @returns Objet contenant les résultats, l'état de chargement et les erreurs
 */
export function usePopularTVShows(page: number = 1) {
  return useQuery({
    queryKey: ['popularTVShows', page],
    queryFn: () => getPopularTVShows(page),
  });
}

/**
 * Hook pour récupérer les films par genre
 * @param genreId - Identifiant du genre
 * @param page - Numéro de page
 * @returns Objet contenant les résultats, l'état de chargement et les erreurs
 */
export function useMoviesByGenre(genreId: number, page: number = 1) {
  return useQuery({
    queryKey: ['moviesByGenre', genreId, page],
    queryFn: () => getMoviesByGenre(genreId, page),
    enabled: !!genreId, // Désactive la requête si genreId est falsy
  });
}

/**
 * Hook pour récupérer les séries par genre
 * @param genreId - Identifiant du genre
 * @param page - Numéro de page
 * @returns Objet contenant les résultats, l'état de chargement et les erreurs
 */
export function useTVShowsByGenre(genreId: number, page: number = 1) {
  return useQuery({
    queryKey: ['tvShowsByGenre', genreId, page],
    queryFn: () => getTVShowsByGenre(genreId, page),
    enabled: !!genreId, // Désactive la requête si genreId est falsy
  });
}
