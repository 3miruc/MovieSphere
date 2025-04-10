
/**
 * Types pour les données TMDB
 */

// Types de médias supportés
export type MediaType = 'movie' | 'tv';

// Structure d'un genre
export interface Genre {
  id: number;
  name: string;
}

// Configuration d'un filtre de recherche
export interface DiscoverFilter {
  with_genres?: string;
  sort_by?: string;
  page?: number;
  include_adult?: boolean;
  language?: string;
}

// Structure d'une page de résultats
export interface ResultsPage<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Informations de base d'un média
export interface MediaBasic {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type?: MediaType;
}

// Informations complètes d'un média
export interface MediaDetails extends Omit<MediaBasic, 'genre_ids'> {
  genres: Genre[];
  tagline?: string;
  status?: string;
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  created_by?: Array<{
    id: number;
    name: string;
    profile_path: string | null;
  }>;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
  }>;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      profile_path: string | null;
    }>;
  };
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
  // Ajout d'informations sur les plateformes de diffusion ("watch providers")
  watch_providers?: {
    results: {
      [country: string]: {
        link: string;
        flatrate?: Array<{
          provider_id: number;
          provider_name: string;
          logo_path: string;
        }>;
        rent?: Array<{
          provider_id: number;
          provider_name: string;
          logo_path: string;
        }>;
        buy?: Array<{
          provider_id: number;
          provider_name: string;
          logo_path: string;
        }>;
      };
    };
  };
}

// Structure d'un acteur
export interface Actor {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

// Vidéos associées à un média
export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

// Structure pour les plateformes de diffusion (providers)
export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

// Structure pour les plateformes par pays
export interface WatchProviders {
  results: {
    [country: string]: {
      link: string;
      flatrate?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    };
  };
}
