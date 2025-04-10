
/**
 * Point d'entrée pour les services TMDB
 * Exporte toutes les fonctionnalités des services
 */

// Configuration et utilitaires
export * from './config';
export * from './types';
export * from './utils';

// Services spécifiques
export * from './genres';
export * from './trending';
export * from './details';
export * from './search';
export * from './recommendations';
export * from './discover';

// Export d'un objet unifié pour accès facile
import * as genres from './genres';
import * as trending from './trending';
import * as details from './details';
import * as search from './search';
import * as recommendations from './recommendations';
import * as discover from './discover';

// Services regroupés par domaine fonctionnel
export const tmdbServices = {
  genres,
  trending,
  details,
  search,
  recommendations,
  discover
};

export default tmdbServices;
