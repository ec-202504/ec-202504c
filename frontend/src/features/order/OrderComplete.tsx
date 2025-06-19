import { Link } from "@tanstack/react-router";
import OrderInfoCard from "./components/OrderInfoCard";
import OrderProductSummaryCard from "./components/OrderProductSummaryCard";
import { Button } from "../../components/ui/button";
import { CheckCircle } from "lucide-react";

// ダミーデータ
const orderDate = "2024-06-01";
const deliveryDate = "2024-06-05";
const totalPrice = 156000;
const products = [
  { name: "ゲーミングPC", quantity: 1, subtotal: 150000 },
  { name: "書籍『React入門』", quantity: 2, subtotal: 6000 },
];

export default function OrderComplete() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">注文完了</h1>
        <p className="text-gray-600 text-lg">
          ご注文ありがとうございました。注文完了メールを送信しました。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <OrderInfoCard
          orderDate={orderDate}
          deliveryDate={deliveryDate}
          totalPrice={totalPrice}
        />
        <OrderProductSummaryCard products={products} />
      </div>

      <div className="mt-8 text-center flex gap-6 justify-between">
        <Button asChild variant="outline">
          <Link to="/order/history">注文履歴を確認</Link>
        </Button>
        <Button asChild>
          <Link to="/">ショッピングを続ける</Link>
        </Button>
      </div>
    </div>
  );
}
