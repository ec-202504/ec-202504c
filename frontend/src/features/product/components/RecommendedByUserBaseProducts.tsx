import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "../../../components/ui/card";
import { mockRecommendedPcsData } from "../../../mocks/pcData";
import type { Pc, Product } from "../types";

// 価格をカンマ区切りで整形する関数
function formatPrice(price: number) {
  return price.toLocaleString();
}

type RecommendedByUserBaseProductsProps = {
  products: Product[];
};

export default function RecommendedByUserBaseProducts({
  products,
}: RecommendedByUserBaseProductsProps) {
  products = mockRecommendedPcsData;

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          似たユーザーが購入
        </h3>
        <p className="text-sm text-gray-600">
          この商品を購入したユーザーが選んだ商品
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">商品が見つかりません</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <Link
              key={product.id}
              to="/product/pc/$itemId"
              params={{ itemId: product.id.toString() }}
              className="group"
            >
              <Card className="h-full bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                <CardContent className="px-2">
                  <div className="aspect-[4/3] bg-gray-100 rounded-sm mb-1.5 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-gray-400 text-xs">画像なし</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-sm font-bold text-blue-600">
                      ¥{formatPrice(product.price)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
