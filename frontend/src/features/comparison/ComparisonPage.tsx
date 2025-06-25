import { useState, useEffect, useCallback } from "react";
import type { ProductCategory } from "./types";
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
import { toast } from "sonner";

function ComparisonPage() {
  // 商品比較用のatom（読み取り専用）
  const [pcStoredIds] = useAtom(pcComparisonAtom);
  const [bookStoredIds] = useAtom(bookComparisonAtom);

  // 比較リストに追加された商品の詳細情報を格納するstate
  const [pcDetails, setPcDetails] = useState<Pc[]>([]);
  const [bookDetails, setBookDetails] = useState<Book[]>([]);

  const [selectedPcIds, setSelectedPcIds] = useState<number[]>([]);
  const [selectedBookIds, setSelectedBookIds] = useState<number[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>("pc");

  /**
   * 比較リストに追加されたPCの詳細情報を取得
   */
  const fetchPcDetails = useCallback(async (pcIds: number[]) => {
    if (pcIds.length === 0) {
      return;
    }

    try {
      const promises = pcIds.map((id) => axiosInstance.get<Pc>(`/pcs/${id}`));
      const responses = await Promise.all(promises);
      const details = responses.map((response) => response.data);
      setPcDetails(details);
    } catch {
      toast.error("PC詳細情報の取得に失敗しました");
    }
  }, []);

  /**
   * 比較リストに追加された技術書の詳細情報を取得
   */
  const fetchBookDetails = useCallback(async (bookIds: number[]) => {
    if (bookIds.length === 0) {
      return;
    }

    try {
      const promises = bookIds.map((id) =>
        axiosInstance.get<Book>(`/books/${id}`),
      );
      const responses = await Promise.all(promises);
      const details = responses.map((response) => response.data);
      setBookDetails(details);
    } catch {
      toast.error("技術書詳細情報の取得に失敗しました");
    }
  }, []);

  useEffect(() => {
    if (selectedCategory === "pc") {
      fetchPcDetails(pcStoredIds);
    } else {
      fetchBookDetails(bookStoredIds);
    }
  }, [
    fetchPcDetails,
    fetchBookDetails,
    selectedCategory,
    pcStoredIds,
    bookStoredIds,
  ]);

  /**
   * 選択されているPCを除いたPCを取得
   *
   * @returns 選択されているPCを除いたPC
   */
  const getAvailablePcs = (): Pc[] => {
    return pcDetails.filter((pc) => !selectedPcIds.includes(pc.pcId));
  };

  /**
   * 選択されている技術書を除いた技術書を取得
   *
   * @returns 選択されている技術書を除いた技術書
   */
  const getAvailableBooks = (): Book[] => {
    return bookDetails.filter((book) => !selectedBookIds.includes(book.bookId));
  };

  /**
   * 商品を比較リストに追加
   *
   * @param productId
   */
  const handleProductAdd = (productId: number) => {
    if (selectedCategory === "pc") {
      setSelectedPcIds([...selectedPcIds, productId]);
    } else {
      setSelectedBookIds([...selectedBookIds, productId]);
    }
  };

  /**
   * 商品を比較リストから削除
   *
   * @param productId
   */
  const handleProductRemove = (productId: number) => {
    if (selectedCategory === "pc") {
      setSelectedPcIds(selectedPcIds.filter((id) => id !== productId));
    } else {
      setSelectedBookIds(selectedBookIds.filter((id) => id !== productId));
    }
  };

  /**
   * 現在選択されている商品を取得
   *
   * @returns 選択されている商品
   */
  const getSelectedProducts = () => {
    if (selectedCategory === "pc") {
      return pcDetails.filter((pc) => selectedPcIds.includes(pc.pcId));
    }
    return bookDetails.filter((book) => selectedBookIds.includes(book.bookId));
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
            selectedIds={selectedPcIds}
            availableProducts={getAvailablePcs()}
            productCategory="pc"
            onProductSelect={handleProductAdd}
          />

          <div>
            <h2 className="text-xl font-semibold mb-4">PC比較</h2>
            <ComparisonProductList
              products={getSelectedProducts()}
              productCategory="pc"
              onRemoveProduct={handleProductRemove}
            />
          </div>

          {pcDetails.length > 0 && (
            <>
              <Separator />
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">仕様比較</h3>
                <SpecTable
                  products={getSelectedProducts()}
                  productCategory="pc"
                />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="book" className="space-y-8">
          <ComparisonProductSelector
            selectedIds={selectedBookIds}
            availableProducts={getAvailableBooks()}
            productCategory="book"
            onProductSelect={handleProductAdd}
          />

          <div>
            <h2 className="text-xl font-semibold mb-4">書籍比較</h2>
            <ComparisonProductList
              products={getSelectedProducts()}
              productCategory="book"
              onRemoveProduct={handleProductRemove}
            />
          </div>

          {bookDetails.length > 0 && (
            <>
              <Separator />
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">仕様比較</h3>
                <SpecTable
                  products={getSelectedProducts()}
                  productCategory="book"
                />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ComparisonPage;
