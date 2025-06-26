import { Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
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
   * ブックマークの状態を変更するハンドラー
   *
   * @param e イベント
   */
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectionChange(Number(product.id), !selected);
  };

  return (
    <Card className="h-full bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 relative group">
      <button
        type="button"
        onClick={handleBookmarkClick}
        className="absolute top-3 left-3 z-10 p-1.5 rounded-md bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
        aria-label={selected ? "比較から削除" : "比較に追加"}
      >
        <Bookmark
          className={`w-5 h-5 transition-colors ${
            selected ? "fill-secondary text-secondary" : "text-muted-foreground"
          }`}
        />
      </button>

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
