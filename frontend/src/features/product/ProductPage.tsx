import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Link } from "@tanstack/react-router";
import ProductList from "./components/ProductList";
import { useProductFilters } from "./hooks/useProductFilters";
import { useProductData } from "./hooks/useProductData";
import { createSearchSubmitHandler } from "./utils/searchHandlers";
import { TAB_VALUES } from "./types/constants";
import { useAtom, useSetAtom } from "jotai";
import {
  pcComparisonAtom,
  bookComparisonAtom,
  addPcToComparisonAtom,
  addBookToComparisonAtom,
} from "../../stores/productComparisonAtom";
import { Scale, ArrowRight } from "lucide-react";

export default function ProductListPage() {
  const {
    selectedTab,
    page,
    handleFilterChange,
    handleSearch,
    handlePageChange,
    handleTabChange,
    getSelectedValues,
    getApiParams,
    price,
    handlePriceChange,
  } = useProductFilters();

  const { isLoading, pcs, techBooks, filterTerms, totalPages } = useProductData(
    selectedTab,
    getApiParams,
  );

  // 商品比較用のatom
  const [pcComparisonIds] = useAtom(pcComparisonAtom);
  const [bookComparisonIds] = useAtom(bookComparisonAtom);
  const addPcToComparison = useSetAtom(addPcToComparisonAtom);
  const addBookToComparison = useSetAtom(addBookToComparisonAtom);

  // 検索フォームの送信ハンドラー
  const handleSubmit = createSearchSubmitHandler(handleSearch);

  /**
   * 商品比較に一括追加するハンドラー
   *
   * @param productIds 追加する商品IDの配列
   */
  const handleAddToComparison = (productIds: number[]) => {
    if (selectedTab === TAB_VALUES.PC) {
      for (const productId of productIds) {
        addPcToComparison(productId);
      }
    } else {
      for (const productId of productIds) {
        addBookToComparison(productId);
      }
    }
  };

  /**
   * 現在のタブで選択されている商品数を取得
   *
   * @returns 選択されている商品数
   */
  const getSelectedCount = () => {
    return selectedTab === TAB_VALUES.PC
      ? pcComparisonIds.length
      : bookComparisonIds.length;
  };

  return (
    <div className="p-4 h-80vh">
      {/* 比較ページへのリンク */}
      {getSelectedCount() > 0 && (
        <div className="mb-4 p-3 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-800">
                {getSelectedCount()}個の商品が比較リストに追加されています
              </span>
            </div>

            <Link to="/product/comparison">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-800">
                比較ページへ
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      <Tabs
        value={selectedTab}
        onValueChange={handleTabChange}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value={TAB_VALUES.PC}>PC</TabsTrigger>
          <TabsTrigger value={TAB_VALUES.BOOK}>技術書</TabsTrigger>
        </TabsList>

        <TabsContent value={TAB_VALUES.PC}>
          <ProductList
            isLoading={isLoading}
            selectedTab={selectedTab}
            products={pcs}
            filterTerms={filterTerms}
            selectedOption={handleFilterChange}
            handleSubmit={handleSubmit}
            currentPage={page}
            onPageChange={handlePageChange}
            totalPages={totalPages}
            selectedValues={getSelectedValues()}
            price={price}
            onPriceChange={handlePriceChange}
            onAddToComparison={handleAddToComparison}
          />
        </TabsContent>

        <TabsContent value={TAB_VALUES.BOOK}>
          <ProductList
            isLoading={isLoading}
            selectedTab={selectedTab}
            products={techBooks}
            filterTerms={filterTerms}
            selectedOption={handleFilterChange}
            handleSubmit={handleSubmit}
            currentPage={page}
            onPageChange={handlePageChange}
            totalPages={totalPages}
            selectedValues={getSelectedValues()}
            price={price}
            onPriceChange={handlePriceChange}
            onAddToComparison={handleAddToComparison}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
