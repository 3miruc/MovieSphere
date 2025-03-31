
import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingSelectorProps {
  value: number | null;
  onChange: (rating: number) => void;
  readOnly?: boolean;
}

const RatingSelector = ({ value, onChange, readOnly = false }: RatingSelectorProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  const displayRating = hoverRating !== null ? hoverRating : value;
  
  return (
    <div className="flex items-center">
      {[...Array(10)].map((_, i) => {
        const starValue = i + 1;
        const filled = displayRating !== null && starValue <= displayRating;
        
        return (
          <Star
            key={i}
            className={cn(
              "cursor-pointer transition-colors",
              filled ? "text-yellow-400 fill-yellow-400" : "text-gray-400",
              readOnly && "cursor-default"
            )}
            size={20}
            onClick={() => !readOnly && onChange(starValue)}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(null)}
          />
        );
      })}
      
      {displayRating && (
        <span className="ml-2 text-sm text-gray-300">
          {displayRating}/10
        </span>
      )}
    </div>
  );
};

export default RatingSelector;
