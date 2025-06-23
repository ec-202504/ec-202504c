import type { SearchParams, PcFilters, BookFilters } from "../types/filters";

/**
 * 検索フォームの送信ハンドラー
 */
export const createSearchSubmitHandler = (
  handleSearch: (query: string) => void,
) => {
  return (e: React.FormEvent<HTMLFormElement>, query: string) => {
    e.preventDefault();
    handleSearch(query);
  };
};

/**
 * URLパラメータから検索条件を構築
 */
export const buildSearchParams = (
  selectedTab: string,
  pcFilters: PcFilters,
  bookFilters: BookFilters,
  query: string,
  page: number,
): SearchParams => {
  const params: SearchParams = {
    tab: selectedTab,
    page: page.toString(),
    query,
  };

  if (selectedTab === "pcs") {
    if (pcFilters.osId) params.osId = pcFilters.osId;
    if (pcFilters.cpuId) params.cpuId = pcFilters.cpuId;
    if (pcFilters.gpuId) params.gpuId = pcFilters.gpuId;
    if (pcFilters.purposeId) params.purposeId = pcFilters.purposeId;
    if (pcFilters.deviceType) params.deviceType = pcFilters.deviceType;
  } else {
    if (bookFilters.languageId) params.languageId = bookFilters.languageId;
    if (bookFilters.purposeId) params.purposeId = bookFilters.purposeId;
  }

  return params;
};
