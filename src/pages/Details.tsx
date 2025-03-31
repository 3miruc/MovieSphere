
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RecommendationList from '@/components/RecommendationList';
import RatingSelector from '@/components/RatingSelector';
import FavoriteButton from '@/components/FavoriteButton';
import { useMovieDetails, useRecommendations, useRatings } from '@/hooks/useMovies';
import { Skeleton } from '@/components/ui/skeleton';

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = parseInt(id || '0');
  
  // State to track if we're viewing a movie or TV show
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  
  // Get user's existing rating
  const { getMovieRating, rateMovie } = useRatings();
  const [userRating, setUserRating] = useState<number | null>(null);
  
  // Fetch movie details
  const { data: movie, isLoading, error } = useMovieDetails(movieId, mediaType);
  
  // Fetch recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useRecommendations(movieId, mediaType);
  
  // If movie not found as a movie, try as a TV show
  useEffect(() => {
    if (error && mediaType === 'movie') {
      setMediaType('tv');
    }
  }, [error, mediaType]);
  
  // Load user rating when movie loads
  useEffect(() => {
    if (movie) {
      const rating = getMovieRating(movie.id);
      setUserRating(rating);
    }
  }, [movie, getMovieRating]);
  
  // Handle rating change
  const handleRatingChange = (rating: number) => {
    if (movie) {
      rateMovie(movie.id, rating);
      setUserRating(rating);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <Navbar />
        <div className="relative h-[50vh] w-full bg-dark-800 animate-pulse"></div>
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            </div>
            <div className="md:w-2/3 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="h-32" />
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (!movie && !isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Film ou série non trouvé</h1>
          <p className="text-gray-400 mb-8">Le film ou la série que vous recherchez n'existe pas.</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </main>
      </div>
    );
  }
  
  if (!movie) return null;
  
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />
      
      {/* Backdrop */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        {movie.backdropUrl ? (
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-dark-800"></div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent"></div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <Button 
          variant="outline" 
          className="mb-6 bg-dark-800/60 backdrop-blur-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full rounded-lg shadow-xl"
            />
            
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-dark-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Votre évaluation</h3>
                <RatingSelector value={userRating} onChange={handleRatingChange} />
              </div>
              
              <div className="flex flex-col gap-2">
                <FavoriteButton movieId={movie.id} variant="button" className="w-full" />
              </div>
            </div>
          </div>
          
          {/* Details */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
            
            <div className="flex items-center flex-wrap gap-2 mb-4">
              <div className="flex items-center bg-dark-800 px-3 py-1 rounded">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span>{movie.rating.toFixed(1)}</span>
              </div>
              
              <span className="bg-dark-800 px-3 py-1 rounded">{movie.year}</span>
              
              {movie.type === 'movie' ? (
                <span className="bg-dark-800 px-3 py-1 rounded">{movie.duration}</span>
              ) : (
                <span className="bg-dark-800 px-3 py-1 rounded">{movie.seasons} Saisons</span>
              )}
              
              <Badge className="bg-cinema-600 text-white">
                {movie.type === 'movie' ? 'Film' : 'Série'}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map(genre => (
                <Badge key={genre} variant="outline" className="bg-dark-800 border-dark-700">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">
                {movie.description || "Aucune description disponible."}
              </p>
            </div>
            
            {/* Recommendations */}
            <RecommendationList
              title="Vous pourriez aimer"
              movies={recommendations || []}
              isLoading={recommendationsLoading}
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-dark-800 text-gray-400 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center">© 2023 CineFellow - Film & Series Recommendations</p>
        </div>
      </footer>
    </div>
  );
};

export default Details;
