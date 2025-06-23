import { useState, useCallback } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { TAB_VALUES } from "../types/constants";
import type { SearchParams, PcFilters, BookFilters } from "../types/filters";
import {
  getInitialFilters,
  getSelectedFilterValues,
  buildApiParams,
} from "../utils/filters";

export const useProductFilters = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: "/product/" }) as SearchParams;
  const selectedTab = search.tab || TAB_VALUES.PC;

  // PC用のフィルター条件
  const [pcFilters, setPcFilters] = useState<PcFilters>(
    getInitialFilters(TAB_VALUES.PC, search) as PcFilters,
  );

  // 本用のフィルター条件
  const [bookFilters, setBookFilters] = useState<BookFilters>(
    getInitialFilters(TAB_VALUES.BOOK, search) as BookFilters,
  );

  // 検索クエリ
  const [query, setQuery] = useState<string>(search.query || "");

  // ページ番号
  const [page, setPage] = useState<number>(
    search.page ? Number.parseInt(search.page, 10) : 0,
  );

  // URLパラメータを更新する関数
  const updateUrlParams = useCallback(
    (
      newPcFilters: PcFilters,
      newBookFilters: BookFilters,
      newQuery: string,
      newPage: number,
    ) => {
      const params: SearchParams = {
        tab: selectedTab,
        page: newPage.toString(),
        query: newQuery,
      };

      if (selectedTab === TAB_VALUES.PC) {
        if (newPcFilters.osId) params.osId = newPcFilters.osId;
        if (newPcFilters.cpuId) params.cpuId = newPcFilters.cpuId;
        if (newPcFilters.gpuId) params.gpuId = newPcFilters.gpuId;
        if (newPcFilters.purposeId) params.purposeId = newPcFilters.purposeId;
        if (newPcFilters.deviceType)
          params.deviceType = newPcFilters.deviceType;
      } else {
        if (newBookFilters.languageId)
          params.languageId = newBookFilters.languageId;
        if (newBookFilters.purposeId)
          params.purposeId = newBookFilters.purposeId;
      }

      navigate({
        to: "/product",
        search: params,
        replace: true,
      });
    },
    [selectedTab, navigate],
  );

  // フィルター選択ハンドラー
  const handleFilterChange = useCallback(
    (filterTermId: string, termId: string) => {
      if (selectedTab === TAB_VALUES.PC) {
        const newPcFilters = {
          ...pcFilters,
          [filterTermId]: termId,
        };
        setPcFilters(newPcFilters);
        updateUrlParams(newPcFilters, bookFilters, query, page);
      } else {
        const newBookFilters = {
          ...bookFilters,
          [filterTermId]: termId,
        };
        setBookFilters(newBookFilters);
        updateUrlParams(pcFilters, newBookFilters, query, page);
      }
    },
    [selectedTab, pcFilters, bookFilters, query, page, updateUrlParams],
  );

  // 検索ハンドラー
  const handleSearch = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      setPage(0);
      updateUrlParams(pcFilters, bookFilters, newQuery, 0);
    },
    [pcFilters, bookFilters, updateUrlParams],
  );

  // ページ変更ハンドラー
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      updateUrlParams(pcFilters, bookFilters, query, newPage);
    },
    [pcFilters, bookFilters, query, updateUrlParams],
  );

  // タブ変更ハンドラー
  const handleTabChange = useCallback(
    (newTab: string) => {
      // フィルター条件をリセット
      setPcFilters(getInitialFilters(TAB_VALUES.PC, search) as PcFilters);
      setBookFilters(getInitialFilters(TAB_VALUES.BOOK, search) as BookFilters);
      setQuery("");
      setPage(0);

      navigate({
        to: "/product",
        search: { tab: newTab },
        replace: true,
      });
    },
    [navigate, search],
  );

  // 現在のタブに応じた選択された値を取得
  const getSelectedValues = (): Record<string, string> =>
    getSelectedFilterValues(selectedTab, pcFilters, bookFilters);

  // 現在のタブに応じたパラメータを取得
  const getApiParams = useCallback(
    () => buildApiParams(selectedTab, page, query, pcFilters, bookFilters),
    [selectedTab, page, query, pcFilters, bookFilters],
  );

  return {
    selectedTab,
    pcFilters,
    bookFilters,
    query,
    page,
    handleFilterChange,
    handleSearch,
    handlePageChange,
    handleTabChange,
    getSelectedValues,
    getApiParams,
  };
};
