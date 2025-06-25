export const TAB_VALUES = {
  PC: "pcs",
  BOOK: "books",
} as const;

// TabValues = "pcs" | "books"と同義
export type TabValues = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];
