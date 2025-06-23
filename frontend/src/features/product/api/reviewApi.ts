import { axiosInstance } from "../../../lib/axiosInstance";
import type { Review } from "../types/Review";

/**
 * PCのレビュー一覧を取得する
 *
 * @param productId PCのID
 * @returns レビュー一覧
 */
export const fetchPcReviews = async (productId: string): Promise<Review[]> => {
  const response = await axiosInstance.get(`/reviews/pc/${productId}`);
  return response.data;
};

/**
 * Bookのレビュー一覧を取得する
 *
 * @param productId BookのID
 * @returns レビュー一覧
 */
export const fetchBookReviews = async (
  productId: string,
): Promise<Review[]> => {
  const response = await axiosInstance.get(`/reviews/book/${productId}`);
  return response.data;
};

/**
 * レビューを投稿する
 * @param reviewData レビューデータ
 */
export const postReview = async (reviewData: {
  comment: string;
  rating: number;
  productCategory: number;
  productId: number;
}): Promise<void> => {
  const response = await axiosInstance.post("/reviews", reviewData);
  return response.data;
};
