import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rateBookingApi } from '../../api/bookings';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Star, ArrowLeft } from 'lucide-react';

export const RateReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || rating === 0) return;
    
    setIsSubmitting(true);
    try {
      await rateBookingApi(id, rating, comment);
      navigate(`/my-bookings/${id}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Rate Professional</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto mt-4 space-y-4">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How was your service?</h2>
          <p className="text-gray-500 mb-8">Please rate your experience with the professional.</p>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  className={`w-12 h-12 ${
                    (hoverRating || rating) >= star 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-200'
                  }`} 
                />
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Add a comment (Optional)</label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="What did you like or dislike?"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={rating === 0 || isSubmitting}
              isLoading={isSubmitting}
            >
              Submit Review
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
