import { useState } from "react";
import type { ComparisonPc, ComparisonBook, ProductCategory } from "./types";
import { pcProducts, bookProducts } from "./data/products";
import { useAtom, useSetAtom } from "jotai";
import {
  pcComparisonAtom,
  bookComparisonAtom,
  addPcToComparisonAtom,
  addBookToComparisonAtom,
  removePcFromComparisonAtom,
  removeBookFromComparisonAtom,
} from "../../stores/productComparisonAtom";

import { Separator } from "../../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import ComparisonProductSelector from "./components/ComparisonProductSelector";
import ComparisonProductList from "./components/ComparisonProductList";
import SpecTable from "./components/SpecTable";

function ComparisonPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>("pc");

  // 商品比較用のatom
  const [pcComparisonIds] = useAtom(pcComparisonAtom);
  const [bookComparisonIds] = useAtom(bookComparisonAtom);
  const addPcToComparison = useSetAtom(addPcToComparisonAtom);
  const addBookToComparison = useSetAtom(addBookToComparisonAtom);
  const removePcFromComparison = useSetAtom(removePcFromComparisonAtom);
  const removeBookFromComparison = useSetAtom(removeBookFromComparisonAtom);

  /**
   * 現在選択されているカテゴリの商品を取得
   *
   * @returns 現在選択されているカテゴリの商品
   */
  const getCurrentProducts = () => {
    return selectedCategory === "pc" ? pcProducts : bookProducts;
  };

  /**
   * 現在選択されている商品を取得
   *
   * @returns 現在選択されている商品
   */
  const getSelectedProducts = () => {
    if (selectedCategory === "pc") {
      return pcProducts.filter((pc) => pcComparisonIds.includes(pc.pcId));
    }
    return bookProducts.filter((book) =>
      bookComparisonIds.includes(book.bookId),
    );
  };

  /**
   * 現在選択されている商品IDを取得
   *
   * @returns 現在選択されている商品ID
   */
  const getCurrentSelectedIds = () => {
    return selectedCategory === "pc" ? pcComparisonIds : bookComparisonIds;
  };

  /**
   * 選択されている商品を除いた商品を取得
   *
   * @returns 選択されている商品を除いた商品
   */
  const getAvailableProducts = () => {
    const currentProducts = getCurrentProducts();
    const selectedIds = getCurrentSelectedIds();

    return currentProducts.filter((product) => {
      const productId =
        selectedCategory === "pc"
          ? (product as ComparisonPc).pcId
          : (product as ComparisonBook).bookId;
      return !selectedIds.includes(productId);
    });
  };

  /**
   * 商品を追加する際のイベントハンドラー
   *
   * @param productId 追加する商品のID
   */
  const handleProductAdd = (productId: number) => {
    const category = selectedCategory === "pc" ? "pc" : "book";
    if (category === "pc") {
      addPcToComparison(productId);
    } else {
      addBookToComparison(productId);
    }
  };

  /**
   * 商品を削除する際のイベントハンドラー
   *
   * @param productId 削除する商品のID
   */
  const handleProductRemove = (productId: number) => {
    const category = selectedCategory === "pc" ? "pc" : "book";
    if (category === "pc") {
      removePcFromComparison(productId);
    } else {
      removeBookFromComparison(productId);
    }
  };

  const selectedProducts = getSelectedProducts();

  return (
    <div className="container mx-auto px-10 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">商品比較</h1>
        <p className="text-muted-foreground">
          最大3つまで商品を選択して比較できます
        </p>
      </div>

      <Tabs
        value={selectedCategory}
        onValueChange={(value: string) =>
          setSelectedCategory(value as ProductCategory)
        }
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pc">PC</TabsTrigger>
          <TabsTrigger value="book">技術書</TabsTrigger>
        </TabsList>

        <TabsContent value="pc" className="space-y-8">
          <ComparisonProductSelector
            selectedIds={pcComparisonIds}
            availableProducts={getAvailableProducts()}
            productCategory="pc"
            onProductSelect={handleProductAdd}
          />

          <div>
            <h2 className="text-xl font-semibold mb-4">PC比較</h2>
            <ComparisonProductList
              products={selectedProducts}
              productCategory="pc"
              onRemoveProduct={handleProductRemove}
            />
          </div>

          {selectedProducts.length > 0 && (
            <>
              <Separator />
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">仕様比較</h3>
                <SpecTable products={selectedProducts} productCategory="pc" />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="book" className="space-y-8">
          <ComparisonProductSelector
            selectedIds={bookComparisonIds}
            availableProducts={getAvailableProducts()}
            productCategory="book"
            onProductSelect={handleProductAdd}
          />

          <div>
            <h2 className="text-xl font-semibold mb-4">書籍比較</h2>
            <ComparisonProductList
              products={selectedProducts}
              productCategory="book"
              onRemoveProduct={handleProductRemove}
            />
          </div>

          {selectedProducts.length > 0 && (
            <>
              <Separator />
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">仕様比較</h3>
                <SpecTable products={selectedProducts} productCategory="book" />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ComparisonPage;
