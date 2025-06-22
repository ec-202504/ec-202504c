/** レビューの型定義 */
export type Review = {
  /** レビューID */
  id: number;
  /** コメント */
  comment: string;
  /** 評価（1～5） */
  rating: number;
  /** 商品カテゴリ（0:PC, 1:Book） */
  productCategory: number;
  /** 商品ID */
  productId: number;
  /** ユーザーID */
  userId: number;
  /** ユーザー名 */
  userName: string;
};
