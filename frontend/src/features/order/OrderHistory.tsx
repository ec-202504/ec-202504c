import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axiosInstance";

export type OrderProductResponse = {
  productId: number;
  productCategory: 0 | 1; // 0 = PC, 1 = Book
  quantity: number;
  productName: string;
  imageUrl: string;
  price: number;
};

export type OrderHistoryResponse = {
  orderId: number;
  totalPrice: number;
  orderDate: string; // ISO文字列
  deliveryDateTime: string; // ISO文字列
  paymentMethod: 0 | 1; // 0 = 現金, 1 = クレカ
  products: OrderProductResponse[];
};

function OrderHistory() {
  const [orders, setOrders] = useState<OrderHistoryResponse[]>([]);

  // 配達予定時刻を時まで表示する関数
  const formatDeliveryTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return format(date, "M/d HH時", { locale: ja });
  };

  /**
   * 注文履歴を取得する
   */
  useEffect(() => {
    const fetchOrders = async () => {
      const response =
        await axiosInstance.get<OrderHistoryResponse[]>("/orders/history");
      setOrders(response.data);
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">注文履歴</h1>
      {orders.map((order) => (
        <Card key={order.orderId} className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="text-lg">
              注文日: {format(new Date(order.orderDate), "yyyy-MM-dd")}
            </CardTitle>

            <div className="flex items-center gap-2">
              <Badge variant="outline">
                配達予定日時: {formatDeliveryTime(order.deliveryDateTime)}
              </Badge>

              <Badge
                variant={order.paymentMethod === 0 ? "default" : "secondary"}
              >
                {order.paymentMethod === 0 ? "現金" : "クレジットカード"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-4">
              <span className="text-gray-600 mr-2">合計金額:</span>
              <span className="font-bold text-green-600 text-lg">
                ¥{order.totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="divide-y">
              {order.products.map((item) => (
                <div
                  key={item.productName}
                  className="flex items-center gap-4 py-4"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-28 h-28 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.productName}</div>
                  </div>
                  <div className="text-right w-16">{item.quantity}個</div>
                  <div className="text-right w-24 font-bold text-green-700">
                    ¥{item.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default OrderHistory;
