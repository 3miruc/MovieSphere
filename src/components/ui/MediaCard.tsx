
/**
 * Composant de carte média réutilisable pour l'affichage des films et séries
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
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

  // Format du score sur 10 en score sur 5 étoiles
  const starScore = Math.round(media.vote_average / 2);

  return (
    <div className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 bg-gray-800 border border-gray-700">
      {/* Lien vers la page de détails */}
      <Link to={`/${mediaType}/${mediaId}`} className="block h-full">
        {/* Image d'affiche */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            loading="lazy"
          />
          
          {/* Overlay gradient au survol */}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badge de score */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-0.5 rounded-md text-xs font-bold">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span>{media.vote_average.toFixed(1)}</span>
          </div>
          
          {/* Bouton de favoris */}
          {onToggleFavorite && (
            <button 
              onClick={handleFavoriteClick}
              className="absolute top-2 left-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart 
                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
              />
            </button>
          )}
        </div>
        
        {/* Informations sur le média */}
        <div className="p-3">
          <h3 className="font-bold text-sm truncate text-white">{title}</h3>
          
          {/* Genres */}
          {genreNames.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {genreNames.slice(0, 2).map((genre, index) => (
                <span 
                  key={index} 
                  className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-300"
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
