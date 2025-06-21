import type { ProductCategory } from "../../../types/constants";

export type AddCartRequest = {
  productId: number;
  productCategory: ProductCategory;
  quantity: number;
};
