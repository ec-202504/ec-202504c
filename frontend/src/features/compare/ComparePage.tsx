import { useState } from "react";
import type { ComparePc, CompareBook, ProductCategory } from "./types";
import { pcProducts, bookProducts } from "./data/products";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompareProductSelector from "./components/CompareProductSelector";
import CompareProductList from "./components/CompareProductList";
import SpecTable from "./components/SpecTable";

function ComparePage() {
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>("pc");
  const [selectedPcIds, setSelectedPcIds] = useState<number[]>([]);
  const [selectedBookIds, setSelectedBookIds] = useState<number[]>([]);

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
      return pcProducts.filter((pc) => selectedPcIds.includes(pc.pcId));
    }
    return bookProducts.filter((book) => selectedBookIds.includes(book.bookId));
  };

  /**
   * 現在選択されている商品IDを取得
   *
   * @returns 現在選択されている商品ID
   */
  const getCurrentSelectedIds = () => {
    return selectedCategory === "pc" ? selectedPcIds : selectedBookIds;
  };

  /**
   * 現在選択されている商品IDを設定
   *
   * @param ids 設定する商品のID
   */
  const setCurrentSelectedIds = (ids: number[]) => {
    if (selectedCategory === "pc") {
      setSelectedPcIds(ids);
    } else {
      setSelectedBookIds(ids);
    }
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
          ? (product as ComparePc).pcId
          : (product as CompareBook).bookId;
      return !selectedIds.includes(productId);
    });
  };

  /**
   * 商品を選択した際のイベントハンドラー
   *
   * @param productId 選択する商品のID
   */
  const handleProductSelect = (productId: number) => {
    const currentIds = getCurrentSelectedIds();
    if (currentIds.includes(productId)) {
      // 既に選択されている場合は削除
      setCurrentSelectedIds(currentIds.filter((id) => id !== productId));
    } else if (currentIds.length < 3) {
      // 3つ未満の場合は追加
      setCurrentSelectedIds([...currentIds, productId]);
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
          <CompareProductSelector
            selectedIds={selectedPcIds}
            availableProducts={getAvailableProducts()}
            productCategory="pc"
            onProductSelect={handleProductSelect}
          />

          <div>
            <h2 className="text-xl font-semibold mb-4">PC比較</h2>
            <CompareProductList
              products={selectedProducts}
              productCategory="pc"
              onRemoveProduct={handleProductSelect}
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
          <CompareProductSelector
            selectedIds={selectedBookIds}
            availableProducts={getAvailableProducts()}
            productCategory="book"
            onProductSelect={handleProductSelect}
          />

          <div>
            <h2 className="text-xl font-semibold mb-4">書籍比較</h2>
            <CompareProductList
              products={selectedProducts}
              productCategory="book"
              onRemoveProduct={handleProductSelect}
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

export default ComparePage;
