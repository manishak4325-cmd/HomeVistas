import { Star, User as UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  _id: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 bg-card border border-border rounded-xl">
        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                {review.user.avatar ? (
                  <img src={review.user.avatar} alt={review.user.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <UserIcon className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <p className="font-semibold">{review.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
          {review.title && <h4 className="font-bold mb-2">{review.title}</h4>}
          <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};
