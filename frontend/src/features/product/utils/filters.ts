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
      }
    : {
        languageId: search.languageId || "",
        purposeId: search.purposeId || "",
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
) => {
  const base = { page, size: 12, name: query };
  const filters = tab === TAB_VALUES.PC ? pcFilters : bookFilters;
  return {
    ...base,
    ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "")),
  };
};
