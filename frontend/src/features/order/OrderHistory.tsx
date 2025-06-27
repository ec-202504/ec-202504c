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
import { Package, ShoppingBag, Calendar, CreditCard } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-14">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary/80 dark:text-white mb-4">
            注文履歴
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            過去の注文履歴を確認できます
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {orders.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80">
              <CardContent className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  注文履歴がありません
                </h2>
                <p className="text-muted-foreground mb-6">
                  商品を購入すると、ここに履歴が表示されます
                </p>
                <Link to="/product" search={{ tab: TAB_VALUES.PC }}>
                  <Button className="bg-primary hover:bg-primary/90">
                    商品を見る
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* 注文件数表示 */}
              <div className="mb-6 text-center">
                <p className="text-muted-foreground">
                  {orders.length}件の注文があります
                </p>
              </div>

              {/* 注文履歴一覧 */}
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <Card
                    key={order.orderId}
                    className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-slate-900/80"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-primary">
                              注文 #{orders.length - index}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Calendar className="w-4 h-4" />
                              {formatToTimezoneDate(order.orderDateTime)}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            ¥{order.totalPrice.toLocaleString()}
                          </div>
                          <Badge variant="outline" className="mt-2">
                            <CreditCard className="w-3 h-3 mr-1" />
                            {order.paymentMethod === 0
                              ? "現金"
                              : "クレジットカード"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="border-t border-border/50 pt-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span>
                            配達予定:{" "}
                            {formatDeliveryTime(order.deliveryDateTime)}
                          </span>
                          <span>{order.products.length}点の商品</span>
                        </div>

                        <div className="space-y-4">
                          {order.products.map((item) => (
                            <div
                              key={item.productName}
                              className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                            >
                              <img
                                src={item.imageUrl}
                                alt={item.productName}
                                className="w-24 h-20 object-cover rounded-lg shadow-sm"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate">
                                  {item.productName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {item.quantity}個 × ¥
                                  {item.price.toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-primary">
                                  ¥
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
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
      </div>
    </div>
  );
}

export default OrderHistory;
