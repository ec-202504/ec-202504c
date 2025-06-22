export type OrderProductResponse = {
  productId: number;
  productCategory: 0 | 1; // 0 = PC, 1 = Book
  quantity: number;
  productName: string;
  imageUrl: string;
  price: number;
};

export type OrderDetailResponse = {
  orderId: number;
  totalPrice: number;
  orderDateTime: string; // ISO文字列
  deliveryDateTime: string; // ISO文字列
  paymentMethod: 0 | 1; // 0 = 現金, 1 = クレカ
  products: OrderProductResponse[];
};
