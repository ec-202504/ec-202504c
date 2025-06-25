import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axiosInstance";
import type { OrderDetailResponse } from "./types/order";
import { formatDeliveryTime } from "./utils/formatFrontDate";
import { formatToTimezoneDate } from "../../utils/formatToFrontDate";
import { Package, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { TAB_VALUES } from "../product/types/constants";
import { Link } from "@tanstack/react-router";

function OrderHistory() {
  const [orders, setOrders] = useState<OrderDetailResponse[]>([]);

  /**
   * 注文履歴を取得する
   */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response =
          await axiosInstance.get<OrderDetailResponse[]>("/orders/history");
        setOrders(response.data);
      } catch {
        toast.error("注文履歴の取得に失敗しました");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            注文履歴がありません
          </h2>

          <p className="text-gray-600 mb-6">
            商品を購入すると、ここに履歴が表示されます
          </p>

          <Link to="/product" search={{ tab: TAB_VALUES.PC }}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              商品を見る
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* ヘッダー */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">注文履歴</h1>
            <p className="text-gray-600">{orders.length}件の注文</p>
          </div>

          {/* 注文履歴一覧 */}
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.orderId}
                className="border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          注文 #{order.orderId}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {formatToTimezoneDate(order.orderDateTime)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        ¥{order.totalPrice.toLocaleString()}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {order.paymentMethod === 0
                          ? "現金"
                          : "クレジットカード"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>
                        配達予定: {formatDeliveryTime(order.deliveryDateTime)}
                      </span>
                      <span>{order.products.length}点の商品</span>
                    </div>

                    <div className="space-y-3">
                      {order.products.map((item) => (
                        <div
                          key={item.productName}
                          className="flex items-center gap-3"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {item.productName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.quantity}個 × ¥{item.price.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              ¥{(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default OrderHistory;
