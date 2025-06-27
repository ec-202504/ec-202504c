import { useState, useEffect, useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  pcComparisonAtom,
  bookComparisonAtom,
  clearBookComparisonAtom,
  clearPcComparisonAtom,
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
import ComparisonStatusBar from "./components/ComparisonStatusBar";
import { TAB_VALUES, type TabValues } from "../product/types/constants";
import { BarChart3, Monitor, BookOpen, List } from "lucide-react";

function ComparisonPage() {
  // 商品比較用のatom（読み取り専用）
  const [pcStoredIds] = useAtom(pcComparisonAtom);
  const [bookStoredIds] = useAtom(bookComparisonAtom);
  const clearPcComparison = useSetAtom(clearPcComparisonAtom);
  const clearBookComparison = useSetAtom(clearBookComparisonAtom);

  // 比較リストに追加された商品の詳細情報を格納するstate
  const [pcDetails, setPcDetails] = useState<Pc[]>([]);
  const [bookDetails, setBookDetails] = useState<Book[]>([]);

  const [selectedPcIds, setSelectedPcIds] = useState<number[]>([]);
  const [selectedBookIds, setSelectedBookIds] = useState<number[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<TabValues>(
    TAB_VALUES.PC,
  );

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
    if (selectedCategory === TAB_VALUES.PC) {
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
    if (selectedCategory === TAB_VALUES.PC) {
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
    if (selectedCategory === TAB_VALUES.PC) {
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
    if (selectedCategory === TAB_VALUES.PC) {
      return pcDetails.filter((pc) => selectedPcIds.includes(pc.pcId));
    }
    return bookDetails.filter((book) => selectedBookIds.includes(book.bookId));
  };

  /**
   * デフォルトで3つの商品を選択
   */
  useEffect(() => {
    if (selectedCategory === TAB_VALUES.PC) {
      setSelectedPcIds(pcStoredIds.slice(0, 3));
    } else {
      setSelectedBookIds(bookStoredIds.slice(0, 3));
    }
  }, [selectedCategory, pcStoredIds, bookStoredIds]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-14">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary/80 dark:text-white mb-4">
            商品比較
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            最大3つまで商品を選択して、詳細な比較を行えます
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs
            value={selectedCategory}
            onValueChange={(value: string) =>
              setSelectedCategory(value as TabValues)
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/50 dark:bg-slate-800/50 border border-border">
              <TabsTrigger
                value={TAB_VALUES.PC}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <Monitor className="w-4 h-4" />
                PC
              </TabsTrigger>
              <TabsTrigger
                value={TAB_VALUES.BOOK}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                技術書
              </TabsTrigger>
            </TabsList>

            <TabsContent value={TAB_VALUES.PC} className="space-y-8">
              <ComparisonStatusBar
                selectedCategory={selectedCategory}
                selectedProductCount={selectedPcIds.length}
                handleClearComparison={clearPcComparison}
              />

              <ComparisonProductSelector
                selectedIds={selectedPcIds}
                availableProducts={getAvailablePcs()}
                productCategory={TAB_VALUES.PC}
                onProductSelect={handleProductAdd}
              />

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <List className="w-5 h-5" />
                  PC比較
                </h3>
                <ComparisonProductList
                  products={getSelectedProducts()}
                  productCategory={TAB_VALUES.PC}
                  onRemoveProduct={handleProductRemove}
                />
              </div>

              {pcDetails.length > 0 && (
                <>
                  <Separator className="my-8" />
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      詳細情報比較
                    </h3>
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg border border-border overflow-hidden">
                      <SpecTable
                        products={getSelectedProducts()}
                        productCategory={TAB_VALUES.PC}
                      />
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value={TAB_VALUES.BOOK} className="space-y-8">
              <ComparisonStatusBar
                selectedCategory={selectedCategory}
                selectedProductCount={selectedBookIds.length}
                handleClearComparison={clearBookComparison}
              />

              <ComparisonProductSelector
                selectedIds={selectedBookIds}
                availableProducts={getAvailableBooks()}
                productCategory={TAB_VALUES.BOOK}
                onProductSelect={handleProductAdd}
              />

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <List className="w-5 h-5" />
                  書籍比較
                </h3>
                <ComparisonProductList
                  products={getSelectedProducts()}
                  productCategory={TAB_VALUES.BOOK}
                  onRemoveProduct={handleProductRemove}
                />
              </div>

              {bookDetails.length > 0 && (
                <>
                  <Separator className="my-8" />
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      仕様比較
                    </h3>
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg border border-border overflow-hidden">
                      <SpecTable
                        products={getSelectedProducts()}
                        productCategory={TAB_VALUES.BOOK}
                      />
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ComparisonPage;
