import { useState } from "react";
import { PcSpecList } from "./PcSpecList";
import { RatingStars } from "./RatingStars";

type Pc = {
  id: number;
  name: string;
  price: number;
  memory: number;
  storage: number;
  device_size: number;
  device_type: number;
  os: string;
  cpu: string;
  gpu: string;
  purpose: string;
  imageUrl: string;
  warranty: string;
};

type PcInfoProps = {
  pc: Pc;
  quantity: number;
  handleClick: (q: number) => void;
  average: number;
  totalReviews: number;
};

const PcInfo = ({
  pc,
  quantity,
  handleClick,
  average,
  totalReviews,
}: PcInfoProps) => {
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  return (
    <div className="flex gap-12 w-2/3 max-w-5xl mb-8">
      <img
        src={pc.imageUrl}
        alt={pc.name}
        className="w-96 h-96 object-contain border"
      />
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">{pc.name}</h1>
        <div className="text-xl mb-4">{pc.price.toLocaleString()}円</div>
        <div className="flex items-center gap-2 mb-4">
          <span>数量</span>
          <select
            value={quantity}
            onChange={(e) => setSelectedQuantity(Number(e.target.value))}
            className="border rounded px-2 w-16"
          >
            {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              handleClick(selectedQuantity);
            }}
            className="ml-4 px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            カートへ追加
          </button>
        </div>
        <div className="flex items-center gap-2">
          <RatingStars average={average} />
          <span className="underline cursor-pointer">
            {totalReviews}件の評価
          </span>
        </div>
        <div className="font-bold mb-2">仕様</div>
        <PcSpecList pc={pc} />
      </div>
    </div>
  );
};

export default PcInfo;
