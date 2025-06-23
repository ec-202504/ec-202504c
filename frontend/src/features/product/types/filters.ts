export type SearchParams = {
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

export type PcFilters = {
  osId: string;
  cpuId: string;
  gpuId: string;
  purposeId: string;
  deviceType: string;
};

export type BookFilters = {
  languageId: string;
  purposeId: string;
};
