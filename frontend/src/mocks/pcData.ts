import type { Pc } from "../features/product/types/Pc";
import type { Review } from "../features/product/types/Review";

// PCの詳細データ
export const mockPcData: Pc = {
  pcId: 1,
  name: "Gaming Master Pro X",
  imageUrl:
    "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop",
  price: 189800,
  memory: 32,
  storage: 1000,
  deviceSize: 15,
  deviceType: 1, // 1: ノートPC, 0: デスクトップ
  os: "Windows 11 Pro",
  cpu: "Intel Core i7-13700H",
  gpu: "NVIDIA GeForce RTX 4070",
  purpose: "ゲーミング",
};

// レビューデータ
export const mockReviewsData: Review[] = [
  {
    id: 1,
    comment:
      "ゲーミング性能が素晴らしいです。最新のゲームも快適に動作します。画面も美しく、長時間のゲームプレイでも疲れません。",
    rating: 5,
    reviewDateTime: "2024-01-15T10:30:00Z",
    userId: 1,
    userName: "ゲーマー太郎",
  },
  {
    id: 2,
    comment:
      "デザインがスタイリッシュで、持ち運びも便利です。バッテリーの持ちも良く、外出先でも安心して使えます。",
    rating: 4,
    reviewDateTime: "2024-01-10T14:20:00Z",
    userId: 2,
    userName: "テック好き",
  },
  {
    id: 3,
    comment:
      "価格の割に性能が良く、コストパフォーマンスが優秀です。ただし、少し重いのが気になります。",
    rating: 4,
    reviewDateTime: "2024-01-08T09:15:00Z",
    userId: 3,
    userName: "コスト重視",
  },
  {
    id: 4,
    comment:
      "初期設定が簡単で、すぐに使い始められました。音質も良く、動画編集も快適です。",
    rating: 5,
    reviewDateTime: "2024-01-05T16:45:00Z",
    userId: 4,
    userName: "クリエイター",
  },
  {
    id: 5,
    comment:
      "全体的に満足していますが、発熱が少し気になります。冷却性能をもう少し改善してほしいです。",
    rating: 3,
    reviewDateTime: "2024-01-03T11:30:00Z",
    userId: 5,
    userName: "熱管理重視",
  },
];

// 推薦商品データ（同じ目的のPC）
export const mockRecommendedPcsData: Pc[] = [
  {
    pcId: 2,
    name: "Gaming Elite 15",
    imageUrl:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
    price: 159800,
    memory: 16,
    storage: 512,
    deviceSize: 15,
    deviceType: 1,
    os: "Windows 11 Home",
    cpu: "Intel Core i5-13500H",
    gpu: "NVIDIA GeForce RTX 4060",
    purpose: "ゲーミング",
  },
  {
    pcId: 3,
    name: "Gaming Beast Pro",
    imageUrl:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop",
    price: 229800,
    memory: 64,
    storage: 2000,
    deviceSize: 17,
    deviceType: 1,
    os: "Windows 11 Pro",
    cpu: "Intel Core i9-13900H",
    gpu: "NVIDIA GeForce RTX 4080",
    purpose: "ゲーミング",
  },
  {
    pcId: 4,
    name: "Gaming Compact X",
    imageUrl:
      "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400&h=400&fit=crop",
    price: 129800,
    memory: 16,
    storage: 1000,
    deviceSize: 14,
    deviceType: 1,
    os: "Windows 11 Home",
    cpu: "AMD Ryzen 7 7735HS",
    gpu: "AMD Radeon RX 7600S",
    purpose: "ゲーミング",
  },
];
