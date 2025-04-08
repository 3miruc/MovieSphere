
/**
 * Service pour la récupération des détails de médias
 */
import { fetchFromTMDB } from './utils';
import type { MediaDetails, MediaType, Actor, VideoResult } from './types';

/**
 * Récupère les détails complets d'un média
 * @param id - ID du média
 * @param mediaType - Type de média (film ou série)
 * @returns Détails complets du média
 */
export async function fetchMediaDetails(id: number, mediaType: MediaType): Promise<MediaDetails> {
  return fetchFromTMDB<MediaDetails>(
    `/${mediaType}/${id}`,
    {
      append_to_response: 'credits,videos'
    }
  );
}

/**
 * Récupère les acteurs principaux d'un média
 * @param id - ID du média
 * @param mediaType - Type de média
 * @param limit - Nombre maximum d'acteurs à retourner
 * @returns Liste des acteurs principaux
 */
export async function fetchCast(id: number, mediaType: MediaType, limit: number = 10): Promise<Actor[]> {
  try {
    const details = await fetchMediaDetails(id, mediaType);
    return (details.credits?.cast || []).slice(0, limit);
  } catch (error) {
    console.error(`Error fetching cast for ${mediaType} ${id}:`, error);
    return [];
  }
}

/**
 * Récupère les vidéos associées à un média
 * @param id - ID du média
 * @param mediaType - Type de média
 * @param videoType - Type de vidéo (ex: 'Trailer')
 * @returns Liste des vidéos filtrées
 */
export async function fetchVideos(
  id: number, 
  mediaType: MediaType, 
  videoType?: string
): Promise<VideoResult[]> {
  try {
    const details = await fetchMediaDetails(id, mediaType);
    let videos = details.videos?.results || [];
    
    // Filtrer par type si demandé
    if (videoType) {
      videos = videos.filter(video => video.type === videoType);
    }
    
    return videos;
  } catch (error) {
    console.error(`Error fetching videos for ${mediaType} ${id}:`, error);
    return [];
  }
}

/**
 * Récupère la bande-annonce principale d'un média
 * @param id - ID du média
 * @param mediaType - Type de média
 * @returns Bande-annonce ou null
 */
export async function fetchTrailer(id: number, mediaType: MediaType): Promise<VideoResult | null> {
  try {
    const videos = await fetchVideos(id, mediaType, 'Trailer');
    return videos.length > 0 ? videos[0] : null;
  } catch (error) {
    console.error(`Error fetching trailer for ${mediaType} ${id}:`, error);
    return null;
  }
}
