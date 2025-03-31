
import { useQuery } from '@tanstack/react-query';
import { fetchCredits } from '@/services/tmdb';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CastSectionProps {
  movieId: number;
  type: 'movie' | 'tv';
}

const CastSection = ({ movieId, type }: CastSectionProps) => {
  const { data: credits, isLoading } = useQuery({
    queryKey: ['credits', movieId, type],
    queryFn: () => fetchCredits(movieId, type),
  });
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="flex space-x-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-32 w-24 rounded-md" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!credits?.cast?.length) {
    return null;
  }
  
  // Only show the top 10 cast members
  const mainCast = credits.cast.slice(0, 10);
  
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Distribution</h3>
      
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4">
          {mainCast.map((person: any) => (
            <div key={person.id} className="w-[120px] text-center space-y-2">
              <div className="aspect-[2/3] relative overflow-hidden rounded-md bg-dark-800">
                {person.profile_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-dark-700 text-gray-500">
                    <span className="text-xs">Pas d'image</span>
                  </div>
                )}
              </div>
              <p className="font-medium text-sm line-clamp-1">{person.name}</p>
              <p className="text-gray-400 text-xs line-clamp-1">{person.character}</p>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CastSection;
