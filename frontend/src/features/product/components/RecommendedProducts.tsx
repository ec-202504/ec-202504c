import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "../../../components/ui/card";
import type { Pc } from "../types/Pc";

//価格をカンマ区切りで整形する関数;
function formatPrice(price: number) {
  return price.toLocaleString();
}

type RecommendedProductsProps = {
  pcs: Pc[];
};

export default function RecommendedProducts({ pcs }: RecommendedProductsProps) {
  console.log("pcs", pcs);
  if (pcs.length === 0) {
    return null;
  }

  return (
    <section className="py-5 mb-5 bg-gray-50 rounded-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">関連商品</h2>
          <p className="text-gray-600">この商品に関連する商品をご紹介</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {pcs.map((pc) => (
            <Link
              key={pc.pcId}
              to="/product/pc/$itemId"
              params={{ itemId: pc.pcId.toString() }}
              className="group"
            >
              <Card className="h-full bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                <CardContent className="px-2">
                  <div className="aspect-[4/3] bg-gray-100 rounded-sm mb-1.5 overflow-hidden">
                    {pc.imageUrl ? (
                      <img
                        src={pc.imageUrl}
                        alt={pc.name}
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
                      {pc.name}
                    </h3>
                    <p className="text-sm font-bold text-blue-600">
                      ¥{formatPrice(pc.price)}
                    </p>
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
