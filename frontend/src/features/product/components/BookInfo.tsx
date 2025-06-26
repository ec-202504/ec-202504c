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
import { Badge } from "../../../components/ui/badge";

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
  let color = "";
  switch (book.difficulty) {
    case "初学者":
      color = "bg-green-100 text-green-800 border-green-200";
      break;
    case "中級者":
      color = "bg-yellow-100 text-yellow-800 border-yellow-200";
      break;
    case "上級者":
      color = "bg-red-100 text-red-800 border-red-200";
      break;
    default:
      color = "bg-gray-100 text-gray-800 border-gray-200";
  }
  return (
    <div className="flex gap-12 max-w-5xl mb-8">
      <img
        src={book.imageUrl}
        alt={book.name}
        className="w-96 h-96 object-contain border"
      />
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">{book.name}</h1>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className={`${color} px-1 text-sm`}>
            {book.difficulty}向け
          </Badge>
          <div className="flex items-center text-xl">
            {book.price.toLocaleString()}円
          </div>
        </div>

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
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
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
            className="ml-4 px-6 py-2 text-primary rounded"
          >
            カートへ追加
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <RatingStars average={average} />
          <span>{average}</span>
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
