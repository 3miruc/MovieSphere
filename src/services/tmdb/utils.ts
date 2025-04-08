
/**
 * Fonctions utilitaires pour les services TMDB
 */
import { TMDB_BASE_URL, DEFAULT_FETCH_OPTIONS, TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from './config';
import type { MediaType, ResultsPage } from './types';

/**
 * Génère une URL pour une requête TMDB
 * @param path - Chemin de l'API
 * @param params - Paramètres de requête additionnels
 * @returns URL complète
 */
export function buildApiUrl(path: string, params: Record<string, string | number | boolean> = {}): string {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  
  // Ajout des paramètres à l'URL
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
}

/**
 * Fonction générique pour effectuer des requêtes à l'API TMDB
 * @param path - Chemin de l'API
 * @param params - Paramètres de requête
 * @returns Données de réponse typées
 */
export async function fetchFromTMDB<T>(path: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
  try {
    const url = buildApiUrl(path, params);
    const response = await fetch(url, DEFAULT_FETCH_OPTIONS);
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    throw error;
  }
}

/**
 * Construit l'URL d'une image
 * @param path - Chemin de l'image
 * @param type - Type d'image (poster, backdrop, profile)
 * @param size - Taille souhaitée
 * @returns URL complète de l'image ou null
 */
export function getImageUrl(
  path: string | null, 
  type: 'poster' | 'backdrop' | 'profile' = 'poster', 
  size: string = 'medium'
): string | null {
  if (!path) return null;
  
  // Obtenir la taille selon le type
  const sizeMap = IMAGE_SIZES[type];
  const sizeValue = sizeMap[size as keyof typeof sizeMap] || sizeMap.medium;
  
  return `${TMDB_IMAGE_BASE_URL}/${sizeValue}${path}`;
}

/**
 * Obtient le titre d'un média (film ou série)
 * @param media - Objet média
 * @returns Titre du média
 */
export function getMediaTitle(media: { title?: string; name?: string }): string {
  return media.title || media.name || 'Titre inconnu';
}

/**
 * Obtient la date de sortie d'un média (film ou série)
 * @param media - Objet média
 * @returns Date formatée ou chaîne vide
 */
export function getMediaReleaseDate(media: { release_date?: string; first_air_date?: string }): string {
  const dateStr = media.release_date || media.first_air_date;
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  } catch (e) {
    return '';
  }
}

/**
 * Détermine le type de média à partir d'un objet
 * @param media - Objet média
 * @returns Type de média (movie ou tv)
 */
export function determineMediaType(media: { media_type?: MediaType; title?: string; name?: string }): MediaType {
  if (media.media_type) return media.media_type;
  return media.title ? 'movie' : 'tv';
}

/**
 * Récupère une page de résultats complète avec gestion d'erreur
 * @param endpoint - Point d'API
 * @param params - Paramètres de requête
 * @returns Page de résultats typée
 */
export async function fetchResultsPage<T>(
  endpoint: string, 
  params: Record<string, string | number | boolean> = {}
): Promise<ResultsPage<T>> {
  try {
    return await fetchFromTMDB<ResultsPage<T>>(endpoint, params);
  } catch (error) {
    console.error(`Error fetching results from ${endpoint}:`, error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}
