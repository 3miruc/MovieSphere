
import { useQuery } from '@tanstack/react-query';
import { Movie } from '@/data/movies';
import * as tmdbService from '@/services/tmdb';
import * as userService from '@/services/userPreferences';
import { toast } from 'sonner';

export function useTrendingMovies() {
  return useQuery({
    queryKey: ['trending'],
    queryFn: tmdbService.fetchTrending,
    staleTime: 1000 * 60 * 10, // 10 minutes
    onError: () => {
      toast.error('Impossible de récupérer les films tendance');
    }
  });
}

export function useMovieDetails(id: number, type: 'movie' | 'tv') {
  return useQuery({
    queryKey: ['movie', id, type],
    queryFn: () => tmdbService.fetchMediaDetails(id, type),
    staleTime: 1000 * 60 * 30, // 30 minutes
    onError: () => {
      toast.error('Impossible de récupérer les détails du média');
    }
  });
}

export function useSearchMovies(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => tmdbService.searchMedia(query),
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: () => {
      toast.error('Erreur lors de la recherche');
    }
  });
}

export function useGenreMovies(genreId: number) {
  return useQuery({
    queryKey: ['genre', genreId],
    queryFn: () => tmdbService.fetchMediaByGenre(genreId),
    staleTime: 1000 * 60 * 15, // 15 minutes
    onError: () => {
      toast.error('Impossible de récupérer les médias par genre');
    }
  });
}

export function useRecommendations(id: number, type: 'movie' | 'tv') {
  return useQuery({
    queryKey: ['recommendations', id, type],
    queryFn: () => tmdbService.fetchRecommendations(id, type),
    staleTime: 1000 * 60 * 15, // 15 minutes
    onError: () => {
      toast.error('Impossible de récupérer les recommandations');
    }
  });
}

export function usePersonalizedRecommendations() {
  const { preferredGenres, favoriteMovies } = userService.getUserPreferences();
  
  return useQuery({
    queryKey: ['personalized', preferredGenres, favoriteMovies],
    queryFn: () => tmdbService.getPersonalizedRecommendations(preferredGenres, favoriteMovies),
    staleTime: 1000 * 60 * 10, // 10 minutes
    onError: () => {
      toast.error('Impossible de récupérer les recommandations personnalisées');
    }
  });
}

// Hook to manage favorites
export function useFavorites() {
  const favorites = userService.getFavorites();
  
  const addFavorite = (movieId: number) => {
    userService.addToFavorites(movieId);
    toast.success('Ajouté aux favoris');
  };
  
  const removeFavorite = (movieId: number) => {
    userService.removeFromFavorites(movieId);
    toast.success('Retiré des favoris');
  };
  
  const isFavorite = (movieId: number) => {
    return userService.isInFavorites(movieId);
  };
  
  return { favorites, addFavorite, removeFavorite, isFavorite };
}

// Hook to manage ratings
export function useRatings() {
  const ratings = userService.getRatings();
  
  const rateMovie = (movieId: number, rating: number) => {
    userService.rateMovie(movieId, rating);
    toast.success('Notation enregistrée');
  };
  
  const getMovieRating = (movieId: number) => {
    return userService.getMovieRating(movieId);
  };
  
  return { ratings, rateMovie, getMovieRating };
}
