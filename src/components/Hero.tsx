
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTrendingMovies } from '@/hooks/useMovies';
import { Skeleton } from './ui/skeleton';

const Hero = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();
  
  // Fetch trending movies using TMDB API
  const { data: trendingMovies, isLoading } = useTrendingMovies();
  
  useEffect(() => {
    if (trendingMovies && trendingMovies.length > 0) {
      // Get a movie with a backdrop image
      const moviesWithBackdrops = trendingMovies.filter(movie => movie.backdropUrl);
      // Randomly select one to feature
      const randomIndex = Math.floor(Math.random() * Math.min(3, moviesWithBackdrops.length));
      setFeaturedMovie(moviesWithBackdrops.length > 0 ? 
        moviesWithBackdrops[randomIndex] : trendingMovies[0]);
    }
  }, [trendingMovies]);

  if (isLoading) {
    return (
      <div className="relative h-[70vh] w-full max-h-[600px] bg-dark-800 animate-pulse">
        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
          <div className="max-w-3xl">
            <Skeleton className="h-12 w-2/3 mb-3" />
            <Skeleton className="h-4 w-1/3 mb-4" />
            <Skeleton className="h-20 w-full mb-6" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!featuredMovie) {
    return null;
  }

  return (
    <div className="relative h-[70vh] w-full max-h-[600px] overflow-hidden">
      {/* Backdrop image */}
      <img
        src={featuredMovie.backdropUrl || featuredMovie.posterUrl}
        alt={featuredMovie.title}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-dark-900/30"></div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">{featuredMovie.title}</h1>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="text-white">{featuredMovie.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-300">{featuredMovie.year}</span>
            <span className="text-gray-300">
              {featuredMovie.type === 'movie' ? featuredMovie.duration : `${featuredMovie.seasons} Saisons`}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {featuredMovie.genres.map(genre => (
              <Badge key={genre} variant="secondary" className="bg-dark-700/80 backdrop-blur-sm border-none">
                {genre}
              </Badge>
            ))}
          </div>
          
          <p className="text-gray-200 mb-6 line-clamp-2 md:line-clamp-3 max-w-xl">
            {featuredMovie.description}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-cinema-600 hover:bg-cinema-700"
              onClick={() => navigate(`/details/${featuredMovie.id}`)}
            >
              <Play className="mr-2 h-5 w-5" /> Détails
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
