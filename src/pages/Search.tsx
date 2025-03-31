
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Calendar, Film } from 'lucide-react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import GenreSelector from '@/components/GenreSelector';
import AdvancedSearch from '@/components/AdvancedSearch';
import CastSection from '@/components/CastSection';
import { useSearchMovies, useSearchByYearRange, useSearchByYear } from '@/hooks/useMovies';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const year = searchParams.get('year');
  const yearFrom = searchParams.get('yearFrom');
  const yearTo = searchParams.get('yearTo');
  
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [expandedMovie, setExpandedMovie] = useState<number | null>(null);

  // Use the custom hook for search by query
  const { data: searchResults, isLoading: isLoadingSearch } = useSearchMovies(query);
  
  // Use the custom hook for search by year range
  const yearFromNum = yearFrom ? parseInt(yearFrom) : 0;
  const yearToNum = yearTo ? parseInt(yearTo) : 0;
  const { data: yearRangeResults, isLoading: isLoadingYearRange } = 
    useSearchByYearRange(yearFromNum, yearToNum);
  
  // Use the custom hook for search by specific year
  const yearNum = year ? parseInt(year) : 0;
  const { data: yearResults, isLoading: isLoadingYear } = useSearchByYear(yearNum);
  
  // Determine which results to show based on available parameters
  const showingYearRangeResults = yearFrom && yearTo && !query && !year;
  const showingYearResults = year && !query && !yearFrom && !yearTo;
  
  let results;
  let isLoading;
  
  if (showingYearResults) {
    results = yearResults;
    isLoading = isLoadingYear;
  } else if (showingYearRangeResults) {
    results = yearRangeResults;
    isLoading = isLoadingYearRange;
  } else {
    results = searchResults;
    isLoading = isLoadingSearch;
  }
  
  // Filter by genre
  const filteredResults = results?.filter(movie => {
    // Genre filter
    if (selectedGenre && !movie.genres.includes(selectedGenre)) {
      return false;
    }
    
    return true;
  }) || [];

  // Toggle expanded details
  const toggleExpandedMovie = (id: number) => {
    if (expandedMovie === id) {
      setExpandedMovie(null);
    } else {
      setExpandedMovie(id);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {query ? `Recherche pour "${query}"` : 
                (showingYearRangeResults ? `Films et séries entre ${yearFrom} et ${yearTo}` : 
                  (showingYearResults ? `Films et séries de ${year}` : 'Explorer les titres'))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="aspect-[2/3] rounded-md" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : results && results.length > 0 ? (
          <>
            <GenreSelector 
              selectedGenre={selectedGenre} 
              onChange={setSelectedGenre} 
            />
            
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredResults.map((movie) => (
                  <div key={movie.id} className="flex flex-col">
                    <div onClick={() => toggleExpandedMovie(movie.id)} className="cursor-pointer">
                      <MovieCard movie={movie} />
                    </div>
                    
                    {expandedMovie === movie.id && (
                      <Card className="mt-2 bg-dark-800 border-dark-700">
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
                          
                          <div className="mb-3">
                            <Badge variant="outline" className="mr-2 bg-dark-700">
                              {movie.type === 'movie' ? 'Film' : 'Série'}
                            </Badge>
                            <Badge variant="outline" className="bg-dark-700">
                              {movie.year}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-300 mb-4 line-clamp-3">{movie.description}</p>
                          
                          <div className="mt-3">
                            <h4 className="text-sm font-semibold mb-2">Acteurs principaux</h4>
                            <CastSection movieId={movie.id} type={movie.type === 'movie' ? 'movie' : 'tv'} />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
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
              {showingYearResults 
                ? `Nous n'avons pas trouvé de titres pour l'année ${year}${selectedGenre ? ` dans le genre ${selectedGenre}` : ''}.`
                : showingYearRangeResults
                  ? `Nous n'avons pas trouvé de titres entre ${yearFrom} et ${yearTo}${selectedGenre ? ` dans le genre ${selectedGenre}` : ''}.`
                  : query 
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
