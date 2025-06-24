import type { Book } from "../../product/types/Book";
import type { Pc } from "../../product/types/Pc";

// 商品カテゴリの型定義
export type ProductCategory = "pc" | "book";

// 比較用の商品型定義（既存の型を拡張）
export type ComparisonPc = Pc & {
  rating: number;
  specs: {
    プロセッサ: string;
    メモリ: string;
    ストレージ: string;
    ディスプレイ: string;
    重量: string;
    バッテリー: string;
    OS: string;
  };
};

export type ComparisonBook = Book & {
  rating: number;
  specs: {
    著者: string;
    出版社: string;
    ページ数: string;
    言語: string;
    発売日: string;
    ISBN: string;
    ジャンル: string;
  };
};
