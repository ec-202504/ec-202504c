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
        <div className="mb-4 p-3 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-800">
                {selectedProductCount}個の
                {selectedCategory === TAB_VALUES.PC ? "PC" : "技術書"}
                が比較リストに追加されています
              </span>
            </div>

            <Button variant="ghost" size="sm" onClick={handleClearComparison}>
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
