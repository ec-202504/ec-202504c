import type { Book } from "../types";
import { axiosInstance } from "../../../lib/axiosInstance";
import { useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import ReviewItem from "../components/ReviewItem";
import type { Pc, RawPc } from "../types";
import LoadingOverlay from "../components/LoadingOverlay";

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

function BookDetail() {
  const [book, setBook] = useState<Book>();
  const [isLoading, setIsLoading] = useState(false);
  const { itemId } = useParams({ from: "/product/book/$itemId/" });
  const totalReviews = dummyReviews.reduce((sum, r) => sum + r.count, 0);
  const average =
    dummyReviews.reduce((sum, r) => sum + r.rating * r.count, 0) / totalReviews;

  const calcPercentage = (count: number, total: number): number => {
    return Math.round((count / total) * 100);
  };

  const handleClick = async (quantity: number) => {
    console.log(quantity);
  };

  // const convertToBook = useCallback((raw: RawPc): Book => {
  //     return {
  //         id: raw.id,
  //         name: raw.name,
  //         price: raw.price,
  //         memory: raw.memory,
  //         storage: raw.storage,
  //         device_size: raw.deviceSize,
  //         device_type: raw.deviceType,
  //         os: raw.os.name,
  //         cpu: raw.cpu.name,
  //         gpu: raw.gpu.name,
  //         purpose: raw.purpose.name,
  //         imageUrl: "", // 初期値として空文字
  //     };
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/books/${itemId}`);
        console.log(response.data);
        // setBook(convertToBook(response.data));
      } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [itemId]);
  return <div>{isLoading ? <LoadingOverlay /> : <div>BookDetail</div>}</div>;
}

export default BookDetail;
