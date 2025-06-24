import { Link } from "@tanstack/react-router";
import { Card } from "../../../components/ui/card";
import { Checkbox } from "../../../components/ui/checkbox";
import type { Product } from "../types";
import { TAB_VALUES } from "../types/constants";

// 価格をカンマ区切りで整形する関数
function formatPrice(price: number) {
  return price.toLocaleString();
}

type Props = {
  product: Product;
  selectedTab: string;
  selected: boolean;
  onSelectionChange: (productId: number, isSelected: boolean) => void;
};

export default function ProductCard({
  product,
  selectedTab,
  selected,
  onSelectionChange,
}: Props) {
  const handleCheckboxChange = (checked: boolean) => {
    onSelectionChange(Number(product.id), checked);
  };

  return (
    <Card className="h-64 border rounded p-4 flex flex-col items-center relative">
      <div className="absolute top-2 left-2 z-10">
        <Checkbox checked={selected} onCheckedChange={handleCheckboxChange} />
      </div>

      <Link
        to={
          selectedTab === TAB_VALUES.PC
            ? "/product/pc/$itemId"
            : "/product/book/$itemId"
        }
        params={{ itemId: product.id }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-gray-200 mb-2" />
        <div>商品名：{product.name}</div>
        <div>価格：{formatPrice(product.price)}</div>
      </Link>
    </Card>
  );
}
