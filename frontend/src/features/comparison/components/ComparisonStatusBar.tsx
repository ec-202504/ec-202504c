import { Scale, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";

type ComparisonStatusBarProps = {
  selectedProductCount: number;
  handleClearComparison: () => void;
};

function ComparisonStatusBar({
  selectedProductCount,
  handleClearComparison,
}: ComparisonStatusBarProps) {
  if (selectedProductCount === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-3 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-blue-800">
            {selectedProductCount}個の商品が比較リストに追加されています
          </span>
        </div>

        <Button variant="ghost" size="sm" onClick={handleClearComparison}>
          <Trash2 className="w-4 h-4 mr-1" />
          クリア
        </Button>
      </div>
    </div>
  );
}

export default ComparisonStatusBar;
