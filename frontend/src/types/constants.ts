// 商品カテゴリの定数
export const PRODUCT_CATEGORY = {
  PC: 0,
  BOOK: 1,
} as const;

// ProductCategory = 0 | 1と同義
export type ProductCategory =
  (typeof PRODUCT_CATEGORY)[keyof typeof PRODUCT_CATEGORY];

// デバイスタイプの定数
export const DEVICE_TYPE = {
  DESKTOP: 0,
  NOTEBOOK: 1,
} as const;

// DeviceType = 0 | 1 と同義
export type DeviceType = (typeof DEVICE_TYPE)[keyof typeof DEVICE_TYPE];

// デバイスタイプの表示名
export const DEVICE_TYPE_LABEL: Record<DeviceType, string> = {
  [DEVICE_TYPE.DESKTOP]: "デスクトップ",
  [DEVICE_TYPE.NOTEBOOK]: "ノートPC",
};
