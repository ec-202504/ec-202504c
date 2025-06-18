import { Link } from "@tanstack/react-router";
import { Card } from "../../../components/ui/card";
import type { Product } from "../ProductPage";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <Link to={"/product"} key={product.id}>
      <Card
        className="border rounded p-4 flex flex-col items-center"
        key={product.id}
      >
        <div className="w-24 h-24 bg-gray-200 mb-2" />
        <div>商品名：{product.name}</div>
        <div>価格：{product.price}</div>
      </Card>
    </Link>
  );
}
