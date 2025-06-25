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
        <div className="mb-4 p-3 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-800">
                {getSelectedCount()}個の
                {selectedTab === TAB_VALUES.PC ? "PC" : "技術書"}
                が比較リストに追加されています
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleClearComparison}>
                <Trash2 className="w-4 h-4 mr-1" />
                クリア
              </Button>

              <Link to="/product/comparison">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-800">
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
