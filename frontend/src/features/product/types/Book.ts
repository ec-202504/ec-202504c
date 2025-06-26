export type Book = {
  bookId: number;
  imageUrl: string;
  name: string;
  author: string;
  publishDate: string;
  price: number;
  language: string;
  purpose: string;
  difficulty: string;
};

export type RawBook = {
  book: {
    id: number;
    imageUrl: string;
    name: string;
    author: string;
    publishDate: string;
    price: number;
    language: {
      id: number;
      name: string;
    };
    purpose: {
      id: number;
      name: string;
    };
    difficulty: {
      id: number;
      target: string;
    };
  };
};
