/** レビューの型定義 */
export type Review = {
  /** レビューID */
  id: number;
  /** コメント */
  comment: string;
  /** 評価（1～5） */
  rating: 1 | 2 | 3 | 4 | 5;
  /** 商品カテゴリ（0:PC, 1:Book） */
  productCategory: number;
  /** 商品ID */
  productId: number;
  /** ユーザーID */
  userId: number;
  /** ユーザー名 */
  userName: string;
};

export type ReviewCounts = Record<Review["rating"], number>;
