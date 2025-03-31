export interface Movie {
  id: number;
  title: string;
  type: 'movie' | 'series';
  genres: string[];
  posterUrl: string;
  backdropUrl?: string;
  rating: number;
  year: number;
  description: string;
  duration?: string;
  seasons?: number;
  tmdbId?: number; // TMDB ID for API calls
}

export const genres = [
  'Action', 'Aventure', 'Animation', 'Comédie', 'Crime', 
  'Documentaire', 'Drame', 'Fantastique', 'Horreur', 'Mystère',
  'Romance', 'Science-Fiction', 'Thriller'
];

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    type: "movie",
    genres: ["Sci-Fi", "Action", "Thriller"],
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    backdropUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    rating: 8.8,
    year: 2010,
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    duration: "2h 28m"
  },
  {
    id: 2,
    title: "The Shawshank Redemption",
    type: "movie",
    genres: ["Drama"],
    posterUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    rating: 9.3,
    year: 1994,
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    duration: "2h 22m"
  },
  {
    id: 3,
    title: "The Dark Knight",
    type: "movie",
    genres: ["Action", "Crime", "Drama"],
    posterUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    rating: 9.0,
    year: 2008,
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    duration: "2h 32m"
  },
  {
    id: 4,
    title: "Breaking Bad",
    type: "series",
    genres: ["Crime", "Drama", "Thriller"],
    posterUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    rating: 9.5,
    year: 2008,
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's financial future.",
    seasons: 5
  },
  {
    id: 5,
    title: "Stranger Things",
    type: "series",
    genres: ["Drama", "Fantasy", "Horror"],
    posterUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    backdropUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    rating: 8.7,
    year: 2016,
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    seasons: 4
  },
  {
    id: 6,
    title: "The Queen's Gambit",
    type: "series",
    genres: ["Drama"],
    posterUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    rating: 8.6,
    year: 2020,
    description: "Orphaned at the tender age of nine, prodigious introvert Beth Harmon discovers and masters the game of chess in 1960s USA. But child stardom comes at a price.",
    seasons: 1
  },
  {
    id: 7,
    title: "Parasite",
    type: "movie",
    genres: ["Comedy", "Drama", "Thriller"],
    posterUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    rating: 8.6,
    year: 2019,
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    duration: "2h 12m"
  },
  {
    id: 8,
    title: "The Mandalorian",
    type: "series",
    genres: ["Action", "Adventure", "Sci-Fi"],
    posterUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    rating: 8.8,
    year: 2019,
    description: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
    seasons: 3
  }
];

export const getTrendingMovies = () => {
  return mockMovies.sort((a, b) => b.rating - a.rating).slice(0, 4);
};

export const getRecentMovies = () => {
  return mockMovies.sort((a, b) => b.year - a.year).slice(0, 4);
};

export const getMovieById = (id: number) => {
  return mockMovies.find(movie => movie.id === id);
};

export const getMoviesByGenre = (genre: string) => {
  return mockMovies.filter(movie => movie.genres.includes(genre));
};

export const searchMovies = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(lowercaseQuery) || 
    movie.description.toLowerCase().includes(lowercaseQuery) ||
    movie.genres.some(genre => genre.toLowerCase().includes(lowercaseQuery))
  );
};

export const getRecommendedMovies = (movie: Movie) => {
  // Get movies with similar genres
  const similarGenreMovies = mockMovies.filter(
    m => m.id !== movie.id && m.genres.some(genre => movie.genres.includes(genre))
  );
  
  // Sort by number of matching genres and then by rating
  return similarGenreMovies
    .sort((a, b) => {
      const aMatches = a.genres.filter(genre => movie.genres.includes(genre)).length;
      const bMatches = b.genres.filter(genre => movie.genres.includes(genre)).length;
      if (bMatches !== aMatches) {
        return bMatches - aMatches;
      }
      return b.rating - a.rating;
    })
    .slice(0, 4);
};
