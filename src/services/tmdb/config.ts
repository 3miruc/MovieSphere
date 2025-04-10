
/**
 * Configuration des services TMDB
 */

// URL de base de l'API TMDB
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Clé API pour les requêtes TMDB
export const TMDB_API_KEY = 'c2521840e0cfff7c88c564de23f7cac4';

// URL de base pour les images TMDB
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Options par défaut pour les requêtes fetch
export const DEFAULT_FETCH_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TMDB_API_KEY}`
  }
};

// Tailles d'images disponibles selon le type
export const IMAGE_SIZES = {
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  },
  poster: {
    xsmall: 'w92',
    small: 'w154',
    medium: 'w185',
    large: 'w342',
    xlarge: 'w500',
    xxlarge: 'w780',
    original: 'original'
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original'
  }
};
