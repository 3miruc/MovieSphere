
/**
 * Service pour la recherche de médias
 * Fournit des fonctions pour rechercher des médias par mots-clés
 */

import { fetchResultsPage } from './utils'; // Import de la fonction utilitaire
import type { MediaBasic, MediaType, ResultsPage } from './types'; // Import des types

/**
 * Recherche de médias tous types confondus par mot-clé
 * @param query - Terme de recherche
 * @param page - Numéro de page pour la pagination
 * @returns Résultats de recherche multi-types
 */
export async function searchMulti(query: string, page: number = 1): Promise<ResultsPage<MediaBasic>> {
  // Vérifier si la requête est vide pour éviter des appels API inutiles
  if (!query.trim()) {
    // Retourner une page de résultats vide
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  
  // Utiliser l'endpoint multi-recherche de TMDB
  return fetchResultsPage<MediaBasic>(
    '/search/multi',                       // Endpoint pour la recherche multi-types
    { query, page, include_adult: false }  // Paramètres incluant le terme et la pagination
  );
}

/**
 * Recherche de médias par type spécifique
 * @param query - Terme de recherche
 * @param mediaType - Type de média à rechercher
 * @param page - Numéro de page pour la pagination
 * @returns Résultats de recherche du type spécifié
 */
export async function searchByType(
  query: string, 
  mediaType: MediaType, 
  page: number = 1
): Promise<ResultsPage<MediaBasic>> {
  // Vérifier si la requête est vide pour éviter des appels API inutiles
  if (!query.trim()) {
    // Retourner une page de résultats vide
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  
  // Utiliser l'endpoint de recherche typé de TMDB
  return fetchResultsPage<MediaBasic>(
    `/search/${mediaType}`,                // Endpoint pour la recherche par type
    { query, page, include_adult: false }  // Paramètres incluant le terme et la pagination
  );
}
