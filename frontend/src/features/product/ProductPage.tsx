import { useCallback, useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import ProductList from "./components/ProductList";
import type { FilterTerm, Product } from "./types";
import { axiosInstance } from "../../lib/axiosInstance";
import { TAB_VALUES } from "./types/constants";

export default function ProductListPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [pcs, setPcs] = useState<Product[]>([]);
  const [techBooks, setTechBooks] = useState<Product[]>([]);
  const [filterTerms, setFilterTerms] = useState<FilterTerm[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>(TAB_VALUES.PC);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const PAGE_SIZE = 12;

  // PC用のフィルター条件
  const [pcFilters, setPcFilters] = useState({
    osId: "",
    cpuId: "",
    gpuId: "",
    purposeId: "",
  });

  // 本用のフィルター条件
  const [bookFilters, setBookFilters] = useState({
    languageId: "",
    purposeId: "",
  });

  const selectedOption = (filterTermId: string, termId: string) => {
    console.log(`FilterTerm ID: ${filterTermId}, Term ID: ${termId}`);

    if (selectedTab === TAB_VALUES.PC) {
      setPcFilters((prev) => ({
        ...prev,
        [filterTermId]: termId,
      }));
    }
    setBookFilters((prev) => ({
      ...prev,
      [filterTermId]: termId,
    }));
  };

  /**
   * 現在のタブに応じたパラメータを取得
   */
  const getParams = useCallback(async () => {
    const baseParams = {
      page: page,
      size: PAGE_SIZE,
      name: query,
    };

    if (selectedTab === TAB_VALUES.PC) {
      return {
        ...baseParams,
        ...Object.fromEntries(
          Object.entries(pcFilters).filter(([, value]) => value !== ""),
        ),
      };
    }
    return {
      ...baseParams,
      ...Object.fromEntries(
        Object.entries(bookFilters).filter(([, value]) => value !== ""),
      ),
    };
  }, [selectedTab, page, query, pcFilters, bookFilters]);

  /**
   * 現在のタブに応じた選択された値を取得
   */
  const getSelectedValues = () => {
    if (selectedTab === TAB_VALUES.PC) {
      return pcFilters;
    }
    return bookFilters;
  };

  /**
   * 商品データを取得する関数
   *
   * @returns 商品データ
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = getParams();

      const productListResponse = await axiosInstance.get(`/${selectedTab}`, {
        params,
      });
      setTotalPages(productListResponse.data?.totalPages - 1 || 1);

      if (selectedTab === TAB_VALUES.PC) {
        setPcs(productListResponse.data?.content);
        const osListResponse = await axiosInstance.get("/pcs/oses");
        const cpuListResponse = await axiosInstance.get("/pcs/cpus");
        const gpuListResponse = await axiosInstance.get("/pcs/gpus");
        const purposeListResponse = await axiosInstance.get("/pcs/purposes");

        setFilterTerms([
          {
            id: "osId",
            label: "OS",
            options: osListResponse.data,
          },
          {
            id: "cpuId",
            label: "CPU",
            options: cpuListResponse.data,
          },
          {
            id: "gpuId",
            label: "GPU",
            options: gpuListResponse.data,
          },
          {
            id: "purposeId",
            label: "用途",
            options: purposeListResponse.data,
          },
        ]);
      } else {
        setTechBooks(productListResponse.data?.content);
        const languageListResponse =
          await axiosInstance.get("/books/languages");
        const purposeListResponse = await axiosInstance.get("/books/purposes");
        setFilterTerms([
          {
            id: "languageId",
            label: "言語",
            options: languageListResponse.data,
          },
          {
            id: "purposeId",
            label: "用途",
            options: purposeListResponse.data,
          },
        ]);
      }
    } catch (error) {
      console.error("APIリクエストに失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTab, getParams]);

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
    setPage(1);
  };

  /**
   * タブ変更時のハンドラー
   * フィルター条件、検索クエリ、ページ番号をリセットする
   *
   * @param value 選択されたタブの値
   */
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setFilterTerms([]);
    setQuery("");
    setPage(1);
    setPcFilters({
      osId: "",
      cpuId: "",
      gpuId: "",
      purposeId: "",
    });
    setBookFilters({
      languageId: "",
      purposeId: "",
    });
  };

  return (
    <div className="p-4 h-80vh">
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
            isLoading={isLoading}
            selectedTab={selectedTab}
            products={pcs}
            filterTerms={filterTerms}
            selectedOption={selectedOption}
            handleSubmit={handleSubmit}
            currentPage={page}
            onPageChange={setPage}
            totalPages={totalPages}
            selectedValues={getSelectedValues()}
          />
        </TabsContent>

        <TabsContent value={TAB_VALUES.BOOK}>
          <ProductList
            isLoading={isLoading}
            selectedTab={selectedTab}
            products={techBooks}
            filterTerms={filterTerms}
            selectedOption={selectedOption}
            handleSubmit={handleSubmit}
            currentPage={page}
            onPageChange={setPage}
            totalPages={totalPages}
            selectedValues={getSelectedValues()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
