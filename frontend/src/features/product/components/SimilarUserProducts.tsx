import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "../../../components/ui/card";
import { mockRecommendedPcsData } from "../../../mocks/pcData";

// 価格をカンマ区切りで整形する関数
function formatPrice(price: number) {
  return price.toLocaleString();
}

export default function SimilarUserProducts() {
  const similarUserPcs = mockRecommendedPcsData.slice(0, 3); // 3つの商品を表示

  if (similarUserPcs.length === 0) {
    return null;
  }

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

      <div className="grid grid-cols-2 gap-3">
        {similarUserPcs.map((pc) => (
          <Link
            key={pc.pcId}
            to="/product/pc/$itemId"
            params={{ itemId: pc.pcId.toString() }}
            className="group"
          >
            <Card className="h-full bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
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
                  <h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {pc.name}
                  </h4>
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
  );
}
