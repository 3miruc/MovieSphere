
/**
 * Service pour la gestion des genres de médias
 * Fournit des fonctions pour récupérer et manipuler les genres
 */

import { fetchFromTMDB } from './utils'; // Import de la fonction utilitaire
import type { Genre, MediaType } from './types'; // Import des types

// Cache immutable pour stocker les genres par type (utilisation de const pour éviter toute modification accidentelle)
const genresCache: Record<MediaType, Genre[]> = {
  movie: [], // Cache pour les genres de films
  tv: []     // Cache pour les genres de séries
};

// Statut de chargement des genres pour éviter les requêtes en parallèle
const loadingStatus: Record<MediaType, boolean> = {
  movie: false, // Indique si les genres de films sont en cours de chargement
  tv: false     // Indique si les genres de séries sont en cours de chargement
};

/**
 * Récupère tous les genres pour un type de média
 * @param mediaType - Type de média (film ou série)
 * @returns Liste des genres
 */
export async function fetchGenres(mediaType: MediaType): Promise<Genre[]> {
  // Vérifier si les genres sont déjà en cache pour éviter une requête inutile
  if (genresCache[mediaType].length > 0) {
    return genresCache[mediaType]; // Retourner les genres en cache
  }
  
  // Éviter les requêtes en parallèle pour le même type de média
  if (loadingStatus[mediaType]) {
    // Attendre que les données soient chargées via une promesse
    return new Promise(resolve => {
      const checkCache = () => {
        if (genresCache[mediaType].length > 0) {
          resolve(genresCache[mediaType]); // Résoudre la promesse quand les données sont disponibles
        } else {
          setTimeout(checkCache, 100); // Vérifier à nouveau après un court délai
        }
      };
      checkCache(); // Démarrer la vérification
    });
  }
  
  try {
    loadingStatus[mediaType] = true; // Marquer comme en cours de chargement
    // Récupérer les genres depuis l'API TMDB
    const response = await fetchFromTMDB<{ genres: Genre[] }>(`/genre/${mediaType}/list`);
    
    // Mettre à jour le cache avec les nouvelles données (clone pour éviter les modifications par référence)
    genresCache[mediaType] = [...response.genres];
    return genresCache[mediaType]; // Retourner les genres récupérés
  } catch (error) {
    console.error(`Error fetching ${mediaType} genres:`, error); // Journaliser l'erreur
    return []; // Retourner un tableau vide en cas d'erreur
  } finally {
    loadingStatus[mediaType] = false; // Marquer comme terminé quel que soit le résultat
  }
}

/**
 * Récupère les noms des genres à partir de leurs IDs
 * @param genreIds - IDs des genres à rechercher
 * @param mediaType - Type de média
 * @returns Tableau des noms de genres correspondants
 */
export async function getGenreNames(genreIds: number[], mediaType: MediaType): Promise<string[]> {
  const genres = await fetchGenres(mediaType); // Récupérer tous les genres
  
  // Filtrer pour trouver les genres correspondant aux IDs et extraire leurs noms
  return genreIds
    .map(id => genres.find(genre => genre.id === id)?.name) // Trouver chaque genre par ID
    .filter((name): name is string => !!name); // Filtrer les noms null/undefined
}

/**
 * Récupère un genre par son ID
 * @param genreId - ID du genre à rechercher
 * @param mediaType - Type de média
 * @returns Objet genre ou undefined si non trouvé
 */
export async function getGenreById(genreId: number, mediaType: MediaType): Promise<Genre | undefined> {
  const genres = await fetchGenres(mediaType); // Récupérer tous les genres
  return genres.find(genre => genre.id === genreId); // Trouver le genre par ID
}
