
/**
 * Composant de carte média réutilisable pour l'affichage des films et séries
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getImageUrl, getMediaTitle, determineMediaType } from '../../services/tmdb';
import type { MediaBasic } from '../../services/tmdb';

// Props du composant MediaCard
interface MediaCardProps {
  media: MediaBasic;
  genreNames?: string[];
  onToggleFavorite?: (media: MediaBasic) => void;
  isFavorite?: boolean;
}

/**
 * Composant pour afficher une carte média avec image, titre et actions
 */
const MediaCard: React.FC<MediaCardProps> = ({ 
  media, 
  genreNames = [], 
  onToggleFavorite, 
  isFavorite = false 
}) => {
  // Détermination du type de média et de son ID pour le routage
  const mediaType = determineMediaType(media);
  const mediaId = media.id;
  
  // Obtention de l'URL de l'image et du titre
  const imageUrl = getImageUrl(media.poster_path, 'poster', 'medium') || '/placeholder.jpg';
  const title = getMediaTitle(media);
  
  // Fonction pour gérer le clic sur le bouton de favoris
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(media);
  };

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 bg-white dark:bg-gray-800">
      {/* Lien vers la page de détails */}
      <Link to={`/${mediaType}/${mediaId}`} className="block h-full">
        {/* Image d'affiche */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover" 
            loading="lazy"
          />
          
          {/* Badge de score */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-bold">
            {media.vote_average.toFixed(1)}
          </div>
          
          {/* Bouton de favoris */}
          {onToggleFavorite && (
            <button 
              onClick={handleFavoriteClick}
              className="absolute top-2 left-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart 
                className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
              />
            </button>
          )}
        </div>
        
        {/* Informations sur le média */}
        <div className="p-3">
          <h3 className="font-bold text-lg truncate dark:text-white">{title}</h3>
          
          {/* Genres */}
          {genreNames.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {genreNames.slice(0, 2).map((genre, index) => (
                <span 
                  key={index} 
                  className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default MediaCard;
