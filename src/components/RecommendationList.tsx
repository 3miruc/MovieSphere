
import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import { Movie } from '@/data/movies';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface RecommendationListProps {
  title: string;
  movies: Movie[];
  emptyMessage?: string;
  isLoading?: boolean;
  error?: Error | null;
  showAll?: boolean;
  onShowAll?: () => void;
}

const RecommendationList = ({
  title,
  movies,
  emptyMessage = "Aucune recommandation trouvée",
  isLoading = false,
  error = null,
  showAll = false,
  onShowAll
}: RecommendationListProps) => {
  const [displayMovies, setDisplayMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (movies) {
      setDisplayMovies(showAll ? movies : movies.slice(0, 8));
    }
  }, [movies, showAll]);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {onShowAll && movies.length > 8 && !showAll && (
          <Button
            variant="link"
            className="text-cinema-400 hover:text-cinema-300"
            onClick={onShowAll}
          >
            Voir tout <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="aspect-[2/3] bg-dark-700 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <p className="text-red-400">Erreur lors du chargement des recommandations</p>
        </div>
      ) : displayMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {displayMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationList;
