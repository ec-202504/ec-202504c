import { useState, useEffect, useCallback } from "react";
import type { ComparisonPc, ComparisonBook, ProductCategory } from "./types";
import { pcProducts, bookProducts } from "./data/products";
import { useAtom } from "jotai";
import {
  pcComparisonAtom,
  bookComparisonAtom,
} from "../../stores/productComparisonAtom";
import { axiosInstance } from "../../lib/axiosInstance";
import type { Pc } from "../product/types/Pc";
import type { Book } from "../product/types/Book";

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

  // 詳細情報を格納するstate
  const [pcDetails, setPcDetails] = useState<Pc[]>([]);
  const [bookDetails, setBookDetails] = useState<Book[]>([]);

  // 商品比較用のatom
  const [pcComparisonIds] = useAtom(pcComparisonAtom);
  const [bookComparisonIds] = useAtom(bookComparisonAtom);

  /**
   * PCの詳細情報を取得
   */
  const fetchPcDetails = useCallback(async (pcIds: number[]) => {
    if (pcIds.length === 0) {
      setPcDetails([]);
      return;
    }

    try {
      const promises = pcIds.map((id) => axiosInstance.get<Pc>(`/pcs/${id}`));
      const responses = await Promise.all(promises);
      const details = responses.map((response) => response.data);
      setPcDetails(details);
    } catch (error) {
      console.error("PC詳細情報の取得に失敗しました:", error);
      setPcDetails([]);
    }
  }, []);

  /**
   * 技術書の詳細情報を取得
   */
  const fetchBookDetails = useCallback(async (bookIds: number[]) => {
    if (bookIds.length === 0) {
      setBookDetails([]);
      return;
    }

    try {
      const promises = bookIds.map((id) =>
        axiosInstance.get<Book>(`/books/${id}`),
      );
      const responses = await Promise.all(promises);
      const details = responses.map((response) => response.data);
      setBookDetails(details);
    } catch (error) {
      console.error("技術書詳細情報の取得に失敗しました:", error);
      setBookDetails([]);
    }
  }, []);

  /**
   * 比較リストが変更されたときに詳細情報を取得
   */
  useEffect(() => {
    if (selectedCategory === "pc") {
      fetchPcDetails(pcComparisonIds);
    } else {
      fetchBookDetails(bookComparisonIds);
    }
  }, [
    fetchPcDetails,
    fetchBookDetails,
    selectedCategory,
    pcComparisonIds,
    bookComparisonIds,
  ]);

  /**
   * 現在選択されているカテゴリの商品を取得
   *
   * @returns 現在選択されているカテゴリの商品
   */
  const getCurrentProducts = () => {
    return selectedCategory === "pc" ? pcProducts : bookProducts;
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
   * 商品を比較リストに追加
   *
   * @param productId
   */
  const handleProductAdd = (productId: number) => {
    console.log(productId);
  };

  /**
   * 商品を比較リストから削除
   *
   * @param productId
   */
  const handleProductRemove = (productId: number) => {
    console.log(productId);
  };

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
              products={pcDetails}
              productCategory="pc"
              onRemoveProduct={handleProductRemove}
            />
          </div>

          {pcDetails.length > 0 && (
            <>
              <Separator />
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">仕様比較</h3>
                <SpecTable products={pcDetails} productCategory="pc" />
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
              products={bookDetails}
              productCategory="book"
              onRemoveProduct={handleProductRemove}
            />
          </div>

          {bookDetails.length > 0 && (
            <>
              <Separator />
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">仕様比較</h3>
                <SpecTable products={bookDetails} productCategory="book" />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ComparisonPage;
