import { Button } from "../../../components/ui/button";
import { Scale } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { TAB_VALUES, type TabValues } from "../types/constants";

type ProductComparisonStatusBarProps = {
  selectedTab: TabValues;
  pcComparisonIds: number[];
  bookComparisonIds: number[];
  handleClearComparison: () => void;
};

function ProductComparisonStatusBar({
  selectedTab,
  pcComparisonIds,
  bookComparisonIds,
  handleClearComparison,
}: ProductComparisonStatusBarProps) {
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
    <>
      {getSelectedCount() > 0 && (
        <div className="mb-4 p-4 border border-border rounded-lg bg-card shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 dark:bg-secondary/20 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">
                  {getSelectedCount()}個の
                  {selectedTab === TAB_VALUES.PC ? "PC" : "技術書"}
                  が比較商品に追加されています
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearComparison}
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                クリア
              </Button>

              <Link to="/product/comparison">
                <Button
                  size="sm"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                  比較ページへ
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductComparisonStatusBar;
