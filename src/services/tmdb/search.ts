
/**
 * Service pour la recherche de médias
 */
import { fetchResultsPage } from './utils';
import type { MediaBasic, MediaType, ResultsPage } from './types';

/**
 * Recherche de médias par mot-clé
 * @param query - Terme de recherche
 * @param page - Numéro de page
 * @returns Résultats de recherche multi-types
 */
export async function searchMulti(query: string, page: number = 1): Promise<ResultsPage<MediaBasic>> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  
  return fetchResultsPage<MediaBasic>(
    '/search/multi',
    { query, page, include_adult: false }
  );
}

/**
 * Recherche de médias par type
 * @param query - Terme de recherche
 * @param mediaType - Type de média
 * @param page - Numéro de page
 * @returns Résultats de recherche typés
 */
export async function searchByType(
  query: string, 
  mediaType: MediaType, 
  page: number = 1
): Promise<ResultsPage<MediaBasic>> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  
  return fetchResultsPage<MediaBasic>(
    `/search/${mediaType}`,
    { query, page, include_adult: false }
  );
}
