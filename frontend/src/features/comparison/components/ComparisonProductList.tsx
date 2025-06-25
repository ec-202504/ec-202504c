import type { Pc } from "../../product/types/Pc";
import type { Book } from "../../product/types/Book";
import ComparisonProductCard from "./ComparisonProductCard";

type ComparisonProductListProps = {
  products: (Pc | Book)[];
  productCategory: "pc" | "book";
  onRemoveProduct: (productId: number) => void;
};

function ComparisonProductList({
  products,
  productCategory,
  onRemoveProduct,
}: ComparisonProductListProps) {
  console.log(products);
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
                  ? (product as Pc).pcId
                  : (product as Book).bookId
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
