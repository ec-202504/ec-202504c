import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../lib/axiosInstance";
import { toast } from "sonner";
import { PRODUCT_CATEGORY } from "../../../types/constants";
import PcInfo from "../components/PcInfo";
import ReviewItem from "../components/ReviewItem";
import type { AddCartRequest, Pc, Review } from "../types";
import { fetchPcReviews } from "../api/reviewApi";
import LoadingOverlay from "../components/LoadingOverlay";
import ProductNotFound from "../components/ProductNotFound";

export default function PcDetail() {
  const [pc, setPc] = useState<Pc>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { itemId } = useParams({ from: "/product/pc/$itemId/" });
  const navigate = useNavigate();

  // レビューの統計情報を計算
  const totalReviews = reviews.length;
  const average =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  // 評価別の件数を計算
  const ratingCounts = reviews.reduce(
    (acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );

  const calcPercentage = (count: number, total: number): number => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  /**
   * カートにPCを追加する
   *
   * @param quantity カートに追加する数量
   */
  const handleClick = async (quantity: number) => {
    if (!pc?.pcId) {
      return;
    }

    const addCartRequestBody: AddCartRequest = {
      productId: pc?.pcId,
      productCategory: PRODUCT_CATEGORY.PC,
      quantity: quantity,
    };

    // TODO: ログインしているユーザーのIDを取得する
    try {
      await axiosInstance.post("/carts", addCartRequestBody);
      toast.success(`${pc?.name}を${quantity}個カートに追加しました`);
      navigate({ to: "/cart" });
    } catch (error) {
      console.error("APIリクエストに失敗しました:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/pcs/${itemId}`);
        setPc(response.data);
      } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [itemId]);

  /**
   * PCのレビューを取得する
   */
  useEffect(() => {
    const fetchReviews = async () => {
      if (!itemId) return;

      try {
        const reviewsData = await fetchPcReviews(itemId);
        setReviews(reviewsData);
      } catch (error) {
        console.error("レビューの取得に失敗しました:", error);
        toast.error("レビューの取得に失敗しました");
      }
    };

    fetchReviews();
  }, [itemId]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-4 py-4">
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <>
          {pc ? (
            <>
              <PcInfo
                pc={pc}
                handleClick={handleClick}
                average={average}
                totalReviews={totalReviews}
              />
              <div className="flex gap-8 w-full max-w-5xl mb-8">
                <div>
                  <h2 className="text-lg font-bold mb-2">カスタマーレビュー</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold">
                      {average.toFixed(1)}
                    </span>
                    <span>5つのうち</span>
                  </div>

                  <div className="mb-4">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="w-[30px]">星{rating}</span>
                        <div className="bg-gray-200 h-2 w-40 rounded">
                          <div
                            className="bg-orange-400 h-2 rounded"
                            style={{
                              width: `${calcPercentage(ratingCounts[rating] || 0, totalReviews)}%`,
                            }}
                          />
                        </div>
                        <span>
                          {calcPercentage(
                            ratingCounts[rating] || 0,
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
                    <div className="text-gray-500">
                      まだレビューがありません
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <ProductNotFound />
          )}
        </>
      )}
    </div>
  );
}
