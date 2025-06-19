import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Package } from "lucide-react";
import OrderProductTable from "./OrderProductTable";

type OrderProduct = {
  name: string;
  quantity: number;
  subtotal: number;
};

type OrderProductSummaryCardProps = {
  products: OrderProduct[];
};

export default function OrderProductSummaryCard({
  products,
}: OrderProductSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          商品内訳
        </CardTitle>
      </CardHeader>
      <CardContent>
        <OrderProductTable products={products} />
      </CardContent>
    </Card>
  );
}
