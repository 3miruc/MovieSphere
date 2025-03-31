
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Play, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import RecommendationList from '@/components/RecommendationList';
import { Movie, getMovieById, getRecommendedMovies } from '@/data/movies';

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const movieId = parseInt(id, 10);
      const foundMovie = getMovieById(movieId);
      
      if (foundMovie) {
        setMovie(foundMovie);
        setRecommendations(getRecommendedMovies(foundMovie));
      }
    }
  }, [id]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold">Movie not found</h1>
          <Button 
            className="mt-6"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />
      
      <div className="relative bg-dark-800">
        {/* Backdrop image with gradient overlay */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src={movie.backdropUrl || movie.posterUrl} 
            alt={movie.title}
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="absolute inset-0 dark-gradient"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 text-gray-300 hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4 md:self-start">
              <div className="aspect-[2/3] bg-dark-700 rounded-lg overflow-hidden shadow-xl">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Details */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="text-white font-semibold">{movie.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-300">{movie.year}</span>
                <span className="text-gray-300">
                  {movie.type === 'movie' ? movie.duration : `${movie.seasons} Seasons`}
                </span>
                <Badge variant="outline" className="bg-cinema-600/20 text-cinema-300 border-cinema-700">
                  {movie.type === 'movie' ? 'Movie' : 'Series'}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map(genre => (
                  <Badge key={genre} variant="secondary" className="bg-dark-700 border-none">
                    {genre}
                  </Badge>
                ))}
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-gray-300 leading-relaxed">
                  {movie.description}
                </p>
              </div>
              
              <Button className="bg-cinema-600 hover:bg-cinema-700">
                <Play className="mr-2 h-4 w-4" /> Watch Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <RecommendationList 
          title="You May Also Like" 
          movies={recommendations}
          emptyMessage="No similar recommendations found" 
        />
      </main>
      
      <footer className="bg-dark-800 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center">© 2023 CineFellow - Film & Series Recommendations</p>
        </div>
      </footer>
    </div>
  );
};

export default Details;
