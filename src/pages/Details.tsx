
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useMovieDetails, useRecommendations } from '@/hooks/useMovies';
import MovieCard from '@/components/MovieCard';
import FavoriteButton from '@/components/FavoriteButton';
import RatingSelector from '@/components/RatingSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRatings } from '@/hooks/useMovies';
import CastSection from '@/components/CastSection';
import TrailerSection from '@/components/TrailerSection';
import StreamingPlatforms from '@/components/StreamingPlatforms';
import ReviewSection from '@/components/ReviewSection';

const Details = () => {
  const { id } = useParams();
  const movieId = parseInt(id || '0');
  
  // We don't know if it's a movie or TV show, try both
  let type: 'movie' | 'tv' = 'movie';
  
  // First try as a movie
  const { data: movieData, isLoading: isMovieLoading } = useMovieDetails(movieId, 'movie');
  
  // If it's not a movie, try as a TV show
  const { data: tvData, isLoading: isTvLoading } = useMovieDetails(movieId, 'tv');
  
  // Once we have data, determine the type
  if (movieData) {
    type = 'movie';
  } else if (tvData) {
    type = 'tv';
  }
  
  const data = movieData || tvData;
  const isLoading = isMovieLoading || isTvLoading;
  
  // Get recommendations
  const { data: recommendations, isLoading: isRecommendationsLoading } = useRecommendations(movieId, type);
  
  // Get user rating
  const { getMovieRating, rateMovie } = useRatings();
  const userRating = getMovieRating(movieId);
  
  const handleRating = (rating: number) => {
    rateMovie(movieId, rating);
  };
  
  // Format release date
  const formatReleaseDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />
      
      {isLoading ? (
        <div className="animate-pulse">
          {/* Hero skeleton */}
          <div className="h-[70vh] bg-dark-800 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
            <div className="container mx-auto px-4 pt-40">
              <Skeleton className="h-10 w-2/3 max-w-xl mb-6" />
              <Skeleton className="h-6 w-1/3 max-w-xs mb-4" />
              <div className="flex gap-4 mb-6">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
              <Skeleton className="h-24 w-full max-w-2xl" />
            </div>
          </div>
          
          {/* Details skeleton */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-36 w-full" />
                
                <Skeleton className="h-8 w-40" />
                <div className="flex gap-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-20" />
                  ))}
                </div>
              </div>
              
              <div className="space-y-8">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-48 w-full" />
                
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
      ) : data ? (
        <>
          {/* Hero section with backdrop */}
          <div 
            className="relative h-[70vh] bg-cover bg-center"
            style={{
              backgroundImage: data.backdropUrl 
                ? `url(${data.backdropUrl})` 
                : undefined,
              backgroundColor: !data.backdropUrl ? '#1a1a1a' : undefined
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-dark-900/20" />
            
            <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-16">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{data.title}</h1>
                
                <div className="flex items-center flex-wrap gap-2 mb-4">
                  <span className="text-gray-300">{data.year}</span>
                  <span className="text-gray-500">•</span>
                  {data.type === 'movie' ? (
                    <span className="text-gray-300">{data.duration}</span>
                  ) : (
                    <span className="text-gray-300">{data.seasons} saisons</span>
                  )}
                  <span className="text-gray-500">•</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 font-bold mr-1">{data.rating.toFixed(1)}</span>
                    <span className="text-gray-400">/10</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {data.genres.map((genre) => (
                    <Badge key={genre} variant="outline" className="border-dark-600">
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-gray-200 text-lg mb-6">{data.description}</p>
                
                <div className="flex flex-wrap gap-3">
                  <FavoriteButton movieId={data.id} variant="button" />
                  <TrailerSection movieId={data.id} type={type} title={data.title} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Detailed content */}
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-10">
                <CastSection movieId={data.id} type={type} />
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Votre Note</h3>
                  <RatingSelector 
                    value={userRating} 
                    onChange={handleRating} 
                  />
                </div>
                
                <ReviewSection movieId={data.id} />
                
                {!isRecommendationsLoading && recommendations && recommendations.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Recommandations</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {recommendations.slice(0, 4).map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Informations</h3>
                  <div className="bg-dark-800 rounded-lg p-6 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">
                        {data.type === 'movie' ? 'Date de sortie' : 'Première diffusion'}
                      </h4>
                      <p>{formatReleaseDate(data.year.toString())}</p>
                    </div>
                    
                    {data.type === 'movie' && data.duration && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Durée</h4>
                        <p>{data.duration}</p>
                      </div>
                    )}
                    
                    {data.type === 'series' && data.seasons && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Saisons</h4>
                        <p>{data.seasons}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Genres</h4>
                      <div className="flex flex-wrap gap-2">
                        {data.genres.map((genre) => (
                          <Link 
                            key={genre} 
                            to={`/search?q=${encodeURIComponent(genre)}`}
                            className="text-sm hover:text-cinema-400 transition-colors"
                          >
                            {genre}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <StreamingPlatforms movieId={data.id} type={type} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Film ou série non trouvé</h1>
          <p className="text-gray-400 mb-8">Le contenu que vous recherchez n'existe pas ou n'est plus disponible.</p>
          <Link to="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Details;
