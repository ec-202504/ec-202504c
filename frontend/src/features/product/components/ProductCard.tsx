import { Link } from "@tanstack/react-router";
import { Checkbox } from "../../../components/ui/checkbox";
import type { Product, TabValues } from "../types";
import { Card, CardContent } from "../../../components/ui/card";

import { TAB_VALUES } from "../types/constants";
import { formatPriceWithComma } from "../../../utils/formatPriceWithComma";
// import RatingStars from "./RatingStars";

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
    <Card className="h-full bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 relative">
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
          <div className="aspect-[4/3] bg-muted rounded-md mb-1.5 overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-muted-foreground text-xs">画像なし</div>
              </div>
            )}
          </div>

          <div className="space-y-0.5">
            <h3 className="font-medium text-foreground text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-md font-bold text-primary">
              ¥{formatPriceWithComma(product.price)}
            </p>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              {/* <RatingStars
                average={Math.round(product.averageRating * 10) / 10}
              /> */}
              <span>({product.reviewCount})</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
