import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// PC用の比較atom
export const pcComparisonAtom = atomWithStorage<number[]>("pcComparison", []);
export const bookComparisonAtom = atomWithStorage<number[]>(
  "bookComparison",
  [],
);

// PCを比較に追加するatom
export const addPcToComparisonAtom = atom(
  null,
  (get, set, productId: number) => {
    const current = get(pcComparisonAtom);

    if (!current.includes(productId)) {
      set(pcComparisonAtom, [...current, productId]);
    }
  },
);

// 技術書を比較に追加するatom
export const addBookToComparisonAtom = atom(
  null,
  (get, set, productId: number) => {
    const current = get(bookComparisonAtom);

    if (!current.includes(productId)) {
      set(bookComparisonAtom, [...current, productId]);
    }
  },
);

// PCを比較から削除するatom
export const removePcFromComparisonAtom = atom(
  null,
  (get, set, productId: number) => {
    const current = get(pcComparisonAtom);
    const newState = current.filter((id) => id !== productId);
    set(pcComparisonAtom, newState);
  },
);

// 技術書を比較から削除するatom
export const removeBookFromComparisonAtom = atom(
  null,
  (get, set, productId: number) => {
    const current = get(bookComparisonAtom);
    const newState = current.filter((id) => id !== productId);
    set(bookComparisonAtom, newState);
  },
);

// PC比較リストをクリアするatom
export const clearPcComparisonAtom = atom(null, (_, set) => {
  set(pcComparisonAtom, []);
});

// 技術書比較リストをクリアするatom
export const clearBookComparisonAtom = atom(null, (_, set) => {
  set(bookComparisonAtom, []);
});
