import type { Review } from "../types";
import RatingStars from "../../../components/RatingStars";
import { formatToTimezoneDate } from "../../../utils/formatToFrontDate";

type ReviewItemProps = {
  review: Review;
};

export default function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="border-b border-gray-200 py-4 px-2 last:border-b-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-900">{review.userName}</span>
          <span className="text-xs text-gray-500">
            {formatToTimezoneDate(review.reviewDateTime)}
          </span>
        </div>

        <RatingStars average={review.rating} />
      </div>

      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
}
