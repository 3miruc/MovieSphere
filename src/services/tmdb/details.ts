
/**
 * Service pour la récupération des détails de médias
 * Fournit des fonctions pour accéder aux informations détaillées des médias
 */

import { fetchFromTMDB } from './utils'; // Import de la fonction utilitaire
import type { MediaDetails, MediaType, Actor, VideoResult } from './types'; // Import des types

/**
 * Récupère les détails complets d'un média
 * @param id - ID du média à récupérer
 * @param mediaType - Type de média (film ou série)
 * @returns Détails complets du média
 */
export async function fetchMediaDetails(id: number, mediaType: MediaType): Promise<MediaDetails> {
  // Récupérer les détails avec les crédits et vidéos en une seule requête (optimisation)
  return fetchFromTMDB<MediaDetails>(
    `/${mediaType}/${id}`, // Endpoint pour les détails du média
    {
      append_to_response: 'credits,videos' // Inclure les crédits et vidéos dans la réponse
    }
  );
}

/**
 * Récupère les acteurs principaux d'un média
 * @param id - ID du média
 * @param mediaType - Type de média (film ou série)
 * @param limit - Nombre maximum d'acteurs à retourner
 * @returns Liste des acteurs principaux
 */
export async function fetchCast(id: number, mediaType: MediaType, limit: number = 10): Promise<Actor[]> {
  try {
    // Récupérer les détails complets (incluant les crédits)
    const details = await fetchMediaDetails(id, mediaType);
    
    // Extraire et limiter le nombre d'acteurs
    return (details.credits?.cast || []).slice(0, limit);
  } catch (error) {
    console.error(`Error fetching cast for ${mediaType} ${id}:`, error); // Journaliser l'erreur
    return []; // Retourner un tableau vide en cas d'erreur
  }
}

/**
 * Récupère les vidéos associées à un média
 * @param id - ID du média
 * @param mediaType - Type de média (film ou série)
 * @param videoType - Type de vidéo optionnel (ex: 'Trailer')
 * @returns Liste des vidéos filtrées
 */
export async function fetchVideos(
  id: number, 
  mediaType: MediaType, 
  videoType?: string
): Promise<VideoResult[]> {
  try {
    // Récupérer les détails complets (incluant les vidéos)
    const details = await fetchMediaDetails(id, mediaType);
    let videos = details.videos?.results || [];
    
    // Filtrer par type si un type est spécifié
    if (videoType) {
      videos = videos.filter(video => video.type === videoType);
    }
    
    return videos;
  } catch (error) {
    console.error(`Error fetching videos for ${mediaType} ${id}:`, error); // Journaliser l'erreur
    return []; // Retourner un tableau vide en cas d'erreur
  }
}

/**
 * Récupère la bande-annonce principale d'un média
 * @param id - ID du média
 * @param mediaType - Type de média (film ou série)
 * @returns Bande-annonce ou null si aucune n'est trouvée
 */
export async function fetchTrailer(id: number, mediaType: MediaType): Promise<VideoResult | null> {
  try {
    // Récupérer uniquement les vidéos de type "Trailer"
    const videos = await fetchVideos(id, mediaType, 'Trailer');
    
    // Retourner la première bande-annonce ou null
    return videos.length > 0 ? videos[0] : null;
  } catch (error) {
    console.error(`Error fetching trailer for ${mediaType} ${id}:`, error); // Journaliser l'erreur
    return null; // Retourner null en cas d'erreur
  }
}
