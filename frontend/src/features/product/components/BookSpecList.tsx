import type { Book } from "../types";

type BookSummaryProps = {
  book: Book;
};

export default function BookSummary({ book }: BookSummaryProps) {
  return (
    <ul className="text-base mb-2">
      <li className="flex">
        <div className="w-[80px] font-bold">著者：</div>
        {book.author}
      </li>
      <li className="flex">
        <div className="w-[80px] font-bold">出版日：</div>
        {book.publish_date}
      </li>
      <li className="flex">
        <div className="w-[80px] font-bold">言語：</div>
        {book.language}
      </li>
      <li className="flex">
        <div className="w-[80px] font-bold">目的：</div>
        {book.purpose}
      </li>
    </ul>
  );
}
