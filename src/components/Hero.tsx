
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Movie, getTrendingMovies } from '@/data/movies';

const Hero = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const trendingMovies = getTrendingMovies();
    if (trendingMovies.length > 0) {
      // Get a movie with a backdrop image
      const moviesWithBackdrops = trendingMovies.filter(movie => movie.backdropUrl);
      setFeaturedMovie(moviesWithBackdrops.length > 0 ? 
        moviesWithBackdrops[0] : trendingMovies[0]);
    }
  }, []);

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
      <div className="absolute inset-0 dark-gradient"></div>

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
              {featuredMovie.type === 'movie' ? featuredMovie.duration : `${featuredMovie.seasons} Seasons`}
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
              <Play className="mr-2 h-5 w-5" /> More Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
