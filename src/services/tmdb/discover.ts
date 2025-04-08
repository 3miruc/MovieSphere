
/**
 * Service pour la découverte de médias
 * Fournit des fonctions pour explorer et filtrer les médias
 */

import { fetchResultsPage } from './utils'; // Import de la fonction utilitaire
import type { MediaBasic, MediaType, DiscoverFilter, ResultsPage } from './types'; // Import des types

/**
 * Découvre des médias selon des filtres
 * @param mediaType - Type de média (film ou série)
 * @param filters - Filtres de découverte optionnels
 * @returns Page de résultats des médias correspondant aux filtres
 */
export async function discoverMedia(
  mediaType: MediaType,
  filters: DiscoverFilter = {}
): Promise<ResultsPage<MediaBasic>> {
  // Définir les filtres par défaut pour une expérience utilisateur optimale
  const defaultFilters: DiscoverFilter = {
    page: 1,                  // Première page par défaut
    include_adult: false,     // Exclure le contenu adulte par défaut
    language: 'fr-FR',        // Langue française par défaut
    sort_by: 'popularity.desc' // Tri par popularité décroissante
  };
  
  // Fusionner les filtres par défaut avec les filtres fournis (priorité aux filtres fournis)
  const mergedFilters = { ...defaultFilters, ...filters };
  
  // Effectuer la requête de découverte avec les filtres fusionnés
  return fetchResultsPage<MediaBasic>(
    `/discover/${mediaType}`, // Endpoint de découverte
    mergedFilters             // Filtres appliqués
  );
}

/**
 * Découvre des médias par genre
 * @param mediaType - Type de média (film ou série)
 * @param genreId - ID du genre à filtrer
 * @param page - Numéro de page pour la pagination
 * @returns Page de résultats des médias du genre spécifié
 */
export async function discoverByGenre(
  mediaType: MediaType,
  genreId: number,
  page: number = 1
): Promise<ResultsPage<MediaBasic>> {
  // Utiliser la fonction discoverMedia avec un filtre de genre
  return discoverMedia(mediaType, {
    with_genres: String(genreId), // Convertir l'ID en chaîne pour le paramètre
    page                          // Numéro de page
  });
}

/**
 * Récupère les médias populaires
 * @param mediaType - Type de média (film ou série)
 * @param page - Numéro de page pour la pagination
 * @returns Page de résultats des médias populaires
 */
export async function fetchPopular(
  mediaType: MediaType,
  page: number = 1
): Promise<ResultsPage<MediaBasic>> {
  // Utiliser directement l'endpoint "popular" de TMDB
  return fetchResultsPage<MediaBasic>(
    `/${mediaType}/popular`, // Endpoint pour les médias populaires
    { page }                 // Paramètre de pagination
  );
}

/**
 * Récupère les médias les mieux notés
 * @param mediaType - Type de média (film ou série)
 * @param page - Numéro de page pour la pagination
 * @returns Page de résultats des médias les mieux notés
 */
export async function fetchTopRated(
  mediaType: MediaType,
  page: number = 1
): Promise<ResultsPage<MediaBasic>> {
  // Utiliser directement l'endpoint "top_rated" de TMDB
  return fetchResultsPage<MediaBasic>(
    `/${mediaType}/top_rated`, // Endpoint pour les médias les mieux notés
    { page }                   // Paramètre de pagination
  );
}
