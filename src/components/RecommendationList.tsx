
import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import { Movie, getMoviesByGenre, getTrendingMovies } from '@/data/movies';

interface RecommendationListProps {
  title: string;
  movies: Movie[];
  emptyMessage?: string;
}

const RecommendationList = ({ 
  title, 
  movies, 
  emptyMessage = "No recommendations found" 
}: RecommendationListProps) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationList;
