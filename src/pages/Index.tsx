
import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import RecommendationList from '@/components/RecommendationList';
import GenreSelector from '@/components/GenreSelector';
import Navbar from '@/components/Navbar';
import { getTrendingMovies, getRecentMovies, getMoviesByGenre } from '@/data/movies';

const Index = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [filteredMovies, setFilteredMovies] = useState(getRecentMovies());
  
  useEffect(() => {
    if (selectedGenre) {
      setFilteredMovies(getMoviesByGenre(selectedGenre));
    } else {
      setFilteredMovies(getRecentMovies());
    }
  }, [selectedGenre]);

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <RecommendationList 
          title="Trending Now" 
          movies={getTrendingMovies()} 
        />
        
        <GenreSelector 
          selectedGenre={selectedGenre} 
          onChange={setSelectedGenre} 
        />
        
        <RecommendationList 
          title={selectedGenre ? `${selectedGenre} Movies & Series` : "Recently Added"} 
          movies={filteredMovies}
          emptyMessage={`No ${selectedGenre} movies or series found`}
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

export default Index;
