import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../../../lib/axiosInstance";
import type { Product, FilterTerm } from "../types";
import { TAB_VALUES } from "../types/constants";

/**
 * 商品データとフィルター条件を取得・管理するカスタムフック
 *
 * @param selectedTab - 現在選択されているタブ（PC/BOOK）
 * @param getApiParams - APIリクエスト用のパラメータ取得関数
 * @returns 商品リスト・フィルター条件・ローディング状態・ページ数・再取得関数
 */
export const useProductData = (
  selectedTab: string,
  getApiParams: () => Record<string, string | number>,
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pcs, setPcs] = useState<Product[]>([]);
  const [techBooks, setTechBooks] = useState<Product[]>([]);
  const [filterTerms, setFilterTerms] = useState<FilterTerm[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  /**
   * 商品データをAPIから取得し、状態を更新する
   *
   * @async
   * @returns {Promise<void>}
   * - 選択中タブに応じて商品リスト・フィルター条件を取得
   * - ローディング状態も管理
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = getApiParams();

      const productListResponse = await axiosInstance.get(`/${selectedTab}`, {
        params,
      });
      setTotalPages(productListResponse.data?.totalPages - 1 || 1);

      if (selectedTab === TAB_VALUES.PC) {
        setPcs(productListResponse.data?.content);
        await fetchPcFilterTerms();
      } else {
        setTechBooks(productListResponse.data?.content);
        await fetchBookFilterTerms();
      }
    } catch (error) {
      console.error("APIリクエストに失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTab, getApiParams]);

  /**
   * PC用のフィルター条件をAPIから取得し、状態を更新する
   *
   * @async
   * @returns {Promise<void>}
   */
  const fetchPcFilterTerms = async () => {
    try {
      const [
        osListResponse,
        cpuListResponse,
        gpuListResponse,
        purposeListResponse,
      ] = await Promise.all([
        axiosInstance.get("/pcs/oses"),
        axiosInstance.get("/pcs/cpus"),
        axiosInstance.get("/pcs/gpus"),
        axiosInstance.get("/pcs/purposes"),
      ]);

      setFilterTerms([
        {
          id: "purposeId",
          label: "用途",
          options: purposeListResponse.data,
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
      ]);
    } catch (error) {
      console.error("PCフィルター条件の取得に失敗しました:", error);
    }
  };

  /**
   * 本用のフィルター条件をAPIから取得し、状態を更新する
   *
   * @async
   * @returns {Promise<void>}
   */
  const fetchBookFilterTerms = async () => {
    try {
      const [languageListResponse, purposeListResponse] = await Promise.all([
        axiosInstance.get("/books/languages"),
        axiosInstance.get("/books/purposes"),
      ]);

      setFilterTerms([
        {
          id: "purposeId",
          label: "用途",
          options: purposeListResponse.data,
        },
        {
          id: "languageId",
          label: "言語",
          options: languageListResponse.data,
        },
      ]);
    } catch (error) {
      console.error("本フィルター条件の取得に失敗しました:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    isLoading,
    pcs,
    techBooks,
    filterTerms,
    totalPages,
    refetch: fetchData,
  };
};
