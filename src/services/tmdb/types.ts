
/**
 * Types pour les données TMDB
 * Définit toutes les interfaces et types utilisés dans les services
 */

// Types de médias supportés (film ou série)
export type MediaType = 'movie' | 'tv';

// Structure d'un genre
export interface Genre {
  id: number;      // Identifiant unique du genre
  name: string;    // Nom du genre (ex: Action, Comédie)
}

// Configuration d'un filtre de recherche pour la découverte
export interface DiscoverFilter {
  with_genres?: string;     // Filtrer par genres (IDs séparés par virgules)
  sort_by?: string;         // Tri des résultats (ex: popularity.desc)
  page?: number;            // Numéro de page pour la pagination
  include_adult?: boolean;  // Inclure ou non le contenu adulte
  language?: string;        // Langue des résultats (ex: fr-FR)
}

// Structure d'une page de résultats paginés
export interface ResultsPage<T> {
  page: number;            // Numéro de la page courante
  results: T[];            // Tableau des résultats
  total_pages: number;     // Nombre total de pages disponibles
  total_results: number;   // Nombre total de résultats
}

// Informations de base d'un média (film ou série)
export interface MediaBasic {
  id: number;                   // Identifiant unique du média
  title?: string;               // Titre (pour les films)
  name?: string;                // Nom (pour les séries)
  poster_path: string | null;   // Chemin de l'affiche
  backdrop_path: string | null; // Chemin de l'image de fond
  vote_average: number;         // Note moyenne
  overview: string;             // Description/synopsis
  release_date?: string;        // Date de sortie (pour les films)
  first_air_date?: string;      // Date de première diffusion (pour les séries)
  genre_ids: number[];          // IDs des genres associés
  media_type?: MediaType;       // Type de média (film ou série)
}

// Informations complètes d'un média (extension de MediaBasic)
export interface MediaDetails extends Omit<MediaBasic, 'genre_ids'> {
  genres: Genre[];              // Liste des genres (objets complets, pas juste IDs)
  tagline?: string;             // Slogan ou accroche
  status?: string;              // Statut (ex: Released, In Production)
  runtime?: number;             // Durée en minutes (pour les films)
  episode_run_time?: number[];  // Durées des épisodes (pour les séries)
  number_of_seasons?: number;   // Nombre de saisons (pour les séries)
  number_of_episodes?: number;  // Nombre d'épisodes (pour les séries)
  created_by?: Array<{          // Créateurs (pour les séries)
    id: number;                 // ID du créateur
    name: string;               // Nom du créateur
    profile_path: string | null; // Photo du créateur
  }>;
  production_companies: Array<{ // Sociétés de production
    id: number;                 // ID de la société
    name: string;               // Nom de la société
    logo_path: string | null;   // Logo de la société
  }>;
  credits?: {                   // Crédits (acteurs, équipe)
    cast: Array<{               // Distribution (acteurs)
      id: number;               // ID de l'acteur
      name: string;             // Nom de l'acteur
      character: string;        // Personnage joué
      profile_path: string | null; // Photo de l'acteur
    }>;
    crew: Array<{               // Équipe technique
      id: number;               // ID du membre d'équipe
      name: string;             // Nom du membre d'équipe
      job: string;              // Poste occupé
      profile_path: string | null; // Photo du membre d'équipe
    }>;
  };
  videos?: {                    // Vidéos associées
    results: Array<{            // Résultats des vidéos
      id: string;               // ID de la vidéo
      key: string;              // Clé YouTube ou autre
      name: string;             // Nom de la vidéo
      site: string;             // Site hébergeant la vidéo
      type: string;             // Type de vidéo (ex: Trailer)
    }>;
  };
}

// Structure d'un acteur
export interface Actor {
  id: number;                  // ID de l'acteur
  name: string;                // Nom de l'acteur
  character: string;           // Personnage joué
  profile_path: string | null; // Chemin de la photo de profil
}

// Vidéos associées à un média
export interface VideoResult {
  id: string;    // ID de la vidéo
  key: string;   // Clé YouTube ou autre plateforme
  name: string;  // Nom de la vidéo
  site: string;  // Site hébergeant la vidéo (ex: YouTube)
  type: string;  // Type de vidéo (ex: Trailer, Teaser)
}
