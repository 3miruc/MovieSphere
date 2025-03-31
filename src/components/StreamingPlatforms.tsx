
import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { fetchWatchProviders } from '@/services/tmdb';
import { Skeleton } from '@/components/ui/skeleton';

interface StreamingPlatformsProps {
  movieId: number;
  type: 'movie' | 'tv';
}

const StreamingPlatforms = ({ movieId, type }: StreamingPlatformsProps) => {
  const { data: providers, isLoading } = useQuery({
    queryKey: ['watch-providers', movieId, type],
    queryFn: () => fetchWatchProviders(movieId, type),
  });

  // Get providers for France (FR) or fallback to US
  const frProviders = providers?.results?.FR;
  const usProviders = providers?.results?.US;
  const availableProviders = frProviders || usProviders;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-12 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (!availableProviders || (!availableProviders.flatrate && !availableProviders.rent && !availableProviders.buy)) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">Où regarder</h3>
        <p className="text-gray-400 text-sm">
          Information non disponible pour votre région.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Où regarder</h3>
      
      {availableProviders.link && (
        <a 
          href={availableProviders.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-cinema-400 flex items-center mb-3 hover:underline"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Voir tous les fournisseurs
        </a>
      )}
      
      {availableProviders.flatrate && availableProviders.flatrate.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Streaming</h4>
          <div className="flex flex-wrap gap-2">
            {availableProviders.flatrate.map((provider) => (
              <div key={provider.provider_id} className="text-center">
                <img 
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                  alt={provider.provider_name}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <p className="text-xs mt-1 text-gray-400">{provider.provider_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {availableProviders.rent && availableProviders.rent.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Location</h4>
          <div className="flex flex-wrap gap-2">
            {availableProviders.rent.map((provider) => (
              <div key={provider.provider_id} className="text-center">
                <img 
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                  alt={provider.provider_name}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <p className="text-xs mt-1 text-gray-400">{provider.provider_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {availableProviders.buy && availableProviders.buy.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Achat</h4>
          <div className="flex flex-wrap gap-2">
            {availableProviders.buy.map((provider) => (
              <div key={provider.provider_id} className="text-center">
                <img 
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                  alt={provider.provider_name}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <p className="text-xs mt-1 text-gray-400">{provider.provider_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamingPlatforms;
