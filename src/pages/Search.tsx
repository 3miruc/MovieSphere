
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import GenreSelector from '@/components/GenreSelector';
import AdvancedSearch from '@/components/AdvancedSearch';
import { useSearchMovies } from '@/hooks/useMovies';
import { Skeleton } from '@/components/ui/skeleton';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const year = searchParams.get('year');
  const yearFrom = searchParams.get('yearFrom');
  const yearTo = searchParams.get('yearTo');
  
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Use the custom hook for search
  const { data: searchResults, isLoading } = useSearchMovies(query);
  
  // Filter by year and genre
  const filteredResults = searchResults?.filter(movie => {
    // Year filter
    if (year && movie.year !== parseInt(year)) {
      return false;
    }
    
    if (yearFrom && movie.year < parseInt(yearFrom)) {
      return false;
    }
    
    if (yearTo && movie.year > parseInt(yearTo)) {
      return false;
    }
    
    // Genre filter
    if (selectedGenre && !movie.genres.includes(selectedGenre)) {
      return false;
    }
    
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {query ? `Recherche pour "${query}"` : 'Explorer les titres'}
              {year && ` (${year})`}
              {yearFrom && yearTo && ` (${yearFrom}-${yearTo})`}
            </h1>
            {!isLoading && (
              <p className="text-gray-400">
                {filteredResults.length} {filteredResults.length === 1 ? 'résultat' : 'résultats'} trouvé{filteredResults.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          <AdvancedSearch />
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="aspect-[2/3] rounded-md" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : searchResults && searchResults.length > 0 ? (
          <>
            <GenreSelector 
              selectedGenre={selectedGenre} 
              onChange={setSelectedGenre} 
            />
            
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {filteredResults.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Calendar className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Aucun résultat pour ces filtres</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Essayez de modifier les filtres d'année ou de genre pour trouver plus de résultats.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <SearchIcon className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              {query 
                ? `Nous n'avons pas trouvé de titres correspondant à "${query}"${selectedGenre ? ` dans le genre ${selectedGenre}` : ''}.` 
                : 'Essayez de chercher un titre de film ou série, un genre ou un mot-clé.'}
            </p>
          </div>
        )}
      </main>
      
      <footer className="bg-dark-800 text-gray-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center">© 2023 CineFellow - Film & Series Recommendations</p>
        </div>
      </footer>
    </div>
  );
};

export default Search;
