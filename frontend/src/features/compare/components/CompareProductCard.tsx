import { ShoppingCart } from "lucide-react";
import type { ComparePc, CompareBook } from "../types";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RatingStars from "@/components/RatingStars";

type CompareProductCardProps = {
  product: ComparePc | CompareBook;
  productCategory: "pc" | "book";
  onRemove: (productId: number) => void;
};

function CompareProductCard({
  product,
  productCategory,
  onRemove,
}: CompareProductCardProps) {
  const productId =
    productCategory === "pc"
      ? (product as ComparePc).pcId
      : (product as CompareBook).bookId;

  const handleAddToCart = () => {
    toast.success("カートに追加しました");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">比較対象:</span>
        <Button variant="outline" size="sm" onClick={() => onRemove(productId)}>
          削除
        </Button>
      </div>

      <Card className="h-fit">
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

          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {productCategory === "pc" ? "PC" : "技術書"}
            </Badge>

            <div className="flex items-center gap-1">
              <RatingStars average={product.rating} />
              {product.rating}
            </div>
          </div>

          <div className="text-2xl font-bold text-primary">
            ¥{product.price.toLocaleString()}
          </div>

          <Button onClick={handleAddToCart} className="w-full mt-3" size="sm">
            <ShoppingCart className="w-4 h-4 mr-2" />
            カートに追加
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}

export default CompareProductCard;
