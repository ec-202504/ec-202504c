import { TAB_VALUES } from "../types/constants";
import type { SearchParams, PcFilters, BookFilters } from "../types/filters";

export const getInitialFilters = (
  tab: string,
  search: SearchParams,
): PcFilters | BookFilters =>
  tab === TAB_VALUES.PC
    ? {
        osId: search.osId || "",
        cpuId: search.cpuId || "",
        gpuId: search.gpuId || "",
        purposeId: search.purposeId || "",
        deviceType: search.deviceType || "",
        price: search.price || "",
      }
    : {
        languageId: search.languageId || "",
        purposeId: search.purposeId || "",
        difficultyId: search.difficultyId || "",
        price: search.price || "",
      };

export const getSelectedFilterValues = (
  tab: string,
  pcFilters: PcFilters,
  bookFilters: BookFilters,
): Record<string, string> => (tab === TAB_VALUES.PC ? pcFilters : bookFilters);

export const buildApiParams = (
  tab: string,
  page: number,
  query: string,
  pcFilters: PcFilters,
  bookFilters: BookFilters,
  price?: string,
) => {
  const base = { page, size: 12, name: query };
  const filters = tab === TAB_VALUES.PC ? pcFilters : bookFilters;
  const params: Record<string, string | number> = {
    ...base,
    ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "")),
  };
  if (price) {
    params.price = price;
  }
  return params;
};
