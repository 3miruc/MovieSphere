
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import RatingSelector from './RatingSelector';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUserReviews } from '@/hooks/useUserReviews';

interface ReviewFormData {
  content: string;
}

interface ReviewSectionProps {
  movieId: number;
}

const ReviewSection = ({ movieId }: ReviewSectionProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormData>();
  const [rating, setRating] = useState<number | null>(null);
  const { reviews, addReview, deleteReview, getUserReview } = useUserReviews();
  
  const userReview = getUserReview(movieId);
  
  const onSubmit = (data: ReviewFormData) => {
    if (!rating) {
      toast.error('Veuillez attribuer une note');
      return;
    }
    
    addReview(movieId, { 
      rating, 
      content: data.content,
      date: new Date().toISOString()
    });
    
    reset();
    setRating(null);
    toast.success('Votre avis a été publié');
  };
  
  const handleDeleteReview = () => {
    deleteReview(movieId);
    toast.success('Votre avis a été supprimé');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Votre Avis</h2>
      
      {userReview ? (
        <Card className="bg-dark-800 border-dark-700">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <RatingSelector value={userReview.rating} onChange={() => {}} readOnly />
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Publié le {new Date(userReview.date).toLocaleDateString()}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleDeleteReview}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-gray-200">{userReview.content}</p>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Votre note</label>
            <RatingSelector value={rating} onChange={setRating} />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="review" className="block text-sm font-medium text-gray-300">Votre commentaire</label>
            <Textarea
              id="review"
              placeholder="Partagez votre avis sur ce film/série..."
              className="bg-dark-800 border-dark-700 resize-none h-32"
              {...register("content", { required: "Veuillez écrire un commentaire" })}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full md:w-auto">
            Publier mon avis
          </Button>
        </form>
      )}
    </div>
  );
};

export default ReviewSection;
