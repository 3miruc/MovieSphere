/**
 * API service pour interagir avec The Movie Database (TMDB)
 * Ce fichier contient toutes les fonctions pour récupérer les données depuis l'API TMDB
 */

import { 
  TMDB_API_BASE_URL, 
  TMDB_API_KEY,
  TMDB_API_TOKEN,
  DEFAULT_FETCH_OPTIONS, 
  DEFAULT_LANGUAGE 
} from './config';

/**
 * Interface pour les détails d'un film
 */
interface MovieDetails {
  id: number;              // Identifiant unique du film
  title: string;           // Titre du film
  overview: string;        // Description/synopsis du film
  poster_path: string;     // Chemin vers l'affiche du film
  backdrop_path: string;   // Chemin vers l'image d'arrière-plan
  release_date: string;    // Date de sortie
  vote_average: number;    // Note moyenne
  genres: Array<{id: number, name: string}>; // Genres du film
}

/**
 * Interface pour les détails d'une série
 */
interface TVShowDetails {
  id: number;              // Identifiant unique de la série
  name: string;            // Nom de la série
  overview: string;        // Description/synopsis de la série
  poster_path: string;     // Chemin vers l'affiche de la série
  backdrop_path: string;   // Chemin vers l'image d'arrière-plan
  first_air_date: string;  // Date de première diffusion
  vote_average: number;    // Note moyenne
  genres: Array<{id: number, name: string}>; // Genres de la série
}

/**
 * Interface pour les résultats de recherche génériques
 */
interface SearchResult {
  id: number;
  title?: string;          // Pour les films
  name?: string;           // Pour les séries
  media_type: 'movie' | 'tv' | 'person';
  overview: string;
  poster_path: string | null;
  vote_average: number;
}

/**
 * Récupère les détails d'un film spécifique
 * @param movieId - Identifiant du film
 * @param language - Langue pour les résultats (par défaut: français)
 * @returns Promesse contenant les détails du film
 */
export async function getMovieDetails(
  movieId: number, 
  language: string = DEFAULT_LANGUAGE
): Promise<MovieDetails> {
  // Construction de l'URL avec l'ID du film et les paramètres
  const url = new URL(`${TMDB_API_BASE_URL}/movie/${movieId}`);
  url.searchParams.append('language', language);

  // Exécution de la requête
  const response = await fetch(url.toString(), DEFAULT_FETCH_OPTIONS);
  
  // Vérification de la réponse
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des détails du film: ${response.status}`);
  }
  
  // Conversion de la réponse en JSON
  return await response.json();
}

/**
 * Récupère les détails d'une série spécifique
 * @param tvShowId - Identifiant de la série
 * @param language - Langue pour les résultats (par défaut: français)
 * @returns Promesse contenant les détails de la série
 */
export async function getTVShowDetails(
  tvShowId: number, 
  language: string = DEFAULT_LANGUAGE
): Promise<TVShowDetails> {
  // Construction de l'URL avec l'ID de la série et les paramètres
  const url = new URL(`${TMDB_API_BASE_URL}/tv/${tvShowId}`);
  url.searchParams.append('language', language);

  // Exécution de la requête
  const response = await fetch(url.toString(), DEFAULT_FETCH_OPTIONS);
  
  // Vérification de la réponse
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des détails de la série: ${response.status}`);
  }
  
  // Conversion de la réponse en JSON
  return await response.json();
}

/**
 * Recherche des films et séries par mot-clé
 * @param query - Terme de recherche
 * @param language - Langue pour les résultats (par défaut: français)
 * @returns Promesse contenant les résultats de recherche
 */
export async function searchMoviesAndTVShows(
  query: string, 
  language: string = DEFAULT_LANGUAGE
): Promise<{results: SearchResult[]}> {
  // Construction de l'URL avec le terme de recherche et les paramètres
  const url = new URL(`${TMDB_API_BASE_URL}/search/multi`);
  url.searchParams.append('language', language);
  url.searchParams.append('query', query);
  url.searchParams.append('include_adult', 'false');
  
  // Exécution de la requête
  const response = await fetch(url.toString(), DEFAULT_FETCH_OPTIONS);
  
  // Vérification de la réponse
  if (!response.ok) {
    throw new Error(`Erreur lors de la recherche: ${response.status}`);
  }
  
  // Conversion de la réponse en JSON
  return await response.json();
}

/**
 * Récupère les films populaires
 * @param page - Numéro de page pour la pagination
 * @param language - Langue pour les résultats (par défaut: français)
 * @returns Promesse contenant les films populaires
 */
export async function getPopularMovies(
  page: number = 1, 
  language: string = DEFAULT_LANGUAGE
): Promise<{results: SearchResult[], total_pages: number}> {
  // Construction de l'URL avec les paramètres
  const url = new URL(`${TMDB_API_BASE_URL}/movie/popular`);
  url.searchParams.append('language', language);
  url.searchParams.append('page', page.toString());
  
  // Exécution de la requête
  const response = await fetch(url.toString(), DEFAULT_FETCH_OPTIONS);
  
  // Vérification de la réponse
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des films populaires: ${response.status}`);
  }
  
  // Conversion de la réponse en JSON
  return await response.json();
}

/**
 * Récupère les séries populaires
 * @param page - Numéro de page pour la pagination
 * @param language - Langue pour les résultats (par défaut: français)
 * @returns Promesse contenant les séries populaires
 */
export async function getPopularTVShows(
  page: number = 1, 
  language: string = DEFAULT_LANGUAGE
): Promise<{results: SearchResult[], total_pages: number}> {
  // Construction de l'URL avec les paramètres
  const url = new URL(`${TMDB_API_BASE_URL}/tv/popular`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  url.searchParams.append('language', language);
  url.searchParams.append('page', page.toString());
  
  // Exécution de la requête
  const response = await fetch(url.toString(), DEFAULT_FETCH_OPTIONS);
  
  // Vérification de la réponse
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des séries populaires: ${response.status}`);
  }
  
  // Conversion de la réponse en JSON
  return await response.json();
}

/**
 * Récupère les films par genre
 * @param genreId - Identifiant du genre
 * @param page - Numéro de page pour la pagination
 * @param language - Langue pour les résultats (par défaut: français)
 * @returns Promesse contenant les films du genre spécifié
 */
export async function getMoviesByGenre(
  genreId: number,
  page: number = 1,
  language: string = DEFAULT_LANGUAGE
): Promise<{results: SearchResult[], total_pages: number}> {
  // Construction de l'URL avec les paramètres
  const url = new URL(`${TMDB_API_BASE_URL}/discover/movie`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  url.searchParams.append('language', language);
  url.searchParams.append('with_genres', genreId.toString());
  url.searchParams.append('page', page.toString());
  
  // Exécution de la requête
  const response = await fetch(url.toString(), DEFAULT_FETCH_OPTIONS);
  
  // Vérification de la réponse
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des films par genre: ${response.status}`);
  }
  
  // Conversion de la réponse en JSON
  return await response.json();
}

/**
 * Récupère les séries par genre
 * @param genreId - Identifiant du genre
 * @param page - Numéro de page pour la pagination
 * @param language - Langue pour les résultats (par défaut: français)
 * @returns Promesse contenant les séries du genre spécifié
 */
export async function getTVShowsByGenre(
  genreId: number,
  page: number = 1,
  language: string = DEFAULT_LANGUAGE
): Promise<{results: SearchResult[], total_pages: number}> {
  // Construction de l'URL avec les paramètres
  const url = new URL(`${TMDB_API_BASE_URL}/discover/tv`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  url.searchParams.append('language', language);
  url.searchParams.append('with_genres', genreId.toString());
  url.searchParams.append('page', page.toString());
  
  // Exécution de la requête
  const response = await fetch(url.toString(), DEFAULT_FETCH_OPTIONS);
  
  // Vérification de la réponse
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des séries par genre: ${response.status}`);
  }
  
  // Conversion de la réponse en JSON
  return await response.json();
}
