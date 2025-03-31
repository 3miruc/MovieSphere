
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import GenreSelector from '@/components/GenreSelector';
import { Movie, searchMovies, getMoviesByGenre } from '@/data/movies';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [filteredResults, setFilteredResults] = useState<Movie[]>([]);

  useEffect(() => {
    if (query) {
      setResults(searchMovies(query));
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    if (selectedGenre) {
      setFilteredResults(results.filter(movie => 
        movie.genres.includes(selectedGenre)
      ));
    } else {
      setFilteredResults(results);
    }
  }, [selectedGenre, results]);

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            {query ? `Search results for "${query}"` : 'Browse all titles'}
          </h1>
          <p className="text-gray-400">
            {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found
          </p>
        </div>
        
        {results.length > 0 && (
          <GenreSelector 
            selectedGenre={selectedGenre} 
            onChange={setSelectedGenre} 
          />
        )}
        
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <SearchIcon className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              {query 
                ? `We couldn't find any titles matching "${query}"${selectedGenre ? ` with the genre ${selectedGenre}` : ''}.` 
                : 'Try searching for a movie or series title, genre, or keyword.'}
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
