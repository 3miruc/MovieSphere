
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface UserReview {
  movieId: number;
  rating: number;
  content: string;
  date: string;
}

const REVIEWS_STORAGE_KEY = 'cinema-user-reviews';

export function useUserReviews() {
  const [reviews, setReviews] = useState<UserReview[]>([]);

  // Load reviews from local storage on component mount
  useEffect(() => {
    const storedReviews = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (storedReviews) {
      try {
        setReviews(JSON.parse(storedReviews));
      } catch (e) {
        console.error('Error loading reviews:', e);
      }
    }
  }, []);

  // Save reviews to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (movieId: number, review: Omit<UserReview, 'movieId'>) => {
    setReviews(prevReviews => {
      // Check if a review already exists for this movie
      const existingReviewIndex = prevReviews.findIndex(r => r.movieId === movieId);
      
      if (existingReviewIndex !== -1) {
        // Update existing review
        const updatedReviews = [...prevReviews];
        updatedReviews[existingReviewIndex] = {
          ...updatedReviews[existingReviewIndex],
          ...review,
          movieId
        };
        return updatedReviews;
      } else {
        // Add new review
        return [...prevReviews, { ...review, movieId }];
      }
    });
  };

  const deleteReview = (movieId: number) => {
    setReviews(prevReviews => prevReviews.filter(review => review.movieId !== movieId));
  };

  const getUserReview = (movieId: number): UserReview | undefined => {
    return reviews.find(review => review.movieId === movieId);
  };

  return {
    reviews,
    addReview,
    deleteReview,
    getUserReview
  };
}
