import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "../../../components/ui/card";
import type { Product } from "../types";
import RatingStars from "../../../components/RatingStars";

//価格をカンマ区切りで整形する関数;
function formatPrice(price: number) {
  return price.toLocaleString();
}

type RecommendedProductsProps = {
  products: Product[];
};

export default function RecommendedByContentBaseProducts({
  products,
}: RecommendedProductsProps) {
  return (
    <section className="py-5 mb-5 bg-gray-50 rounded-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">関連商品</h2>
          <p className="text-gray-600">この商品に関連する商品をご紹介</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              to="/product/pc/$itemId"
              params={{ itemId: product.id.toString() }}
              className="group"
            >
              <Card className="h-full bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                <CardContent className="px-4">
                  <div className="aspect-[4/3] bg-gray-100 rounded-sm mb-1.5 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
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
                    <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm font-bold text-blue-600">
                      ¥{formatPrice(product.price)}
                    </p>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <RatingStars average={product.averageRating} />
                      {product.averageRating}
                      <span>({product.reviewCount})</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
