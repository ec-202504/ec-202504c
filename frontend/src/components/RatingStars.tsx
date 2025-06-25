type RatingStarsProps = {
  average: number;
};

export default function RatingStars({ average }: RatingStarsProps) {
  console.log("average", average);
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercentage = Math.max(0, Math.min(1, average - star + 1));

        return (
          <svg
            key={star}
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`star-${star}`}>
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset={`${fillPercentage * 100}%`} stopColor="#fbbf24" />
                <stop offset={`${fillPercentage * 100}%`} stopColor="#d1d5db" />
                <stop offset="100%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={`url(#star-${star})`}
            />
          </svg>
        );
      })}
    </div>
  );
}
