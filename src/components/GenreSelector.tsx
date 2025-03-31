
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchGenresMap } from '@/services/tmdb';
import { Skeleton } from './ui/skeleton';

interface GenreSelectorProps {
  selectedGenre: string | null;
  onChange: (genre: string | null, genreId: number | null) => void;
}

const GenreSelector = ({ selectedGenre, onChange }: GenreSelectorProps) => {
  const [viewAll, setViewAll] = useState(false);
  
  // Fetch all genres from TMDB
  const { data: genresMap, isLoading } = useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenresMap,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  
  const genres = genresMap ? Object.entries(genresMap).map(([id, name]) => ({
    id: parseInt(id),
    name
  })) : [];
  
  // Sort genres alphabetically
  const sortedGenres = [...genres].sort((a, b) => a.name.localeCompare(b.name));
  
  // Display a limited number of genres unless viewAll is true
  const displayedGenres = viewAll ? sortedGenres : sortedGenres.slice(0, 8);
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Parcourir par genre</h2>
        {sortedGenres.length > 8 && (
          <Button 
            variant="link" 
            className="text-cinema-400 hover:text-cinema-300"
            onClick={() => setViewAll(!viewAll)}
          >
            {viewAll ? 'Voir moins' : 'Voir tous'}
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex flex-wrap gap-2">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} className="h-10 w-20" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button
            key="all"
            variant={selectedGenre === null ? "default" : "outline"}
            onClick={() => onChange(null, null)}
            className={selectedGenre === null ? "bg-cinema-600 hover:bg-cinema-700 text-white" : "bg-dark-700 hover:bg-dark-600 text-gray-300 border-dark-600"}
          >
            Tous
          </Button>
          
          {displayedGenres.map((genre) => (
            <Button
              key={genre.id}
              variant={selectedGenre === genre.name ? "default" : "outline"}
              onClick={() => onChange(genre.name, genre.id)}
              className={selectedGenre === genre.name ? "bg-cinema-600 hover:bg-cinema-700 text-white" : "bg-dark-700 hover:bg-dark-600 text-gray-300 border-dark-600"}
            >
              {genre.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreSelector;
