/**
 * Configuration de l'API TMDB
 * Ce fichier contient toutes les constantes et configurations nécessaires
 * pour interagir avec l'API TMDB (The Movie Database)
 */

/**
 * URL de base pour l'API TMDB
 */
export const TMDB_API_BASE_URL = import.meta.env.VITE_TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';

/**
 * Clé API pour accéder à TMDB
 */
export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';

/**
 * Token d'accès pour l'API TMDB (alternative à la clé API)
 */
export const TMDB_API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN || '';

/**
 * URL de base pour les images TMDB
 */
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/**
 * Options de taille d'images disponibles pour les posters
 */
export const POSTER_SIZES = {
  SMALL: 'w185',
  MEDIUM: 'w342',
  LARGE: 'w500',
  ORIGINAL: 'original'
};

/**
 * Options de taille d'images disponibles pour les backdrops
 */
export const BACKDROP_SIZES = {
  SMALL: 'w300',
  MEDIUM: 'w780',
  LARGE: 'w1280',
  ORIGINAL: 'original'
};

/**
 * Options de taille d'images disponibles pour les profils
 */
export const PROFILE_SIZES = {
  SMALL: 'w45',
  MEDIUM: 'w185',
  LARGE: 'h632',
  ORIGINAL: 'original'
};

/**
 * Configuration par défaut pour les requêtes fetch vers l'API TMDB
 */
export const DEFAULT_FETCH_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TMDB_API_TOKEN}`
  }
};

/**
 * Liste des langues disponibles pour les requêtes API
 */
export const AVAILABLE_LANGUAGES = ['fr-FR', 'en-US'];

/**
 * Langue par défaut pour les requêtes API
 */
export const DEFAULT_LANGUAGE = 'fr-FR';
