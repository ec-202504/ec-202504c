import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "../../../components/ui/card";
import { mockRecommendedPcsData } from "../../../mocks/pcData";

// 価格をカンマ区切りで整形する関数
function formatPrice(price: number) {
  return price.toLocaleString();
}

export default function RecommendedProducts() {
  const recommendedPcs = mockRecommendedPcsData;

  if (recommendedPcs.length === 0) {
    return null;
  }

  return (
    <section className="py-5 mb-5 bg-gray-50 rounded-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">関連商品</h2>
          <p className="text-gray-600">この商品に関連する商品をご紹介</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedPcs.map((pc) => (
            <Link
              key={pc.pcId}
              to="/product/pc/$itemId"
              params={{ itemId: pc.pcId.toString() }}
              className="group"
            >
              <Card className="h-full bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                <CardContent className="px-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    {pc.imageUrl ? (
                      <img
                        src={pc.imageUrl}
                        alt={pc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-gray-400 text-sm">画像なし</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {pc.name}
                    </h3>
                    <p className="text-xl font-bold text-blue-600">
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
