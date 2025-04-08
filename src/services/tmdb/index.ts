
/**
 * Point d'entrée pour les services TMDB
 * Exporte toutes les fonctionnalités des services
 */

// Configuration et utilitaires
export * from './config'; // Exporte les constantes de configuration
export * from './types'; // Exporte les types de données
export * from './utils'; // Exporte les fonctions utilitaires

// Services spécifiques
export * from './genres'; // Exporte les fonctions de gestion des genres
export * from './trending'; // Exporte les fonctions liées aux tendances
export * from './details'; // Exporte les fonctions de récupération des détails
export * from './search'; // Exporte les fonctions de recherche
export * from './recommendations'; // Exporte les fonctions de recommandations
export * from './discover'; // Exporte les fonctions de découverte

// Export d'un objet unifié pour accès facile
import * as genres from './genres';
import * as trending from './trending';
import * as details from './details';
import * as search from './search';
import * as recommendations from './recommendations';
import * as discover from './discover';

// Services regroupés par domaine fonctionnel
export const tmdbServices = {
  genres, // Services liés aux genres
  trending, // Services liés aux tendances
  details, // Services liés aux détails
  search, // Services liés à la recherche
  recommendations, // Services liés aux recommandations
  discover // Services liés à la découverte
};

export default tmdbServices; // Export par défaut pour faciliter l'import
