import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { TAB_VALUES, type TabValues } from "../types/constants";
import type { SearchParams, PcFilters, BookFilters } from "../types/filters";
import {
  getInitialFilters,
  getSelectedFilterValues,
  buildApiParams,
} from "../utils/filters";

export const useProductFilters = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: "/product/" }) as SearchParams;
  const selectedTab = search.tab as TabValues;

  // PC用のフィルター条件
  const [pcFilters, setPcFilters] = useState<PcFilters>(
    getInitialFilters(TAB_VALUES.PC, search) as PcFilters,
  );

  // 本用のフィルター条件
  const [bookFilters, setBookFilters] = useState<BookFilters>(
    getInitialFilters(TAB_VALUES.BOOK, search) as BookFilters,
  );

  // 予算（上限）
  const [price, setPrice] = useState<string>(search.price || "");

  // 検索クエリ
  const [query, setQuery] = useState<string>(search.query || "");

  // ページ番号
  const [page, setPage] = useState<number>(
    search.page ? Number.parseInt(search.page, 10) : 0,
  );

  // searchパラメータが変更された時に状態を同期
  useEffect(() => {
    const currentTab = search.tab || TAB_VALUES.PC;

    // タブが変更された場合のみ状態をリセット
    if (currentTab !== selectedTab) {
      setPcFilters(getInitialFilters(TAB_VALUES.PC, search) as PcFilters);
      setBookFilters(getInitialFilters(TAB_VALUES.BOOK, search) as BookFilters);
      setQuery(search.query || "");
      setPage(search.page ? Number.parseInt(search.page, 10) : 0);
      setPrice(search.price || "");
    } else {
      // 同じタブ内でのパラメータ変更
      if (currentTab === TAB_VALUES.PC) {
        setPcFilters(getInitialFilters(TAB_VALUES.PC, search) as PcFilters);
      } else {
        setBookFilters(
          getInitialFilters(TAB_VALUES.BOOK, search) as BookFilters,
        );
      }
      setQuery(search.query || "");
      setPage(search.page ? Number.parseInt(search.page, 10) : 0);
      setPrice(search.price || "");
    }
  }, [search, selectedTab]);

  // URLパラメータを更新する関数
  const updateUrlParams = useCallback(
    (
      newPcFilters: PcFilters,
      newBookFilters: BookFilters,
      newQuery: string,
      newPage: number,
      newPrice: string,
    ) => {
      const params: SearchParams = {
        tab: selectedTab,
        page: newPage.toString(),
        query: newQuery,
        price: newPrice,
      };

      if (selectedTab === TAB_VALUES.PC) {
        if (newPcFilters.osId) params.osId = newPcFilters.osId;
        if (newPcFilters.cpuId) params.cpuId = newPcFilters.cpuId;
        if (newPcFilters.gpuId) params.gpuId = newPcFilters.gpuId;
        if (newPcFilters.purposeId) params.purposeId = newPcFilters.purposeId;
        if (newPcFilters.deviceType)
          params.deviceType = newPcFilters.deviceType;
        if (newPcFilters.price) params.price = newPcFilters.price;
      } else {
        if (newBookFilters.languageId)
          params.languageId = newBookFilters.languageId;
        if (newBookFilters.purposeId)
          params.purposeId = newBookFilters.purposeId;
        if (newBookFilters.difficultyId)
          params.difficultyId = newBookFilters.difficultyId;
        if (newBookFilters.price) params.price = newBookFilters.price;
      }

      navigate({
        to: "/product",
        search: params,
        replace: true,
      });
    },
    [selectedTab, navigate],
  );

  /**
   * フィルター選択時のハンドラー
   *
   * @param filterTermId - 変更対象のフィルター項目ID。全クリア時は空文字。
   * @param termId - 選択されたフィルター値のID。全クリア時は空文字。
   *
   * - 通常のフィルター選択時は該当フィルターのみ変更し、ページ・クエリをリセット。
   * - 全ての絞り込み条件をクリアしたい場合は両方空文字で呼び出す。
   * - 状態変更後、URLパラメータも更新する。
   */
  const handleFilterChange = useCallback(
    (filterTermId: string, termId: string) => {
      setPage(0);
      setQuery("");
      if (selectedTab === TAB_VALUES.PC) {
        const newPcFilters = {
          ...pcFilters,
          [filterTermId]: termId,
        };
        setPcFilters(newPcFilters);
        updateUrlParams(newPcFilters, bookFilters, query, 0, price);
      } else {
        const newBookFilters = {
          ...bookFilters,
          [filterTermId]: termId,
        };
        setBookFilters(newBookFilters);
        updateUrlParams(pcFilters, newBookFilters, query, 0, price);
      }
    },
    [selectedTab, pcFilters, bookFilters, query, updateUrlParams, price],
  );

  /**
   * 検索クエリが送信されたときのハンドラー
   *
   * @param newQuery - 新しい検索クエリ
   *
   * 検索クエリが変更された際に、フィルター・ページ番号・予算をリセットし、
   * URLパラメータも更新する。
   */
  const handleSearch = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      setPcFilters(getInitialFilters(TAB_VALUES.PC, {}) as PcFilters);
      setBookFilters(getInitialFilters(TAB_VALUES.BOOK, {}) as BookFilters);
      setPage(0);
      setPrice("");
      updateUrlParams(pcFilters, bookFilters, newQuery, 0, price);
    },
    [pcFilters, bookFilters, updateUrlParams, price],
  );

  /**
   * ページ番号が変更されたときのハンドラー
   *
   * @param newPage - 新しいページ番号
   *
   * ページ番号が変更された際に、状態を更新し、URLパラメータも更新する。
   * ページネーション操作時に呼び出される。
   */
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      updateUrlParams(pcFilters, bookFilters, query, newPage, price);
    },
    [pcFilters, bookFilters, query, updateUrlParams, price],
  );

  // タブ変更ハンドラー
  const handleTabChange = useCallback(
    (newTab: string) => {
      // URLパラメータを完全にリセットして新しいタブのみ設定
      // 状態の更新は useEffect で自動的に行われる
      navigate({
        to: "/product",
        search: { tab: newTab },
        replace: true,
      });
    },
    [navigate],
  );

  // 予算（上限）変更ハンドラ
  const handlePriceChange = useCallback(
    (newPrice: string) => {
      setPrice(newPrice);
      if (selectedTab === TAB_VALUES.PC) {
        const newPcFilters = { price: newPrice, ...pcFilters };
        setPcFilters(newPcFilters);
        updateUrlParams(newPcFilters, bookFilters, query, 0, newPrice);
      } else {
        const newBookFilters = {
          price: newPrice,
          ...bookFilters,
        };
        setBookFilters(newBookFilters);
        updateUrlParams(pcFilters, newBookFilters, query, 0, newPrice);
      }
    },
    [selectedTab, pcFilters, bookFilters, query, updateUrlParams],
  );

  // 現在のタブに応じた選択された値を取得
  const getSelectedValues = (): Record<string, string> =>
    getSelectedFilterValues(selectedTab, pcFilters, bookFilters);

  // 現在のタブに応じたパラメータを取得
  const getApiParams = useCallback(
    () =>
      buildApiParams(selectedTab, page, query, pcFilters, bookFilters, price),
    [selectedTab, page, query, pcFilters, bookFilters, price],
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
    price,
    handlePriceChange,
  };
};
