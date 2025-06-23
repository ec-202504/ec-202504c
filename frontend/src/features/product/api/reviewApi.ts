import { axiosInstance } from "../../../lib/axiosInstance";
import type { Review } from "../types/Review";

type ReviewData = {
  comment: string;
  rating: number;
};

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
 * PCのレビューを投稿する
 *
 * @param productId PCのID
 * @param reviewData レビューデータ
 */
export const postPcReview = async (
  productId: number,
  reviewData: ReviewData,
): Promise<void> => {
  const response = await axiosInstance.post(
    `/reviews/pc/${productId}`,
    reviewData,
  );
  return response.data;
};

/**
 * Bookのレビューを投稿する
 *
 * @param productId BookのID
 * @param reviewData レビューデータ
 */
export const postBookReview = async (
  productId: number,
  reviewData: ReviewData,
): Promise<void> => {
  const response = await axiosInstance.post(
    `/reviews/book/${productId}`,
    reviewData,
  );
  return response.data;
};
