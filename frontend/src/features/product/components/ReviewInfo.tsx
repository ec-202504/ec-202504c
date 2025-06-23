import type { Review, ReviewCounts } from "../types/Review";
import ReviewItem from "./ReviewItem";

type ReviewInfoProps = {
  reviews: Review[];
  totalReviews: number;
  average: number;
};

function ReviewInfo({ reviews, totalReviews, average }: ReviewInfoProps) {
  /**
   * 評価別のパーセンテージを計算する
   *
   * @param count レビュー数
   * @param total 総レビュー数
   * @returns パーセンテージ
   */
  const calcPercentage = (count: number, total: number): number => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const initialCounts: ReviewCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  /**
   * 評価別の件数を計算
   *
   * @param acc 評価別の件数
   * @param review レビュー情報
   * @returns 評価（5段階）別のレビュー数
   */
  const ratingCounts: ReviewCounts = reviews.reduce((acc, review) => {
    acc[review.rating] += 1;
    return acc;
  }, initialCounts);

  return (
    <div className="flex gap-8 w-full max-w-5xl mb-8">
      <div>
        <h2 className="text-lg font-bold mb-2">カスタマーレビュー</h2>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold">{average.toFixed(1)}</span>
          <span>5つのうち</span>
        </div>

        <div className="mb-4">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="w-[30px]">星{rating}</span>
              {/* 評価のパーセンテージをバーで表示 */}
              <div className="bg-gray-200 h-2 w-40 rounded">
                <div
                  className="bg-orange-400 h-2 rounded"
                  style={{
                    width: `${calcPercentage(ratingCounts[rating as keyof ReviewCounts], totalReviews)}%`,
                  }}
                />
              </div>
              {/* 評価のパーセンテージを数値で表示 */}
              <span>
                {calcPercentage(
                  ratingCounts[rating as keyof ReviewCounts],
                  totalReviews,
                )}
                %
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-2 w-full">
        <div className="font-bold mb-2">レビュー内容</div>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewItem
              key={review.id}
              userName={review.userName}
              content={review.comment}
              rating={review.rating}
            />
          ))
        ) : (
          <div className="text-gray-500">まだレビューがありません</div>
        )}
      </div>
    </div>
  );
}

export default ReviewInfo;
