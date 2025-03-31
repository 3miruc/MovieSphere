
import { Movie } from '@/data/movies';

// Types for user preferences
export interface UserRating {
  movieId: number;
  rating: number; // 1-10 rating
}

export interface UserPreferences {
  favoriteMovies: number[];
  ratings: UserRating[];
  preferredGenres: number[];
}

// Local storage keys
const FAVORITES_KEY = 'cinema-favorites';
const RATINGS_KEY = 'cinema-ratings';
const PREFERRED_GENRES_KEY = 'cinema-preferred-genres';

// Get favorites from local storage
export const getFavorites = (): number[] => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

// Add a movie to favorites
export const addToFavorites = (movieId: number): void => {
  const favorites = getFavorites();
  if (!favorites.includes(movieId)) {
    favorites.push(movieId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

// Remove a movie from favorites
export const removeFromFavorites = (movieId: number): void => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(id => id !== movieId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
};

// Check if a movie is in favorites
export const isInFavorites = (movieId: number): boolean => {
  const favorites = getFavorites();
  return favorites.includes(movieId);
};

// Get all user ratings
export const getRatings = (): UserRating[] => {
  const ratings = localStorage.getItem(RATINGS_KEY);
  return ratings ? JSON.parse(ratings) : [];
};

// Get rating for a specific movie
export const getMovieRating = (movieId: number): number | null => {
  const ratings = getRatings();
  const movieRating = ratings.find(rating => rating.movieId === movieId);
  return movieRating ? movieRating.rating : null;
};

// Rate a movie
export const rateMovie = (movieId: number, rating: number): void => {
  const ratings = getRatings();
  const existingRatingIndex = ratings.findIndex(r => r.movieId === movieId);
  
  if (existingRatingIndex !== -1) {
    // Update existing rating
    ratings[existingRatingIndex].rating = rating;
  } else {
    // Add new rating
    ratings.push({ movieId, rating });
  }
  
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
};

// Get preferred genres
export const getPreferredGenres = (): number[] => {
  const genres = localStorage.getItem(PREFERRED_GENRES_KEY);
  return genres ? JSON.parse(genres) : [];
};

// Set preferred genres
export const setPreferredGenres = (genreIds: number[]): void => {
  localStorage.setItem(PREFERRED_GENRES_KEY, JSON.stringify(genreIds));
};

// Add a preferred genre
export const addPreferredGenre = (genreId: number): void => {
  const genres = getPreferredGenres();
  if (!genres.includes(genreId)) {
    genres.push(genreId);
    setPreferredGenres(genres);
  }
};

// Remove a preferred genre
export const removePreferredGenre = (genreId: number): void => {
  const genres = getPreferredGenres();
  const updatedGenres = genres.filter(id => id !== genreId);
  setPreferredGenres(updatedGenres);
};

// Get all user preferences in one call
export const getUserPreferences = (): UserPreferences => {
  return {
    favoriteMovies: getFavorites(),
    ratings: getRatings(),
    preferredGenres: getPreferredGenres()
  };
};
