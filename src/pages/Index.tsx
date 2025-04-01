
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/components/Hero';
import RecommendationList from '@/components/RecommendationList';
import GenreSelector from '@/components/GenreSelector';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useTrendingMovies, useGenreMovies, usePersonalizedRecommendations } from '@/hooks/useMovies';

const Index = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
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

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Integrated search section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Rechercher des films et séries</h2>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Titre, acteur, genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dark-800 border-dark-700 focus-visible:ring-cinema-600 w-full"
            />
            <Button type="submit" className="bg-cinema-600 hover:bg-cinema-700">
              <Search className="h-5 w-5 mr-2" />
              Rechercher
            </Button>
          </form>
        </div>
        
        <RecommendationList 
          title="Tendances" 
          movies={trendingMovies || []}
          isLoading={trendingLoading}
          error={trendingError as Error}
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
          <p className="text-center">© 2023 MovieSphere - Film & Series </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
