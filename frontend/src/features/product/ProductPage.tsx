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

  // 検索フォームの送信ハンドラー
  const handleSubmit = createSearchSubmitHandler(handleSearch);

  return (
    <div className="p-4 h-80vh">
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
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
