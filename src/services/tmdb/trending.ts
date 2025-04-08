
/**
 * Service pour la récupération des médias tendance
 * Fournit des fonctions pour accéder aux médias populaires du moment
 */

import { fetchResultsPage } from './utils'; // Import de la fonction utilitaire
import type { MediaBasic, MediaType, ResultsPage } from './types'; // Import des types

/**
 * Récupère les médias tendance tous types confondus
 * @param timeWindow - Fenêtre temporelle (jour ou semaine)
 * @param page - Numéro de page pour la pagination
 * @returns Page de résultats des médias tendance
 */
export async function fetchTrending(
  timeWindow: 'day' | 'week' = 'week', // Semaine par défaut pour des tendances plus stables
  page: number = 1                     // Première page par défaut
): Promise<ResultsPage<MediaBasic>> {
  // Utiliser l'endpoint de tendance de TMDB pour tous les médias
  return fetchResultsPage<MediaBasic>(
    `/trending/all/${timeWindow}`, // Endpoint pour les tendances globales
    { page }                       // Paramètre de pagination
  );
}

/**
 * Récupère les médias tendance par type spécifique
 * @param mediaType - Type de média (film ou série)
 * @param timeWindow - Fenêtre temporelle (jour ou semaine)
 * @param page - Numéro de page pour la pagination
 * @returns Page de résultats des médias tendance du type spécifié
 */
export async function fetchTrendingByType(
  mediaType: MediaType,
  timeWindow: 'day' | 'week' = 'week', // Semaine par défaut pour des tendances plus stables
  page: number = 1                     // Première page par défaut
): Promise<ResultsPage<MediaBasic>> {
  // Utiliser l'endpoint de tendance de TMDB pour un type spécifique
  return fetchResultsPage<MediaBasic>(
    `/trending/${mediaType}/${timeWindow}`, // Endpoint pour les tendances typées
    { page }                               // Paramètre de pagination
  );
}
