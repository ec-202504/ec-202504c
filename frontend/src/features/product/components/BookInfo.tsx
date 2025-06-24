import { useState } from "react";
import BookDetails from "./BookSpecList";
import RatingStars from "../../../components/RatingStars";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import type { Book } from "../types";

type BookInfoProps = {
  book: Book;
  handleClick: (q: number) => void;
  average: number;
  totalReviews: number;
};

export default function BookInfo({
  book,
  handleClick,
  average,
  totalReviews,
}: BookInfoProps) {
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  return (
    <div className="flex gap-12 w-2/3 max-w-5xl mb-8">
      <img
        src={book.imageUrl}
        alt={book.name}
        className="w-96 h-96 object-contain border"
      />
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">{book.name}</h1>
        <div className="text-xl mb-4">{book.price.toLocaleString()}円</div>

        <div className="flex items-center gap-2 mb-4">
          <span>数量</span>
          <Select
            value={selectedQuantity.toString()}
            defaultValue="1"
            onValueChange={(value) => setSelectedQuantity(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={() => {
              handleClick(selectedQuantity);
            }}
            className="ml-4 px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            カートへ追加
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <RatingStars average={average} />
          <span className="underline cursor-pointer">
            {totalReviews}件の評価
          </span>
        </div>

        <div className="font-bold mb-2">詳細情報</div>
        <BookDetails book={book} />
      </div>
    </div>
  );
}
