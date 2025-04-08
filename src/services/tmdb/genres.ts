
/**
 * Service pour la gestion des genres de médias
 */
import { fetchFromTMDB } from './utils';
import type { Genre, MediaType } from './types';

// Cache immutable pour stocker les genres par type
const genresCache: Record<MediaType, Genre[]> = {
  movie: [],
  tv: []
};

// Statut de chargement des genres
const loadingStatus: Record<MediaType, boolean> = {
  movie: false,
  tv: false
};

/**
 * Récupère tous les genres pour un type de média
 * @param mediaType - Type de média (film ou série)
 * @returns Liste des genres
 */
export async function fetchGenres(mediaType: MediaType): Promise<Genre[]> {
  // Vérifier si les genres sont déjà en cache
  if (genresCache[mediaType].length > 0) {
    return genresCache[mediaType];
  }
  
  // Éviter les requêtes en parallèle pour le même type
  if (loadingStatus[mediaType]) {
    // Attendre que les données soient chargées
    return new Promise(resolve => {
      const checkCache = () => {
        if (genresCache[mediaType].length > 0) {
          resolve(genresCache[mediaType]);
        } else {
          setTimeout(checkCache, 100);
        }
      };
      checkCache();
    });
  }
  
  try {
    loadingStatus[mediaType] = true;
    const response = await fetchFromTMDB<{ genres: Genre[] }>(`/genre/${mediaType}/list`);
    
    // Mettre à jour le cache avec les nouvelles données
    genresCache[mediaType] = [...response.genres];
    return genresCache[mediaType];
  } catch (error) {
    console.error(`Error fetching ${mediaType} genres:`, error);
    return [];
  } finally {
    loadingStatus[mediaType] = false;
  }
}

/**
 * Récupère les noms des genres à partir de leurs IDs
 * @param genreIds - IDs des genres
 * @param mediaType - Type de média
 * @returns Noms des genres
 */
export async function getGenreNames(genreIds: number[], mediaType: MediaType): Promise<string[]> {
  const genres = await fetchGenres(mediaType);
  return genreIds
    .map(id => genres.find(genre => genre.id === id)?.name)
    .filter((name): name is string => !!name);
}

/**
 * Récupère un genre par son ID
 * @param genreId - ID du genre
 * @param mediaType - Type de média
 * @returns Objet genre ou undefined
 */
export async function getGenreById(genreId: number, mediaType: MediaType): Promise<Genre | undefined> {
  const genres = await fetchGenres(mediaType);
  return genres.find(genre => genre.id === genreId);
}
