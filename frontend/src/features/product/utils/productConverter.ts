import type { Product, RawBook, RawPc } from "../types";

export const convertToProduct = (rawProduct: RawBook | RawPc): Product => {
  // RawBookの場合
  if ("book" in rawProduct) {
    return {
      id: rawProduct.book.id.toString(),
      name: rawProduct.book.name,
      price: rawProduct.book.price,
      imageUrl: rawProduct.book.imageUrl, // 画像URLは未提供なので空文字
      reviewCount: 0, // デフォルト値
      averageRating: 0, // デフォルト値
    };
  }

  // RawPcの場合
  if ("pc" in rawProduct) {
    return {
      id: rawProduct.pc.id.toString(),
      name: rawProduct.pc.name,
      price: rawProduct.pc.price,
      imageUrl: rawProduct.pc.imageUrl, // 画像URLは未提供なので空文字
      reviewCount: 0, // デフォルト値
      averageRating: 0, // デフォルト値
    };
  }

  throw new Error("Invalid product type");
};
