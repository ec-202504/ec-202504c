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
import { TAB_VALUES } from "./types/constants";

// URLパラメータの型定義
type SearchParams = {
  tab?: string;
  page?: string;
  query?: string;
  osId?: string;
  cpuId?: string;
  gpuId?: string;
  purposeId?: string;
  languageId?: string;
  deviceType?: string;
};

// フィルター条件の型定義
type PcFilters = {
  osId: string;
  cpuId: string;
  gpuId: string;
  purposeId: string;
  deviceType: string;
};

type BookFilters = {
  languageId: string;
  purposeId: string;
};

export default function ProductListPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [pcs, setPcs] = useState<Product[]>([]);
  const [techBooks, setTechBooks] = useState<Product[]>([]);
  const [filterTerms, setFilterTerms] = useState<FilterTerm[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const PAGE_SIZE = 12;

  // PC用のフィルター条件
  const [pcFilters, setPcFilters] = useState<PcFilters>({
    osId: "",
    cpuId: "",
    gpuId: "",
    purposeId: "",
    deviceType: "",
  });

  // 本用のフィルター条件
  const [bookFilters, setBookFilters] = useState<BookFilters>({
    languageId: "",
    purposeId: "",
  });

  const navigate = useNavigate();

  // URLパラメータからタブの状態を取得
  const search = useSearch({ from: "/product/" }) as SearchParams;
  const selectedTab = search.tab || TAB_VALUES.PC;

  // URLパラメータからフィルター条件を復元
  useEffect(() => {
    if (search.osId || search.cpuId || search.gpuId || search.purposeId) {
      setPcFilters({
        osId: search.osId || "",
        cpuId: search.cpuId || "",
        gpuId: search.gpuId || "",
        purposeId: search.purposeId || "",
        deviceType: search.deviceType || "",
      });
    }

    if (search.languageId || search.purposeId) {
      setBookFilters({
        languageId: search.languageId || "",
        purposeId: search.purposeId || "",
      });
    }

    if (search.query) {
      setQuery(search.query);
    }

    if (search.page) {
      setPage(Number.parseInt(search.page, 10));
    }
  }, [search]);

  const selectedOption = (filterTermId: string, termId: string) => {
    if (selectedTab === TAB_VALUES.PC) {
      const newPcFilters = {
        ...pcFilters,
        [filterTermId]: termId,
      };
      setPcFilters(newPcFilters);
      updateUrlParams(newPcFilters, bookFilters);
    } else {
      const newBookFilters = {
        ...bookFilters,
        [filterTermId]: termId,
      };
      setBookFilters(newBookFilters);
      updateUrlParams(pcFilters, newBookFilters);
    }
  };

  // URLパラメータを更新する関数
  const updateUrlParams = useCallback(
    (pcFilters: PcFilters, bookFilters: BookFilters) => {
      const params: SearchParams = {
        tab: selectedTab,
        page: page.toString(),
        query,
      };

      if (selectedTab === TAB_VALUES.PC) {
        if (pcFilters.osId) params.osId = pcFilters.osId;
        if (pcFilters.cpuId) params.cpuId = pcFilters.cpuId;
        if (pcFilters.gpuId) params.gpuId = pcFilters.gpuId;
        if (pcFilters.purposeId) params.purposeId = pcFilters.purposeId;
        if (pcFilters.deviceType) params.deviceType = pcFilters.deviceType;
      } else {
        if (bookFilters.languageId) params.languageId = bookFilters.languageId;
        if (bookFilters.purposeId) params.purposeId = bookFilters.purposeId;
      }

      navigate({
        to: "/product",
        search: params,
        replace: true,
      });
    },
    [selectedTab, page, query, navigate],
  );

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
  const getSelectedValues = (): Record<string, string> => {
    if (selectedTab === TAB_VALUES.PC) {
      return pcFilters as unknown as Record<string, string>;
    }
    return bookFilters as unknown as Record<string, string>;
  };

  /**
   * 商品データを取得する関数
   *
   * @returns 商品データ
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = await getParams();
      console.log(params);

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
            id: "deviceType",
            label: "種類",
            options: [
              { id: 0, name: "デスクトップPC" },
              { id: 1, name: "ノートPC" },
            ],
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
    setPage(0);

    // URLパラメータを更新
    const params: SearchParams = {
      tab: selectedTab,
      page: "0",
      query,
    };

    if (selectedTab === TAB_VALUES.PC) {
      if (pcFilters.osId) params.osId = pcFilters.osId;
      if (pcFilters.cpuId) params.cpuId = pcFilters.cpuId;
      if (pcFilters.gpuId) params.gpuId = pcFilters.gpuId;
      if (pcFilters.purposeId) params.purposeId = pcFilters.purposeId;
      if (pcFilters.deviceType) params.deviceType = pcFilters.deviceType;
    } else {
      if (bookFilters.languageId) params.languageId = bookFilters.languageId;
      if (bookFilters.purposeId) params.purposeId = bookFilters.purposeId;
    }

    navigate({
      to: "/product",
      search: params,
      replace: true,
    });
  };

  /**
   * ページ変更ハンドラー
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    // URLパラメータを更新
    const params: SearchParams = {
      tab: selectedTab,
      page: newPage.toString(),
      query,
    };

    if (selectedTab === TAB_VALUES.PC) {
      if (pcFilters.osId) params.osId = pcFilters.osId;
      if (pcFilters.cpuId) params.cpuId = pcFilters.cpuId;
      if (pcFilters.gpuId) params.gpuId = pcFilters.gpuId;
      if (pcFilters.purposeId) params.purposeId = pcFilters.purposeId;
      if (pcFilters.deviceType) params.deviceType = pcFilters.deviceType;
    } else {
      if (bookFilters.languageId) params.languageId = bookFilters.languageId;
      if (bookFilters.purposeId) params.purposeId = bookFilters.purposeId;
    }

    navigate({
      to: "/product",
      search: params,
      replace: true,
    });
  };

  /**
   * タブ変更時のハンドラー
   * フィルター条件、検索クエリ、ページ番号をリセットする
   *
   * @param value 選択されたタブの値
   */
  const handleTabChange = (value: string) => {
    navigate({
      to: "/product",
      search: { tab: value },
      replace: true, // tab変更を履歴に残さないようにする
    });

    setFilterTerms([]);
    setQuery("");
    setPage(0);
    setPcFilters({
      osId: "",
      cpuId: "",
      gpuId: "",
      purposeId: "",
      deviceType: "",
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
            onPageChange={handlePageChange}
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
            onPageChange={handlePageChange}
            totalPages={totalPages}
            selectedValues={getSelectedValues()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
