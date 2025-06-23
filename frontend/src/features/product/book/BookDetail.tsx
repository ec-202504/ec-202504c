import type { AddCartRequest, Book, Review } from "../types";
import { axiosInstance } from "../../../lib/axiosInstance";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import LoadingOverlay from "../components/LoadingOverlay";
import BookInfo from "../components/BookInfo";
import ProductNotFound from "../components/ProductNotFound";
import ReviewInfo from "../components/ReviewInfo";
import { toast } from "sonner";
import { PRODUCT_CATEGORY } from "../../../types/constants";
import { fetchBookReviews } from "../api/reviewApi";

function BookDetail() {
  const [book, setBook] = useState<Book>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { itemId } = useParams({ from: "/product/book/$itemId/" });
  const navigate = useNavigate();

  /**
   * この商品全体のレビューの総数
   */
  const totalReviews = reviews.length;

  /**
   * この商品全体のレビューの平均評価
   */
  const average =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  /**
   * カートに本を追加する
   *
   * @param quantity カートに追加する数量
   */
  const handleClick = async (quantity: number) => {
    if (!book?.bookId) {
      return;
    }

    const addCartRequestBody: AddCartRequest = {
      productId: book?.bookId,
      productCategory: PRODUCT_CATEGORY.BOOK,
      quantity: quantity,
    };

    try {
      await axiosInstance.post("/carts", addCartRequestBody);
      toast.success(`${book?.name}を${quantity}個カートに追加しました`);
      navigate({ to: "/cart" });
    } catch (error) {
      toast.error("カートへの追加に失敗しました");
    }
  };

  /**
   * 本の詳細情報を取得する
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/books/${itemId}`);
      setBook(response.data);
    } catch (error) {
      toast.error("商品情報の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, [itemId]);

  /**
   * 本のレビューを取得する
   */
  const fetchReviews = useCallback(async () => {
    if (!itemId) return;

    try {
      const reviewsData = await fetchBookReviews(itemId);
      setReviews(reviewsData);
    } catch (error) {
      console.error("レビューの取得に失敗しました:", error);
      toast.error("レビューの取得に失敗しました");
    }
  }, [itemId]);

  useEffect(() => {
    fetchData();
    fetchReviews();
  }, [fetchData, fetchReviews]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-4 py-8">
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <>
          {book ? (
            <>
              <BookInfo
                book={book}
                handleClick={handleClick}
                average={average}
                totalReviews={totalReviews}
              />
              <ReviewInfo
                reviews={reviews}
                totalReviews={totalReviews}
                average={average}
              />
            </>
          ) : (
            <ProductNotFound />
          )}
        </>
      )}
    </div>
  );
}

export default BookDetail;
