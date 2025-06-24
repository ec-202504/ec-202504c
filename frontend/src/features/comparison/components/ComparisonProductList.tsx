import type { ComparisonPc, ComparisonBook } from "../types";
import ComparisonProductCard from "./ComparisonProductCard";

type ComparisonProductListProps = {
  products: (ComparisonPc | ComparisonBook)[];
  productCategory: "pc" | "book";
  onRemoveProduct: (productId: number) => void;
};

function ComparisonProductList({
  products,
  productCategory,
  onRemoveProduct,
}: ComparisonProductListProps) {
  return (
    <>
      {products.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          比較する商品を選択してください
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ComparisonProductCard
              key={
                productCategory === "pc"
                  ? (product as ComparisonPc).pcId
                  : (product as ComparisonBook).bookId
              }
              product={product}
              productCategory={productCategory}
              onRemove={onRemoveProduct}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default ComparisonProductList;
