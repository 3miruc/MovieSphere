
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Film, Tv, ChevronRight, TrendingUp, Star, Sparkles } from 'lucide-react';
import Navbar from '../common/Navbar';
import MediaCard from '../ui/MediaCard';
import { 
  fetchTrending, 
  fetchPopular, 
  fetchTopRated,
  getGenreById,
  type MediaBasic
} from '../../services/tmdb';

const HomePage: React.FC = () => {
  // Récupération des médias tendance
  const { data: trendingData, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['trendingMedia'],
    queryFn: () => fetchTrending('week'),
  });

  // Récupération des films populaires
  const { data: popularMoviesData, isLoading: isMoviesLoading } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: () => fetchPopular('movie'),
  });

  // Récupération des séries populaires
  const { data: popularTvData, isLoading: isTvLoading } = useQuery({
    queryKey: ['popularTv'],
    queryFn: () => fetchPopular('tv'),
  });

  // Récupération des médias les mieux notés
  const { data: topRatedData, isLoading: isTopRatedLoading } = useQuery({
    queryKey: ['topRatedMedia'],
    queryFn: async () => {
      const [moviesData, tvData] = await Promise.all([
        fetchTopRated('movie'),
        fetchTopRated('tv')
      ]);
      // Fusionner et mélanger les résultats
      const combined = [...moviesData.results, ...tvData.results];
      return {
        results: combined.sort(() => 0.5 - Math.random()).slice(0, 10),
        total_results: combined.length
      };
    },
  });

  // Sélectionner un film ou une série aléatoire pour le héros
  const heroMedia = React.useMemo(() => {
    if (trendingData?.results && trendingData.results.length > 0) {
      // Sélectionner un média avec une image de fond
      const mediaWithBackdrop = trendingData.results.filter(m => m.backdrop_path);
      if (mediaWithBackdrop.length > 0) {
        return mediaWithBackdrop[Math.floor(Math.random() * mediaWithBackdrop.length)];
      }
    }
    return null;
  }, [trendingData]);

  // Fonction pour mélanger les médias
  const shuffleMedia = (media: MediaBasic[] = []): MediaBasic[] => {
    return [...media].sort(() => 0.5 - Math.random()).slice(0, 5);
  };

  // Médias aléatoires pour chaque section
  const randomTrending = React.useMemo(() => 
    shuffleMedia(trendingData?.results), [trendingData]);
  
  const randomMovies = React.useMemo(() => 
    shuffleMedia(popularMoviesData?.results), [popularMoviesData]);
  
  const randomTvShows = React.useMemo(() => 
    shuffleMedia(popularTvData?.results), [popularTvData]);
  
  const topRatedMedia = React.useMemo(() => 
    topRatedData?.results || [], [topRatedData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      {/* Hero Section */}
      {heroMedia && (
        <div className="relative h-[70vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMedia.backdrop_path})`, 
              filter: 'brightness(0.4)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-90"></div>
          
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <span className="text-purple-400 font-medium">Trending cette semaine</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-3">
                {heroMedia.title || heroMedia.name}
              </h1>
              <p className="text-gray-300 mb-6 line-clamp-3">
                {heroMedia.overview || "Aucune description disponible"}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to={`/${heroMedia.media_type}/${heroMedia.id}`}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Découvrir</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Section de découverte */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-purple-400" />
              <h2 className="text-2xl font-bold">Découvrir au hasard</h2>
            </div>
            <Link to="/search" className="flex items-center gap-1 text-purple-400 hover:text-purple-300">
              <span>Voir plus</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {isTrendingLoading ? (
              // Squelettes de chargement
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))
            ) : randomTrending?.map((media) => (
              <MediaCard 
                key={`trending-${media.id}`} 
                media={media} 
                genreNames={[]} 
                onToggleFavorite={() => {}} 
              />
            ))}
          </div>
        </div>
        
        {/* Films populaires */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Film className="h-7 w-7 text-purple-400" />
              <h2 className="text-2xl font-bold">Films à découvrir</h2>
            </div>
            <Link to="/movies" className="flex items-center gap-1 text-purple-400 hover:text-purple-300">
              <span>Tous les films</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {isMoviesLoading ? (
              // Squelettes de chargement
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))
            ) : randomMovies?.map((movie) => (
              <MediaCard 
                key={`movie-${movie.id}`} 
                media={movie} 
                genreNames={[]} 
                onToggleFavorite={() => {}} 
              />
            ))}
          </div>
        </div>
        
        {/* Séries populaires */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Tv className="h-7 w-7 text-purple-400" />
              <h2 className="text-2xl font-bold">Séries à découvrir</h2>
            </div>
            <Link to="/tv" className="flex items-center gap-1 text-purple-400 hover:text-purple-300">
              <span>Toutes les séries</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {isTvLoading ? (
              // Squelettes de chargement
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))
            ) : randomTvShows?.map((tvShow) => (
              <MediaCard 
                key={`tv-${tvShow.id}`} 
                media={tvShow} 
                genreNames={[]} 
                onToggleFavorite={() => {}} 
              />
            ))}
          </div>
        </div>
        
        {/* Les mieux notés */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Star className="h-7 w-7 text-purple-400" />
              <h2 className="text-2xl font-bold">Les mieux notés</h2>
            </div>
            <Link to="/search" className="flex items-center gap-1 text-purple-400 hover:text-purple-300">
              <span>Voir plus</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {isTopRatedLoading ? (
              // Squelettes de chargement
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))
            ) : topRatedMedia?.map((media) => (
              <MediaCard 
                key={`top-${media.id}`} 
                media={media} 
                genreNames={[]} 
                onToggleFavorite={() => {}} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
