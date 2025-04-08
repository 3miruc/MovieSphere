
/**
 * Service pour la découverte de médias
 */
import { fetchResultsPage } from './utils';
import type { MediaBasic, MediaType, DiscoverFilter, ResultsPage } from './types';

/**
 * Découvre des médias selon des filtres
 * @param mediaType - Type de média
 * @param filters - Filtres de découverte
 * @returns Médias correspondant aux filtres
 */
export async function discoverMedia(
  mediaType: MediaType,
  filters: DiscoverFilter = {}
): Promise<ResultsPage<MediaBasic>> {
  const defaultFilters: DiscoverFilter = {
    page: 1,
    include_adult: false,
    language: 'fr-FR',
    sort_by: 'popularity.desc'
  };
  
  // Fusionner les filtres par défaut avec les filtres fournis
  const mergedFilters = { ...defaultFilters, ...filters };
  
  return fetchResultsPage<MediaBasic>(
    `/discover/${mediaType}`,
    mergedFilters
  );
}

/**
 * Découvre des médias par genre
 * @param mediaType - Type de média
 * @param genreId - ID du genre
 * @param page - Numéro de page
 * @returns Médias du genre spécifié
 */
export async function discoverByGenre(
  mediaType: MediaType,
  genreId: number,
  page: number = 1
): Promise<ResultsPage<MediaBasic>> {
  return discoverMedia(mediaType, {
    with_genres: String(genreId),
    page
  });
}

/**
 * Récupère les médias populaires
 * @param mediaType - Type de média
 * @param page - Numéro de page
 * @returns Médias populaires
 */
export async function fetchPopular(
  mediaType: MediaType,
  page: number = 1
): Promise<ResultsPage<MediaBasic>> {
  return fetchResultsPage<MediaBasic>(
    `/${mediaType}/popular`,
    { page }
  );
}

/**
 * Récupère les médias les mieux notés
 * @param mediaType - Type de média
 * @param page - Numéro de page
 * @returns Médias les mieux notés
 */
export async function fetchTopRated(
  mediaType: MediaType,
  page: number = 1
): Promise<ResultsPage<MediaBasic>> {
  return fetchResultsPage<MediaBasic>(
    `/${mediaType}/top_rated`,
    { page }
  );
}
