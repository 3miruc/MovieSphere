
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { genres } from '@/data/movies';

interface GenreSelectorProps {
  selectedGenre: string | null;
  onChange: (genre: string | null) => void;
}

const GenreSelector = ({ selectedGenre, onChange }: GenreSelectorProps) => {
  const [viewAll, setViewAll] = useState(false);
  
  const displayedGenres = viewAll ? genres : genres.slice(0, 8);
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Browse by Genre</h2>
        <Button 
          variant="link" 
          className="text-cinema-400 hover:text-cinema-300"
          onClick={() => setViewAll(!viewAll)}
        >
          {viewAll ? 'Show Less' : 'View All'}
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          key="all"
          variant={selectedGenre === null ? "default" : "outline"}
          onClick={() => onChange(null)}
          className={selectedGenre === null ? "bg-cinema-600 hover:bg-cinema-700 text-white" : "bg-dark-700 hover:bg-dark-600 text-gray-300 border-dark-600"}
        >
          All
        </Button>
        
        {displayedGenres.map((genre) => (
          <Button
            key={genre}
            variant={selectedGenre === genre ? "default" : "outline"}
            onClick={() => onChange(genre)}
            className={selectedGenre === genre ? "bg-cinema-600 hover:bg-cinema-700 text-white" : "bg-dark-700 hover:bg-dark-600 text-gray-300 border-dark-600"}
          >
            {genre}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GenreSelector;
