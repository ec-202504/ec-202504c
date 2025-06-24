import Sidebar from "./Sidebar";
import type { Product, FilterTerm } from "../types";
import SearchForm from "./SearchForm";
import ProductCard from "./ProductCard";
import LoadingOverlay from "./LoadingOverlay";
import ProductPagination from "./ProductPagination";

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
}: Props) {
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
