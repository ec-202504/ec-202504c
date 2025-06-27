import { Link } from "@tanstack/react-router";
import { Checkbox } from "../../../components/ui/checkbox";
import type { Product, TabValues } from "../types";
import { Card, CardContent } from "../../../components/ui/card";

import { TAB_VALUES } from "../types/constants";
import RatingStars from "../../../components/RatingStars";

// 価格をカンマ区切りで整形する関数
function formatPrice(price: number) {
  return price.toLocaleString();
}

type Props = {
  product: Product;
  selectedTab: TabValues;
  selected: boolean;
  onSelectionChange: (productId: number, isSelected: boolean) => void;
};

export default function ProductCard({
  product,
  selectedTab,
  selected,
  onSelectionChange,
}: Props) {
  /**
   * チェックボックスの状態を変更するハンドラー
   *
   * @param checked チェックボックスの状態
   */
  const handleCheckboxChange = (checked: boolean) => {
    onSelectionChange(Number(product.id), checked);
  };

  return (
    <Card className="h-full bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 relative">
      <div className="absolute top-2 right-2 z-10">
        <Checkbox checked={selected} onCheckedChange={handleCheckboxChange} />
      </div>

      <Link
        to={
          selectedTab === TAB_VALUES.PC
            ? "/product/pc/$itemId"
            : "/product/book/$itemId"
        }
        key={product.id}
        params={{ itemId: product.id }}
      >
        <CardContent className="px-4">
          <div className="aspect-[4/3] bg-gray-100 rounded-sm mb-1.5 overflow-hidden">
            {product.imageUrl ? (
              <>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400 text-xs">画像なし</div>
              </div>
            )}
          </div>

          <div className="space-y-0.5">
            <h3 className="font-medium text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-md font-bold text-blue-600">
              ¥{formatPrice(product.price)}
            </p>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <RatingStars
                average={Math.round(product.averageRating * 10) / 10}
              />
              <span>({product.reviewCount})</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
