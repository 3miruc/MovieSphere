
/**
 * Configuration des services TMDB
 * Contient toutes les constantes nécessaires pour interagir avec l'API
 */

// URL de base de l'API TMDB
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Clé API pour les requêtes TMDB
// Utilisation d'une clé de secours en cas d'absence de la variable d'environnement
// Note: Dans Vite, les variables d'environnement doivent être préfixées par VITE_
export const TMDB_API_KEY = typeof import.meta === 'object' && 
                           'env' in import.meta && 
                           import.meta.env.VITE_TMDB_API_KEY || 
                           'fallback_key';

// URL de base pour les images TMDB
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Options par défaut pour les requêtes fetch (incluant l'authentification)
export const DEFAULT_FETCH_OPTIONS = {
  headers: {
    'Content-Type': 'application/json', // Type de contenu JSON
    Authorization: `Bearer ${TMDB_API_KEY}` // Authentification avec token Bearer
  }
};

// Tailles d'images disponibles selon le type (backdrop, poster, profile)
export const IMAGE_SIZES = {
  backdrop: {
    small: 'w300', // Petite taille pour les backdrops
    medium: 'w780', // Taille moyenne
    large: 'w1280', // Grande taille
    original: 'original' // Taille originale
  },
  poster: {
    xsmall: 'w92', // Très petite taille pour les posters
    small: 'w154', // Petite taille
    medium: 'w185', // Taille moyenne
    large: 'w342', // Grande taille
    xlarge: 'w500', // Très grande taille
    xxlarge: 'w780', // Très très grande taille
    original: 'original' // Taille originale
  },
  profile: {
    small: 'w45', // Petite taille pour les photos de profil
    medium: 'w185', // Taille moyenne
    large: 'h632', // Grande taille
    original: 'original' // Taille originale
  }
};
