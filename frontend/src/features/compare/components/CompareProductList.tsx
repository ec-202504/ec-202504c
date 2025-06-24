import type { ComparePc, CompareBook } from "../types";
import CompareProductCard from "./CompareProductCard";

type CompareProductListProps = {
  products: (ComparePc | CompareBook)[];
  productCategory: "pc" | "book";
  onRemoveProduct: (productId: number) => void;
};

function CompareProductList({
  products,
  productCategory,
  onRemoveProduct,
}: CompareProductListProps) {
  return (
    <>
      {products.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          比較する商品を選択してください
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <CompareProductCard
              key={
                productCategory === "pc"
                  ? (product as ComparePc).pcId
                  : (product as CompareBook).bookId
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

export default CompareProductList;
