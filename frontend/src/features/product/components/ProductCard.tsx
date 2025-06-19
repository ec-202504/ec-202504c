import { Link } from "@tanstack/react-router";
import { Card } from "../../../components/ui/card";
import type { Product } from "../types";

// 価格をカンマ区切りで整形する関数
function formatPrice(price: number) {
  return price.toLocaleString();
}

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <Link
      to={"/product/pc/$itemId"}
      key={product.id}
      params={{ itemId: product.id }}
    >
      <Card
        className="h-64 border rounded p-4 flex flex-col items-center"
        key={product.id}
      >
        <div className="w-24 h-24 bg-gray-200 mb-2" />
        <div>商品名：{product.name}</div>
        <div>価格：{formatPrice(product.price)}</div>
      </Card>
    </Link>
  );
}
