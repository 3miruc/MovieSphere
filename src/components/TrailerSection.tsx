
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play } from 'lucide-react';
import { fetchVideos } from '@/services/tmdb';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TrailerSectionProps {
  movieId: number;
  type: 'movie' | 'tv';
  title: string;
}

const TrailerSection = ({ movieId, type, title }: TrailerSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: videos, isLoading } = useQuery({
    queryKey: ['videos', movieId, type],
    queryFn: () => fetchVideos(movieId, type),
  });
  
  // Find the first trailer
  const trailer = videos?.find((video: any) => 
    video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  if (isLoading) {
    return <Skeleton className="h-10 w-40" />;
  }
  
  if (!trailer) {
    return null;
  }
  
  return (
    <>
      <Button 
        onClick={() => setDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <Play className="h-5 w-5" />
        Voir la bande-annonce
      </Button>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Bande-annonce : {title}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video">
            <iframe 
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title={`${title} - Trailer`}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrailerSection;
