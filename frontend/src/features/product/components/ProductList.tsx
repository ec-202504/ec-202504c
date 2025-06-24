import { useState } from "react";
import Sidebar from "./Sidebar";
import type { Product, FilterTerm } from "../types";
import SearchForm from "./SearchForm";
import ProductCard from "./ProductCard";
import LoadingOverlay from "./LoadingOverlay";
import ProductPagination from "./ProductPagination";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

type Props = {
  isLoading: boolean;
  selectedTab: string;
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
  onAddToComparison: (productIds: number[]) => void;
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
}: Props) {
  // 現在選択されている商品のID
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  /**
   * 比較に追加
   */
  const handleAddToComparison = () => {
    if (selectedProductIds.length > 0) {
      onAddToComparison(selectedProductIds);
      setSelectedProductIds([]);
    }
  };

  /**
   * 全選択または全解除のハンドラー
   */
  const handleSelectAll = () => {
    // 全選択の場合は全解除
    if (selectedProductIds.length === products.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(products.map((p) => Number(p.id)));
    }
  };

  /**
   * 選択時のハンドラー
   *
   * @param productId 商品ID
   * @param isSelected 選択状態
   */
  const handleSelectionChange = (productId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedProductIds((prev) => [...prev, productId]);
    } else {
      setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
    }
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

        {products.length > 0 && (
          <div className="flex items-center justify-between mb-4 p-3 border rounded">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedProductIds.length === products.length
                  ? "全解除"
                  : "全選択"}
              </Button>

              {selectedProductIds.length > 0 && (
                <Badge variant="secondary">
                  {selectedProductIds.length}個選択中
                </Badge>
              )}
            </div>

            {selectedProductIds.length > 0 && (
              <Button onClick={handleAddToComparison} size="sm">
                比較に追加 ({selectedProductIds.length}個)
              </Button>
            )}
          </div>
        )}

        {isLoading ? (
          <LoadingOverlay />
        ) : (
          <>
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-60 w-full bg-gray-50 rounded-md shadow mt-8 mb-8">
                <div className="text-lg text-gray-600 font-semibold">
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
                    selected={selectedProductIds.includes(Number(product.id))}
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
