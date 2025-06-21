// 商品カテゴリの定数
export const PRODUCT_CATEGORY = {
  PC: 0,
  BOOK: 1,
} as const;

// ProductCategory = 0 | 1と同義
export type ProductCategory =
  (typeof PRODUCT_CATEGORY)[keyof typeof PRODUCT_CATEGORY];
