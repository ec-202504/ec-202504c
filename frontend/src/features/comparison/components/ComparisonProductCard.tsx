import { ShoppingCart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Pc } from "../../product/types/Pc";
import type { Book } from "../../product/types/Book";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ComparisonProductCardProps = {
  product: Pc | Book;
  productCategory: "pc" | "book";
  onRemove: (productId: number) => void;
};

function ComparisonProductCard({
  product,
  productCategory,
  onRemove,
}: ComparisonProductCardProps) {
  const productId =
    productCategory === "pc" ? (product as Pc).pcId : (product as Book).bookId;

  /**
   * カートに追加ボタンをクリックしたときの処理
   *
   * @param e イベントオブジェクト
   */
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success("カートに追加しました");
  };

  /**
   * 商品詳細ページのルートを生成
   *
   * @returns 商品詳細ページのルート
   */
  const getProductDetailRoute = () => {
    if (productCategory === "pc") {
      return `/product/pc/${productId}`;
    }
    return `/product/book/${productId}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">比較対象:</span>
        <Button variant="outline" size="sm" onClick={() => onRemove(productId)}>
          削除
        </Button>
      </div>

      <Link to={getProductDetailRoute()}>
        <Card className="h-fit cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="aspect-video mb-4 overflow-hidden rounded-lg">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <CardTitle className="text-lg leading-tight">
              {product.name}
            </CardTitle>

            <Badge variant="secondary">
              {productCategory === "pc" ? "PC" : "技術書"}
            </Badge>

            <div className="text-2xl font-bold text-primary">
              ¥{product.price.toLocaleString()}
            </div>

            <Button onClick={handleAddToCart} className="w-full mt-3" size="sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              カートに追加
            </Button>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
}

export default ComparisonProductCard;
