import RatingStars from "./RatingStars";

type ReviewItemProps = {
  userName: string;
  content: string;
  rating: number;
};

export default function ReviewItem({
  userName,
  content,
  rating,
}: ReviewItemProps) {
  return (
    <div className="border-gray-200 border-2 p-2 rounded mb-2">
      <div className="mb-1">
        <div className="font-semibold">{userName}</div>
        <RatingStars average={rating} />
      </div>
      <div>{content}</div>
    </div>
  );
}
