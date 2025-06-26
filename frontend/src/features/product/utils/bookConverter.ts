import type { Book, RawBook } from "../types/Book";

export const convertToBook = (raw: RawBook): Book => {
  return {
    bookId: raw.book.id,
    name: raw.book.name,
    imageUrl: "",
    price: raw.book.price,
    author: raw.book.author,
    language: raw.book.language.name,
    purpose: raw.book.purpose.name,
    publishDate: raw.book.publishDate,
  };
};
