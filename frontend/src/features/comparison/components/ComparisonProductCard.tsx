import { ShoppingCart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Pc } from "../../product/types/Pc";
import type { Book } from "../../product/types/Book";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORY } from "../../../types/constants";
import type { AddCartRequest } from "../../product/types/addCartRequest";
import { axiosInstance } from "../../../lib/axiosInstance";
import { TAB_VALUES, type TabValues } from "../../product/types/constants";
import { formatImageByte } from "../../product/utils/formatImageByte";

type ComparisonProductCardProps = {
  product: Pc | Book;
  productCategory: TabValues;
  onRemove: (productId: number) => void;
};

function ComparisonProductCard({
  product,
  productCategory,
  onRemove,
}: ComparisonProductCardProps) {
  const productId =
    productCategory === TAB_VALUES.PC
      ? (product as Pc).pcId
      : (product as Book).bookId;

  /**
   * カートに追加ボタンをクリックしたときの処理
   *
   * @param e イベントオブジェクト
   */
  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // TODO: カート追加ロジックを共通化する
    e.preventDefault();
    e.stopPropagation();

    const addCartRequestBody: AddCartRequest = {
      productId: productId,
      productCategory:
        productCategory === TAB_VALUES.PC
          ? PRODUCT_CATEGORY.PC
          : PRODUCT_CATEGORY.BOOK,
      quantity: 1,
    };

    try {
      await axiosInstance.post("/carts", addCartRequestBody);
      toast.success(
        `${product.name}を${addCartRequestBody.quantity}個カートに追加しました`,
      );
    } catch {
      toast.error("カートへの追加に失敗しました");
    }
  };

  /**
   * 商品詳細ページのルートを生成
   *
   * @returns 商品詳細ページのルート
   */
  const getProductDetailRoute = () => {
    if (productCategory === TAB_VALUES.PC) {
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
            <Badge variant="secondary">
              {productCategory === TAB_VALUES.PC ? "PC" : "技術書"}
            </Badge>

            <div className="aspect-video mb-4 overflow-hidden rounded-lg">
              <img
                src={formatImageByte(product.imageUrl)}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            <CardTitle className="text-lg leading-tight h-15">
              {product.name}
            </CardTitle>

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
