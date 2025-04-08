
/**
 * Service pour la récupération des médias tendance
 */
import { fetchResultsPage } from './utils';
import type { MediaBasic, MediaType, ResultsPage } from './types';

/**
 * Récupère les médias tendance
 * @param timeWindow - Fenêtre temporelle (day/week)
 * @param page - Numéro de page
 * @returns Page de résultats des médias tendance
 */
export async function fetchTrending(
  timeWindow: 'day' | 'week' = 'week',
  page: number = 1
): Promise<ResultsPage<MediaBasic>> {
  return fetchResultsPage<MediaBasic>(
    `/trending/all/${timeWindow}`,
    { page }
  );
}

/**
 * Récupère les médias tendance par type
 * @param mediaType - Type de média (film ou série)
 * @param timeWindow - Fenêtre temporelle (day/week)
 * @param page - Numéro de page
 * @returns Page de résultats des médias tendance
 */
export async function fetchTrendingByType(
  mediaType: MediaType,
  timeWindow: 'day' | 'week' = 'week',
  page: number = 1
): Promise<ResultsPage<MediaBasic>> {
  return fetchResultsPage<MediaBasic>(
    `/trending/${mediaType}/${timeWindow}`,
    { page }
  );
}
