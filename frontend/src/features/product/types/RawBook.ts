export type RawBook = {
  id: number;
  name: string;
  author: string;
  publishDate: string; // ← キャメルケース
  price: number;
  language: {
    id: number;
    name: string;
  };
  purpose: {
    id: number;
    name: string;
  };
};
