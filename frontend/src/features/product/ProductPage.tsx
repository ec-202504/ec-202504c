import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
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
  clearPcComparisonAtom,
  clearBookComparisonAtom,
  removeBookFromComparisonAtom,
  removePcFromComparisonAtom,
} from "../../stores/productComparisonAtom";
import ProductComparisonStatusBar from "./components/ProductComparisonStatusBar";

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
  const removePcFromComparison = useSetAtom(removePcFromComparisonAtom);
  const removeBookFromComparison = useSetAtom(removeBookFromComparisonAtom);
  const clearPcComparison = useSetAtom(clearPcComparisonAtom);
  const clearBookComparison = useSetAtom(clearBookComparisonAtom);

  // 検索フォームの送信ハンドラー
  const handleSubmit = createSearchSubmitHandler(handleSearch);

  /**
   * 商品比較に追加するハンドラー
   *
   * @param productId 追加する商品ID
   */
  const handleAddToComparison = (productId: number) => {
    if (selectedTab === TAB_VALUES.PC) {
      addPcToComparison(productId);
    } else {
      addBookToComparison(productId);
    }
  };

  /**
   * 商品比較から削除するハンドラー
   *
   * @param productId 削除する商品ID
   */
  const handleRemoveFromComparison = (productId: number) => {
    if (selectedTab === TAB_VALUES.PC) {
      removePcFromComparison(productId);
    } else {
      removeBookFromComparison(productId);
    }
  };

  /**
   * 比較リストをクリアするハンドラー
   */
  const handleClearComparison = () => {
    if (selectedTab === TAB_VALUES.PC) {
      clearPcComparison();
    } else {
      clearBookComparison();
    }
  };

  return (
    <div className="p-4">
      <ProductComparisonStatusBar
        selectedTab={selectedTab}
        pcComparisonIds={pcComparisonIds}
        bookComparisonIds={bookComparisonIds}
        handleClearComparison={handleClearComparison}
      />

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
            onRemoveFromComparison={handleRemoveFromComparison}
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
            onRemoveFromComparison={handleRemoveFromComparison}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
