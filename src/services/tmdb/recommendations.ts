
/**
 * Service pour les recommandations de médias
 */
import { fetchResultsPage } from './utils';
import type { MediaBasic, MediaType, ResultsPage } from './types';

/**
 * Récupère les recommandations pour un média
 * @param id - ID du média
 * @param mediaType - Type de média
 * @param page - Numéro de page
 * @returns Médias recommandés
 */
export async function fetchRecommendations(
  id: number, 
  mediaType: MediaType, 
  page: number = 1
): Promise<ResultsPage<MediaBasic>> {
  return fetchResultsPage<MediaBasic>(
    `/${mediaType}/${id}/recommendations`,
    { page }
  );
}

/**
 * Récupère les médias similaires
 * @param id - ID du média
 * @param mediaType - Type de média
 * @param page - Numéro de page
 * @returns Médias similaires
 */
export async function fetchSimilar(
  id: number, 
  mediaType: MediaType, 
  page: number = 1
): Promise<ResultsPage<MediaBasic>> {
  return fetchResultsPage<MediaBasic>(
    `/${mediaType}/${id}/similar`,
    { page }
  );
}
