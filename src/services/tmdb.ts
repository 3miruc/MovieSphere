
// TMDB API Configuration
const TMDB_API_KEY = 'c2521840e0cfff7c88c564de23f7cac4';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes available from TMDB
export const ImageSize = {
  Poster: {
    Small: 'w185',
    Medium: 'w342',
    Large: 'w500',
    Original: 'original'
  },
  Backdrop: {
    Small: 'w300',
    Medium: 'w780',
    Large: 'w1280',
    Original: 'original'
  }
};

export interface TMDBMovie {
  id: number;
  title: string;
  name?: string; // For TV shows
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string; // For TV shows
  media_type?: 'movie' | 'tv';
  number_of_seasons?: number; // For TV shows
  runtime?: number; // For movies
}

export interface TMDBGenre {
  id: number;
  name: string;
}

// Convert TMDB data format to our app's Movie format
export const convertTMDBToMovie = (item: TMDBMovie): Movie => {
  const isTV = item.media_type === 'tv' || item.first_air_date !== undefined;
  
  return {
    id: item.id,
    title: item.title || item.name || '',
    type: isTV ? 'series' : 'movie',
    genres: [], // We'll fill this later when we have the genres mapping
    posterUrl: item.poster_path 
      ? `${TMDB_IMAGE_BASE_URL}/${ImageSize.Poster.Medium}${item.poster_path}`
      : 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81', // Fallback image
    backdropUrl: item.backdrop_path 
      ? `${TMDB_IMAGE_BASE_URL}/${ImageSize.Backdrop.Large}${item.backdrop_path}`
      : undefined,
    rating: item.vote_average,
    year: new Date(item.release_date || item.first_air_date || '').getFullYear() || 0,
    description: item.overview,
    duration: item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m` : undefined,
    seasons: item.number_of_seasons,
    tmdbId: item.id // Adding TMDB ID for reference
  };
};

// Fetch trending movies and TV shows
export const fetchTrending = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=fr-FR`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending content');
    }
    
    const data = await response.json();
    const genresMap = await fetchGenresMap();
    
    return data.results.map((item: TMDBMovie) => {
      const movie = convertTMDBToMovie(item);
      // Add genres based on genre_ids
      movie.genres = item.genre_ids.map(id => genresMap[id] || '').filter(Boolean);
      return movie;
    });
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
};

// Fetch movie or TV show details by ID
export const fetchMediaDetails = async (id: number, type: 'movie' | 'tv'): Promise<Movie | null> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=fr-FR`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} details`);
    }
    
    const data = await response.json();
    
    // Add media_type to match our conversion function expectations
    data.media_type = type;
    
    const movie = convertTMDBToMovie(data);
    
    // Add genres from the detailed response
    if (data.genres) {
      movie.genres = data.genres.map((genre: TMDBGenre) => genre.name);
    }
    
    return movie;
  } catch (error) {
    console.error(`Error fetching ${type} details:`, error);
    return null;
  }
};

// Search for movies and TV shows
export const searchMedia = async (query: string): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search');
    }
    
    const data = await response.json();
    const genresMap = await fetchGenresMap();
    
    return data.results
      .filter((item: TMDBMovie) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item: TMDBMovie) => {
        const movie = convertTMDBToMovie(item);
        // Add genres based on genre_ids
        movie.genres = item.genre_ids.map(id => genresMap[id] || '').filter(Boolean);
        return movie;
      });
  } catch (error) {
    console.error('Error searching:', error);
    return [];
  }
};

// Get recommendations based on a movie/show ID
export const fetchRecommendations = async (id: number, type: 'movie' | 'tv'): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}/recommendations?api_key=${TMDB_API_KEY}&language=fr-FR`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} recommendations`);
    }
    
    const data = await response.json();
    const genresMap = await fetchGenresMap();
    
    return data.results.map((item: TMDBMovie) => {
      // Add media_type for the conversion function
      item.media_type = item.first_air_date ? 'tv' : 'movie';
      
      const movie = convertTMDBToMovie(item);
      // Add genres based on genre_ids
      movie.genres = item.genre_ids.map(id => genresMap[id] || '').filter(Boolean);
      return movie;
    });
  } catch (error) {
    console.error(`Error fetching ${type} recommendations:`, error);
    return [];
  }
};

// Fetch movies by genre
export const fetchMediaByGenre = async (genreId: number): Promise<Movie[]> => {
  try {
    // Fetch both movies and TV shows with the genre
    const [movieResponse, tvResponse] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=fr-FR&with_genres=${genreId}`),
      fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=fr-FR&with_genres=${genreId}`)
    ]);
    
    if (!movieResponse.ok || !tvResponse.ok) {
      throw new Error('Failed to fetch by genre');
    }
    
    const movieData = await movieResponse.json();
    const tvData = await tvResponse.json();
    const genresMap = await fetchGenresMap();
    
    // Process movies
    const movies = movieData.results.map((item: TMDBMovie) => {
      item.media_type = 'movie';
      const movie = convertTMDBToMovie(item);
      movie.genres = item.genre_ids.map(id => genresMap[id] || '').filter(Boolean);
      return movie;
    });
    
    // Process TV shows
    const tvShows = tvData.results.map((item: TMDBMovie) => {
      item.media_type = 'tv';
      const show = convertTMDBToMovie(item);
      show.genres = item.genre_ids.map(id => genresMap[id] || '').filter(Boolean);
      return show;
    });
    
    // Combine and shuffle the results
    return [...movies, ...tvShows].sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error('Error fetching by genre:', error);
    return [];
  }
};

// Helper function to get all genres and create a map of id -> name
let genresCache: Record<number, string> = {};

export const fetchGenresMap = async (): Promise<Record<number, string>> => {
  // Return cached genres if available
  if (Object.keys(genresCache).length) {
    return genresCache;
  }
  
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=fr-FR`),
      fetch(`${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=fr-FR`)
    ]);
    
    if (!movieGenres.ok || !tvGenres.ok) {
      throw new Error('Failed to fetch genres');
    }
    
    const movieGenresData = await movieGenres.json();
    const tvGenresData = await tvGenres.json();
    
    // Combine genres and create a map
    const allGenres = [...movieGenresData.genres, ...tvGenresData.genres];
    const genresMap: Record<number, string> = {};
    
    allGenres.forEach((genre: TMDBGenre) => {
      genresMap[genre.id] = genre.name;
    });
    
    genresCache = genresMap;
    return genresMap;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return {};
  }
};

// Get personalized recommendations based on user preferences
export const getPersonalizedRecommendations = async (preferredGenres: number[], favoriteIds: number[]): Promise<Movie[]> => {
  try {
    // If user has favorites, get recommendations based on them
    if (favoriteIds.length > 0) {
      // Get a random favorite to base recommendations on
      const randomFavorite = favoriteIds[Math.floor(Math.random() * favoriteIds.length)];
      const type = Math.random() > 0.5 ? 'movie' : 'tv'; // Randomly choose movie or TV
      const recommendations = await fetchRecommendations(randomFavorite, type);
      
      if (recommendations.length > 0) {
        return recommendations;
      }
    }
    
    // Fallback to genre-based recommendations if no favorites or recommendations
    if (preferredGenres.length > 0) {
      // Get a random preferred genre
      const randomGenre = preferredGenres[Math.floor(Math.random() * preferredGenres.length)];
      return await fetchMediaByGenre(randomGenre);
    }
    
    // Final fallback to trending
    return await fetchTrending();
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return [];
  }
};
