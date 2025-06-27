import Sidebar from "./Sidebar";
import type { Product, FilterTerm, TabValues } from "../types";
import SearchForm from "./SearchForm";
import ProductCard from "./ProductCard";
import LoadingOverlay from "./LoadingOverlay";
import ProductPagination from "./ProductPagination";
import { useAtom } from "jotai";
import { pcComparisonAtom } from "../../../stores/productComparisonAtom";
import { bookComparisonAtom } from "../../../stores/productComparisonAtom";
import { TAB_VALUES } from "../types/constants";

type Props = {
  isLoading: boolean;
  selectedTab: TabValues;
  products: Product[];
  filterTerms: FilterTerm[];
  selectedOption: (filterTermId: string, termId: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, query: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  selectedValues?: Record<string, string>;
  price?: string;
  onPriceChange?: (price: string) => void;
  onAddToComparison: (productId: number) => void;
  onRemoveFromComparison: (productId: number) => void;
};

export default function ProductList({
  isLoading,
  selectedTab,
  products,
  filterTerms,
  selectedOption,
  handleSubmit,
  currentPage,
  onPageChange,
  totalPages,
  selectedValues = {},
  price,
  onPriceChange,
  onAddToComparison,
  onRemoveFromComparison,
}: Props) {
  // 現在選択されている商品のID
  const [pcComparisonIds] = useAtom(pcComparisonAtom);
  const [bookComparisonIds] = useAtom(bookComparisonAtom);

  /**
   * 選択時のハンドラー
   *
   * @param productId 商品ID
   * @param isSelected 選択状態
   */
  const handleSelectionChange = (productId: number, isSelected: boolean) => {
    if (isSelected) {
      onAddToComparison(productId);
    } else {
      onRemoveFromComparison(productId);
    }
  };

  /**
   * 商品が選択されているかどうかを判定する
   *
   * @param productId 商品ID
   * @returns 選択されているかどうか
   */
  const isSelected = (productId: number) => {
    return selectedTab === TAB_VALUES.PC
      ? pcComparisonIds.includes(Number(productId))
      : bookComparisonIds.includes(Number(productId));
  };

  return (
    <div className="flex gap-4">
      <Sidebar
        selectedOption={selectedOption}
        filterTerms={filterTerms}
        selectedValues={selectedValues}
        price={price}
        onPriceChange={onPriceChange}
      />

      <div className="flex-1">
        <SearchForm onSubmit={handleSubmit} selectedTab={selectedTab} />

        {isLoading ? (
          <LoadingOverlay />
        ) : (
          <>
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-60 w-full bg-card border border-border rounded-lg shadow-sm mt-8 mb-8">
                <div className="text-lg text-muted-foreground font-semibold">
                  該当する商品が見つかりません
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4 mb-4">
                {products.map((product) => (
                  <ProductCard
                    selectedTab={selectedTab}
                    product={product}
                    key={product.id}
                    selected={isSelected(Number(product.id))}
                    onSelectionChange={handleSelectionChange}
                  />
                ))}
              </div>
            )}

            <ProductPagination
              currentPage={currentPage}
              onPageChange={onPageChange}
              totalPages={totalPages}
            />
          </>
        )}
      </div>
    </div>
  );
}
