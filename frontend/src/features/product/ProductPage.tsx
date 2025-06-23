import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import ProductList from "./components/ProductList";
import type { FilterTerm, Product } from "./types";
import { axiosInstance } from "../../lib/axiosInstance";
import LoadingOverlay from "./components/LoadingOverlay";
import { toast } from "sonner";
import { TAB_VALUES } from "./types/constants";

export default function ProductListPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [pcs, setPcs] = useState<Product[]>([]);
  const [techBooks, setTechBooks] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const PAGE_SIZE = 12;

  const navigate = useNavigate();

  // URLパラメータからタブの状態を取得
  const search = useSearch({ from: "/product/" });
  const selectedTab = search.tab || TAB_VALUES.PC;

  const selectedOption = (option: string) => {
    console.log(option);
  };

  const filterTerms: FilterTerm[] = [
    {
      id: 1,
      label: "OS",
      options: ["Mac", "Windows"],
    },
    {
      id: 2,
      label: "種類",
      options: ["ノートPC", "デスクトップPC"],
    },
    {
      id: 3,
      label: "用途",
      options: ["個人開発", "大規模開発"],
    },
    {
      id: 4,
      label: "予算",
      options: ["0", "100"],
    },
    {
      id: 5,
      label: "ディスプレイサイズ(インチ)",
      options: ["27以上", "23~26", "20~22", "17~19", "15~16", "14以下"],
    },
  ];

  /**
   * 商品データを取得する関数
   *
   * @returns 商品データ
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/${selectedTab}`, {
        params: {
          page: page - 1, // バックエンドのページ番号は0から始まるため、1を引く
          size: PAGE_SIZE,
          keyword: query,
        },
      });

      if (selectedTab === TAB_VALUES.PC) {
        setPcs(response.data?.content);
      } else {
        setTechBooks(response.data?.content);
      }
      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      toast.error("APIリクエストに失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, [selectedTab, page, query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * 検索フォームの送信ハンドラー
   *
   * @param e イベントオブジェクト
   * @param query 検索クエリ
   */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    query: string,
  ) => {
    e.preventDefault();
    setQuery(query);
    setPage(1); // 検索ボタンを押したらページを1に戻す
  };

  /**
   * タブ変更時のハンドラー
   *
   * @param value 選択されたタブの値
   */
  const handleTabChange = (value: string) => {
    navigate({
      to: "/product",
      search: { tab: value },
      replace: true, // tab変更を履歴に残さないようにする
    });

    setQuery("");
    setPage(1);
  };

  return (
    <div className="p-4 h-80vh">
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <Tabs
          value={selectedTab}
          onValueChange={handleTabChange}
          className="mb-4"
        >
          <TabsList>
            <TabsTrigger value={TAB_VALUES.PC}>PC</TabsTrigger>
            <TabsTrigger value={TAB_VALUES.BOOK}>技術書</TabsTrigger>
          </TabsList>

          <TabsContent value={TAB_VALUES.PC}>
            <ProductList
              selectedTab={selectedTab}
              products={pcs}
              filterTerms={filterTerms}
              selectedOption={selectedOption}
              handleSubmit={handleSubmit}
              currentPage={page}
              onPageChange={setPage}
              totalPages={totalPages}
            />
          </TabsContent>

          <TabsContent value={TAB_VALUES.BOOK}>
            <ProductList
              selectedTab={selectedTab}
              products={techBooks}
              filterTerms={filterTerms}
              selectedOption={selectedOption}
              handleSubmit={handleSubmit}
              currentPage={page}
              onPageChange={setPage}
              totalPages={totalPages}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
