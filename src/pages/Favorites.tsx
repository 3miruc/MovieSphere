
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { Movie } from '@/data/movies';
import { getFavorites } from '@/services/userPreferences';
import { fetchMediaDetails } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Favorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Reload favorites when the component mounts
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);
  
  // Fetch details for all favorite movies
  const { data: favoriteMovies, isLoading } = useQuery({
    queryKey: ['favorites', favorites],
    queryFn: async () => {
      if (favorites.length === 0) return [];
      
      // Try to fetch each favorite, some might fail if they're no longer available
      const moviesPromises = favorites.map(async (id) => {
        try {
          // Try as movie first
          const movie = await fetchMediaDetails(id, 'movie');
          if (movie) return movie;
          
          // Try as TV if movie fails
          return await fetchMediaDetails(id, 'tv');
        } catch (e) {
          console.error(`Error fetching movie ${id}:`, e);
          return null;
        }
      });
      
      const results = await Promise.all(moviesPromises);
      return results.filter(Boolean) as Movie[];
    },
    enabled: favorites.length > 0,
  });
  
  const movies = favoriteMovies?.filter(movie => movie.type === 'movie') || [];
  const series = favoriteMovies?.filter(movie => movie.type === 'series') || [];
  
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Mes Favoris</h1>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-8">
            <TabsTrigger value="all">Tous ({favoriteMovies?.length || 0})</TabsTrigger>
            <TabsTrigger value="movies">Films ({movies.length})</TabsTrigger>
            <TabsTrigger value="series">Séries ({series.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="aspect-[2/3] bg-dark-700 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : favoriteMovies && favoriteMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {favoriteMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-xl font-semibold mb-2">Aucun favori</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Vous n'avez pas encore ajouté de films ou séries à vos favoris.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="movies">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="aspect-[2/3] bg-dark-700 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : movies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-xl font-semibold mb-2">Aucun film en favori</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Vous n'avez pas encore ajouté de films à vos favoris.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="series">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="aspect-[2/3] bg-dark-700 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : series.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {series.map((series) => (
                  <MovieCard key={series.id} movie={series} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-xl font-semibold mb-2">Aucune série en favori</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Vous n'avez pas encore ajouté de séries à vos favoris.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-dark-800 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center">© 2023 CineFellow - Film & Series Recommendations</p>
        </div>
      </footer>
    </div>
  );
};

export default Favorites;
