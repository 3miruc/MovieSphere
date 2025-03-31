
import { useState } from 'react';
import Hero from '@/components/Hero';
import RecommendationList from '@/components/RecommendationList';
import GenreSelector from '@/components/GenreSelector';
import Navbar from '@/components/Navbar';
import { useTrendingMovies, useGenreMovies, usePersonalizedRecommendations } from '@/hooks/useMovies';

const Index = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  
  // Fetch trending movies using TMDB API
  const { data: trendingMovies, isLoading: trendingLoading, error: trendingError } = useTrendingMovies();
  
  // Fetch personalized recommendations
  const { data: personalizedMovies, isLoading: personalizedLoading, error: personalizedError } = usePersonalizedRecommendations();
  
  // Fetch genre-specific movies if a genre is selected
  const { data: genreMovies, isLoading: genreLoading, error: genreError } = useGenreMovies(
    selectedGenreId || 0
  );
  
  // Handle genre selection
  const handleGenreChange = (genre: string | null, genreId: number | null) => {
    setSelectedGenre(genre);
    setSelectedGenreId(genreId);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <RecommendationList 
          title="Tendances" 
          movies={trendingMovies || []}
          isLoading={trendingLoading}
          error={trendingError as Error}
        />
        
        <RecommendationList 
          title="Recommandé pour vous" 
          movies={personalizedMovies || []}
          isLoading={personalizedLoading}
          error={personalizedError as Error}
          emptyMessage="Ajoutez des films à vos favoris pour obtenir des recommandations personnalisées"
        />
        
        <GenreSelector 
          selectedGenre={selectedGenre} 
          onChange={handleGenreChange} 
        />
        
        {selectedGenre && (
          <RecommendationList 
            title={`${selectedGenre}`} 
            movies={genreMovies || []}
            isLoading={genreLoading}
            error={genreError as Error}
            emptyMessage={`Aucun film ou série trouvé dans le genre ${selectedGenre}`}
          />
        )}
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
