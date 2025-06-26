import { Scale, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { TAB_VALUES, type TabValues } from "../../product/types/constants";

type ComparisonStatusBarProps = {
  selectedCategory: TabValues;
  selectedProductCount: number;
  handleClearComparison: () => void;
};

function ComparisonStatusBar({
  selectedCategory,
  selectedProductCount,
  handleClearComparison,
}: ComparisonStatusBarProps) {
  return (
    <>
      {selectedProductCount > 0 && (
        <div className="mb-4 p-4 border border-border rounded-lg bg-card shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 dark:bg-secondary/20 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">
                  {selectedProductCount}個の
                  {selectedCategory === TAB_VALUES.PC ? "PC" : "技術書"}
                  が比較商品に追加されています
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClearComparison}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              クリア
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default ComparisonStatusBar;
