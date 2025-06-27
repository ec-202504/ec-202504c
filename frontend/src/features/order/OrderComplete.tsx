import { Link, useLoaderData } from "@tanstack/react-router";
import OrderInfoCard from "./components/OrderInfoCard";
import OrderProductSummaryCard from "./components/OrderProductSummaryCard";
import { Button } from "../../components/ui/button";
import { CheckCircle } from "lucide-react";
import { TAB_VALUES } from "../product/types/constants";

export default function OrderComplete() {
  const order = useLoaderData({
    from: "/order/$orderId/complete",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-14">
        {/* ヘッダー */}
        <div className="text-center mb-10">
          <CheckCircle className="w-20 h-20 text-primary mx-auto mb-4" />
          <h1 className="text-3xl lg:text-4xl font-bold text-primary dark:text-white mb-2">
            注文完了
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            ご注文ありがとうございました。注文完了メールを送信しました。
          </p>
        </div>

        {/* 注文情報・商品サマリー */}
        <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto mb-10">
          <OrderInfoCard
            orderDate={order.orderDateTime}
            deliveryDate={order.deliveryDateTime}
            totalPrice={order.totalPrice}
          />
          <OrderProductSummaryCard products={order.products} />
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link to="/order/history">注文履歴を確認</Link>
          </Button>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/product" search={{ tab: TAB_VALUES.PC }}>
              ショッピングを続ける
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
