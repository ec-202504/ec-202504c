import type { Book } from "../../product/types/Book";
import { TAB_VALUES, type TabValues } from "../../product/types/constants";
import type { Pc } from "../../product/types/Pc";
import { CheckSquare } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";

type ComparisonProductSelectorProps = {
  selectedIds: number[];
  availableProducts: (Pc | Book)[];
  productCategory: TabValues;
  onProductSelect: (productId: number) => void;
};

const MAX_SELECTIONS = 3;

function ComparisonProductSelector({
  selectedIds,
  availableProducts,
  productCategory,
  onProductSelect,
}: ComparisonProductSelectorProps) {
  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CheckSquare className="w-5 h-5" />
        比較商品を選択
      </h3>

      <p className="text-sm text-muted-foreground mb-3">
        {selectedIds.length}/{MAX_SELECTIONS} 選択中
      </p>

      {selectedIds.length < MAX_SELECTIONS && availableProducts.length > 0 && (
        <Select
          onValueChange={(value: number) => {
            onProductSelect(value);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="商品を選択してください" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {availableProducts.map((product) => (
                <SelectItem
                  key={
                    productCategory === TAB_VALUES.PC
                      ? (product as Pc).pcId
                      : (product as Book).bookId
                  }
                  value={
                    productCategory === TAB_VALUES.PC
                      ? (product as Pc).pcId
                      : (product as Book).bookId
                  }
                >
                  {product.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      {selectedIds.length === MAX_SELECTIONS && (
        <div className="text-sm text-muted-foreground">
          最大選択数に達しました。比較対象から商品を削除してから新しい商品を追加してください。
        </div>
      )}

      {availableProducts.length === 0 && selectedIds.length > 0 && (
        <div className="text-sm text-muted-foreground">
          すべての商品が選択されています。
        </div>
      )}
    </div>
  );
}

export default ComparisonProductSelector;
