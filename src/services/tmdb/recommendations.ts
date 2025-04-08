
/**
 * Service pour les recommandations de médias
 * Fournit des fonctions pour obtenir des recommandations et médias similaires
 */

import { fetchResultsPage } from './utils'; // Import de la fonction utilitaire
import type { MediaBasic, MediaType, ResultsPage } from './types'; // Import des types

/**
 * Récupère les recommandations pour un média
 * @param id - ID du média source
 * @param mediaType - Type de média (film ou série)
 * @param page - Numéro de page pour la pagination
 * @returns Page de résultats des médias recommandés
 */
export async function fetchRecommendations(
  id: number, 
  mediaType: MediaType, 
  page: number = 1
): Promise<ResultsPage<MediaBasic>> {
  // Utiliser l'endpoint de recommandations de TMDB
  return fetchResultsPage<MediaBasic>(
    `/${mediaType}/${id}/recommendations`, // Endpoint pour les recommandations
    { page }                               // Paramètre de pagination
  );
}

/**
 * Récupère les médias similaires à un média donné
 * @param id - ID du média source
 * @param mediaType - Type de média (film ou série)
 * @param page - Numéro de page pour la pagination
 * @returns Page de résultats des médias similaires
 */
export async function fetchSimilar(
  id: number, 
  mediaType: MediaType, 
  page: number = 1
): Promise<ResultsPage<MediaBasic>> {
  // Utiliser l'endpoint de similarité de TMDB
  return fetchResultsPage<MediaBasic>(
    `/${mediaType}/${id}/similar`, // Endpoint pour les médias similaires
    { page }                       // Paramètre de pagination
  );
}
