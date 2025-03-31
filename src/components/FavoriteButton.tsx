
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useMovies';

interface FavoriteButtonProps {
  movieId: number;
  className?: string;
  variant?: 'icon' | 'button';
}

const FavoriteButton = ({ 
  movieId, 
  className, 
  variant = 'icon'
}: FavoriteButtonProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isFav = isFavorite(movieId);
  
  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(movieId);
    } else {
      addFavorite(movieId);
    }
  };
  
  if (variant === 'icon') {
    return (
      <Heart
        className={cn(
          "cursor-pointer transition-colors",
          isFav ? "text-red-500 fill-red-500" : "text-gray-300",
          className
        )}
        onClick={toggleFavorite}
      />
    );
  }
  
  return (
    <Button
      variant="outline"
      className={cn(
        "gap-2",
        isFav ? "bg-red-950/30 text-red-400 border-red-900" : "",
        className
      )}
      onClick={toggleFavorite}
    >
      <Heart className={cn(
        isFav ? "text-red-500 fill-red-500" : "text-gray-300"
      )} />
      {isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    </Button>
  );
};

export default FavoriteButton;
