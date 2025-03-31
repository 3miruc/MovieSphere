
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Movie } from '@/data/movies';
import FavoriteButton from './FavoriteButton';
import { useRatings } from '@/hooks/useMovies';

interface MovieCardProps {
  movie: Movie;
  highlighted?: boolean;
}

const MovieCard = ({ movie, highlighted = false }: MovieCardProps) => {
  const { getMovieRating } = useRatings();
  const userRating = getMovieRating(movie.id);
  
  return (
    <Link to={`/details/${movie.id}`}>
      <Card className={`overflow-hidden bg-dark-800 border-dark-700 movie-card-hover ${highlighted ? 'border-cinema-600 shadow-lg shadow-cinema-900/20' : ''}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={movie.posterUrl}
            alt={movie.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-2 left-2 flex items-center space-x-1 bg-dark-900/80 backdrop-blur-sm text-white rounded px-2 py-1">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-semibold">{movie.rating.toFixed(1)}</span>
          </div>
          {userRating && (
            <div className="absolute top-2 right-2 flex items-center space-x-1 bg-dark-900/80 backdrop-blur-sm text-white rounded px-2 py-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-sm font-semibold">{userRating}/10</span>
            </div>
          )}
          {movie.type === 'series' && (
            <Badge variant="default" className="absolute bottom-2 right-2 bg-cinema-600 text-white">
              Série
            </Badge>
          )}
          <div className="absolute bottom-2 left-2">
            <FavoriteButton movieId={movie.id} className="h-8 w-8" />
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-bold text-md line-clamp-1">{movie.title}</h3>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-400">
              {movie.year} • {movie.type === 'movie' ? movie.duration : `${movie.seasons || '?'} Saisons`}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs bg-dark-700 border-dark-600">
                {genre}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;
