import type { ComparePc, CompareBook } from "../types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";

type CompareProductSelectorProps = {
  selectedIds: number[];
  availableProducts: (ComparePc | CompareBook)[];
  category: "pc" | "book";
  onProductSelect: (productId: number) => void;
};

function CompareProductSelector({
  selectedIds,
  availableProducts,
  category,
  onProductSelect,
}: CompareProductSelectorProps) {
  const maxSelections = 3;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">比較商品を選択</h3>
        <span className="text-sm text-muted-foreground">
          {selectedIds.length}/{maxSelections} 選択中
        </span>
      </div>

      {selectedIds.length < maxSelections && availableProducts.length > 0 && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">商品を追加:</span>
          <Select
            onValueChange={(value: string) => {
              const productId = Number(value);
              if (!Number.isNaN(productId)) {
                onProductSelect(productId);
              }
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
                      category === "pc"
                        ? (product as ComparePc).pcId
                        : (product as CompareBook).bookId
                    }
                    value={
                      category === "pc"
                        ? (product as ComparePc).pcId
                        : (product as CompareBook).bookId
                    }
                  >
                    {product.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedIds.length === maxSelections && (
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

export default CompareProductSelector;
