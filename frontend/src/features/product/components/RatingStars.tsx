interface RatingStarsProps {
  average: number;
}

export const RatingStars = ({ average }: RatingStarsProps) => {
  return (
    <span className="text-yellow-400 font-bold">
      {"★".repeat(Math.round(average))}
      {"☆".repeat(5 - Math.round(average))}
    </span>
  );
};
