import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Pc } from "../types";
import { mockRecommendedPcsData } from "../../../mocks/pcData";

type RecommendedProductsProps = {
  currentPcId: number;
  currentPurpose: string;
};

// 価格をカンマ区切りで整形する関数
function formatPrice(price: number) {
  return price.toLocaleString();
}

export default function RecommendedProducts({
  currentPcId,
  currentPurpose,
}: RecommendedProductsProps) {
  const [recommendedPcs, setRecommendedPcs] = useState<Pc[]>([]);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        // ダミーデータを使用（実際のAPIの代わり）
        // 同じ目的のPCを取得（現在のPCを除く）
        const filteredPcs = mockRecommendedPcsData
          .filter(
            (pc) => pc.pcId !== currentPcId && pc.purpose === currentPurpose,
          )
          .slice(0, 4);

        setRecommendedPcs(filteredPcs);
      } catch (error) {
        console.error("推薦商品の取得に失敗しました:", error);
        toast.error("推薦商品の取得に失敗しました");
      }
    };

    fetchRecommendedProducts();
  }, [currentPcId, currentPurpose]);

  if (recommendedPcs.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            おすすめ商品
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedPcs.map((pc) => (
              <Link
                key={pc.pcId}
                to="/product/pc/$itemId"
                params={{ itemId: pc.pcId.toString() }}
                className="block hover:opacity-80 transition-opacity"
              >
                <Card className="h-full border hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      {pc.imageUrl ? (
                        <img
                          src={pc.imageUrl}
                          alt={pc.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">画像なし</div>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-900 text-center mb-1 line-clamp-2">
                      {pc.name}
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      ¥{formatPrice(pc.price)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
