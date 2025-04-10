
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, X, ChevronDown, Calendar, Film, Tv, Tag } from 'lucide-react';
import Navbar from '../common/Navbar';
import MediaCard from '../ui/MediaCard';
import { fetchGenres, searchMulti, discoverMedia, type MediaBasic, type Genre } from '../../services/tmdb';

const SearchPage: React.FC = () => {
  // État pour les termes de recherche et les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1900, new Date().getFullYear()]);
  const [mediaType, setMediaType] = useState<'movie' | 'tv' | 'all'>('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Effet pour débouncer le terme de recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Récupération des genres pour les filtres
  const { data: movieGenres = [] } = useQuery({
    queryKey: ['movieGenres'],
    queryFn: () => fetchGenres('movie'),
  });

  const { data: tvGenres = [] } = useQuery({
    queryKey: ['tvGenres'],
    queryFn: () => fetchGenres('tv'),
  });

  // Combiner et dédupliquer les genres de films et séries
  const allGenres = React.useMemo(() => {
    const genreMap = new Map<number, Genre>();
    
    [...movieGenres, ...tvGenres].forEach(genre => {
      if (!genreMap.has(genre.id)) {
        genreMap.set(genre.id, genre);
      }
    });
    
    return Array.from(genreMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [movieGenres, tvGenres]);

  // Construction de la requête de recherche
  const buildSearchQuery = () => {
    // Si un terme de recherche est spécifié, on utilise la recherche par terme
    if (debouncedSearchTerm.trim()) {
      return searchMulti(debouncedSearchTerm);
    }
    
    // Sinon, on utilise la découverte avec filtres
    const filters: any = {
      include_adult: false,
      with_genres: selectedGenres.length ? selectedGenres.join(',') : undefined,
      primary_release_date_gte: selectedGenres.length || yearRange[0] > 1900 ? `${yearRange[0]}-01-01` : undefined,
      primary_release_date_lte: selectedGenres.length || yearRange[1] < new Date().getFullYear() ? `${yearRange[1]}-12-31` : undefined,
      first_air_date_gte: selectedGenres.length || yearRange[0] > 1900 ? `${yearRange[0]}-01-01` : undefined,
      first_air_date_lte: selectedGenres.length || yearRange[1] < new Date().getFullYear() ? `${yearRange[1]}-12-31` : undefined,
    };
    
    // Si aucun filtre n'est spécifié, on retourne null pour ne pas déclencher la requête
    if (!selectedGenres.length && yearRange[0] === 1900 && yearRange[1] === new Date().getFullYear()) {
      return Promise.resolve({ results: [], page: 1, total_pages: 0, total_results: 0 });
    }
    
    return mediaType === 'all'
      ? Promise.all([
          discoverMedia('movie', filters),
          discoverMedia('tv', filters)
        ]).then(([movies, tvShows]) => ({
          results: [...movies.results, ...tvShows.results],
          page: 1,
          total_pages: Math.max(movies.total_pages, tvShows.total_pages),
          total_results: movies.total_results + tvShows.total_results
        }))
      : discoverMedia(mediaType, filters);
  };

  // Recherche avec React Query
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', debouncedSearchTerm, selectedGenres, yearRange, mediaType],
    queryFn: buildSearchQuery,
    enabled: debouncedSearchTerm.trim().length > 0 || selectedGenres.length > 0 || yearRange[0] > 1900 || yearRange[1] < new Date().getFullYear(),
  });

  // Gestionnaire pour le changement de genre
  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSelectedGenres([]);
    setYearRange([1900, new Date().getFullYear()]);
    setMediaType('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Search className="h-8 w-8 text-purple-400" />
            Recherche Avancée
          </h1>
          
          {/* Barre de recherche */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un film ou une série..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Bouton de filtres */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                isFiltersOpen ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <Filter size={18} />
              <span>Filtres</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isFiltersOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {/* Affichage du nombre de filtres actifs */}
            {(selectedGenres.length > 0 || yearRange[0] > 1900 || yearRange[1] < new Date().getFullYear() || mediaType !== 'all') && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 rounded-full transition-colors"
              >
                <X size={18} />
                <span>Réinitialiser les filtres</span>
              </button>
            )}
            
            {/* Pills des filtres actifs */}
            {selectedGenres.map(genreId => {
              const genre = allGenres.find(g => g.id === genreId);
              if (!genre) return null;
              
              return (
                <div key={genreId} className="bg-purple-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Tag size={14} />
                  <span>{genre.name}</span>
                  <button 
                    onClick={() => handleGenreToggle(genreId)}
                    className="ml-1 rounded-full hover:bg-purple-700 p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
            
            {(yearRange[0] > 1900 || yearRange[1] < new Date().getFullYear()) && (
              <div className="bg-purple-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{yearRange[0]} - {yearRange[1]}</span>
              </div>
            )}
            
            {mediaType !== 'all' && (
              <div className="bg-purple-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                {mediaType === 'movie' ? <Film size={14} /> : <Tv size={14} />}
                <span>{mediaType === 'movie' ? 'Films' : 'Séries'}</span>
              </div>
            )}
          </div>
          
          {/* Panneau de filtres */}
          {isFiltersOpen && (
            <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg mb-6 border border-gray-700 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Type de média */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-300">Type</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setMediaType('all')}
                      className={`px-4 py-2 rounded-full ${
                        mediaType === 'all' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setMediaType('movie')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full ${
                        mediaType === 'movie' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <Film size={16} />
                      Films
                    </button>
                    <button
                      onClick={() => setMediaType('tv')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full ${
                        mediaType === 'tv' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <Tv size={16} />
                      Séries
                    </button>
                  </div>
                </div>
                
                {/* Plage d'années */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-300">Année de sortie</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">De</label>
                      <input
                        type="number"
                        min="1900"
                        max={yearRange[1]}
                        value={yearRange[0]}
                        onChange={(e) => setYearRange([parseInt(e.target.value) || 1900, yearRange[1]])}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">À</label>
                      <input
                        type="number"
                        min={yearRange[0]}
                        max={new Date().getFullYear()}
                        value={yearRange[1]}
                        onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value) || new Date().getFullYear()])}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Genres */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-300">Genres</h3>
                  <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto p-1">
                    {allGenres.map(genre => (
                      <button
                        key={genre.id}
                        onClick={() => handleGenreToggle(genre.id)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          selectedGenres.includes(genre.id)
                            ? 'bg-purple-600'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Résultats de recherche */}
          <div>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {searchResults && searchResults.results.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {searchResults.results.map((media: MediaBasic) => (
                      <MediaCard key={`${media.id}-${media.media_type || 'media'}`} media={media} genreNames={[]} onToggleFavorite={() => {}} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    {debouncedSearchTerm || selectedGenres.length > 0 || yearRange[0] > 1900 || yearRange[1] < new Date().getFullYear() ? (
                      <div className="max-w-md mx-auto">
                        <p className="text-xl font-medium mb-2">Aucun résultat trouvé</p>
                        <p className="text-gray-400">
                          Essayez d'autres mots-clés ou d'ajuster vos filtres pour voir plus de contenu.
                        </p>
                      </div>
                    ) : (
                      <div className="max-w-md mx-auto">
                        <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-xl font-medium mb-2">Commencez à chercher</p>
                        <p className="text-gray-400">
                          Utilisez la barre de recherche ci-dessus ou appliquez des filtres pour découvrir des films et séries.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
