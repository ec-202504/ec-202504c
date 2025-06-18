import Sidebar, { type FilterTerm } from "./Sidebar";
import type { Product } from "../types";
import SearchForm from "./SearchForm";
import ProductCard from "./ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";

type Props = {
  products: Product[];
  filterTerms: FilterTerm[];
  selectedOption: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, query: string) => void;
};

export default function ProductList({
  products,
  filterTerms,
  selectedOption,
  handleSubmit,
}: Props) {
  return (
    <div className="flex gap-4">
      <Sidebar selectedOption={selectedOption} filterTerms={filterTerms} />
      <div className="flex-1">
        <SearchForm onSubmit={handleSubmit} />
        <div className="grid grid-cols-3 gap-4 mb-4">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="/product" size={"sm"} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/product" size={"sm"}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/product" isActive size={"sm"}>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/product" size={"sm"}>
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="/product" size={"sm"} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
