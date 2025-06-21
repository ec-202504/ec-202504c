import Sidebar from "./Sidebar";
import type { Product, FilterTerm } from "../types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SearchForm from "./SearchForm";
import ProductCard from "./ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";

type Props = {
  selectedTab: string;
  products: Product[];
  filterTerms: FilterTerm[];
  selectedOption: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, query: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
};

export default function ProductList({
  selectedTab,
  products,
  filterTerms,
  selectedOption,
  handleSubmit,
  currentPage,
  onPageChange,
  totalPages,
}: Props) {
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex gap-4">
      <Sidebar selectedOption={selectedOption} filterTerms={filterTerms} />
      <div className="flex-1">
        <SearchForm onSubmit={handleSubmit} />

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

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                size="sm"
                href="/product"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
                aria-disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </PaginationPrevious>
            </PaginationItem>
            {getPageNumbers().map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="/product"
                  size="sm"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page !== currentPage) onPageChange(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                size="sm"
                href="/product"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) onPageChange(currentPage + 1);
                }}
                aria-disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
