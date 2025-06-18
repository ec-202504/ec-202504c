import Sidebar, { type FilterTerm } from "./Sidebar";
import type { Product } from "../ProductPage";
import SearchForm from "./SearchForm";
import ProductCard from "./ProductCard";
import { Button } from "../../../components/ui/button";

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
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
        <div className="flex justify-between w-full mt-3">
          <div className="mr-auto">
            <Button type="button" variant={"outline"}>
              戻る
            </Button>
          </div>
          <div className="ml-auto">
            <Button type="button">次へ</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
