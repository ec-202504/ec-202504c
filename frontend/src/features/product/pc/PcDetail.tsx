import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../lib/axiosInstance";
import { toast } from "sonner";
import { PRODUCT_CATEGORY } from "../../../types/constants";
import PcInfo from "../components/PcInfo";
import ReviewItem from "../components/ReviewItem";
import type { AddCartRequest, Pc } from "../types";
import LoadingOverlay from "../components/LoadingOverlay";
import ProductNotFound from "../components/ProductNotFound";

const dummyReviews = [
  { rating: 5, count: 340 },
  { rating: 4, count: 183 },
  { rating: 3, count: 41 },
  { rating: 2, count: 27 },
  { rating: 1, count: 88 },
];

const dummyReviewContents = [
  {
    id: "review-1",
    user: "山田太郎",
    rating: 5,
    content:
      "とても使いやすく、性能も申し分ありません。デザインも美しく、満足しています。",
  },
  {
    id: "review-2",
    user: "佐藤花子",
    rating: 4,
    content:
      "全体的に良い商品ですが、バッテリーの持ちがもう少し長ければ完璧です。",
  },
  {
    id: "review-3",
    user: "鈴木一郎",
    rating: 5,
    content: "期待以上の性能で、仕事効率が大幅に向上しました。おすすめです。",
  },
];

export default function PcDetail() {
  const [pc, setPc] = useState<Pc>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { itemId } = useParams({ from: "/product/pc/$itemId/" });
  const navigate = useNavigate();

  const totalReviews = dummyReviews.reduce((sum, r) => sum + r.count, 0);
  const average =
    dummyReviews.reduce((sum, r) => sum + r.rating * r.count, 0) / totalReviews;

  const calcPercentage = (count: number, total: number): number => {
    return Math.round((count / total) * 100);
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
                    {dummyReviews.map((r) => (
                      <div key={r.rating} className="flex items-center gap-2">
                        <span className="w-[30px]">星{r.rating}</span>
                        <div className="bg-gray-200 h-2 w-40 rounded">
                          <div
                            className="bg-orange-400 h-2 rounded"
                            style={{
                              width: `${calcPercentage(r.count, totalReviews)}%`,
                            }}
                          />
                        </div>
                        <span>{calcPercentage(r.count, totalReviews)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-2 w-full">
                  <div className="font-bold mb-2">レビュー内容</div>
                  {dummyReviewContents.map((review) => (
                    <ReviewItem
                      key={review.id}
                      userName={review.user}
                      content={review.content}
                      rating={review.rating}
                    />
                  ))}
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
