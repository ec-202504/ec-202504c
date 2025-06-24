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
  productCategory: "pc" | "book";
  onProductSelect: (productId: number) => void;
};

const MAX_SELECTIONS = 3;

function CompareProductSelector({
  selectedIds,
  availableProducts,
  productCategory,
  onProductSelect,
}: CompareProductSelectorProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">比較商品を選択</h3>
        <span className="text-sm text-muted-foreground">
          {selectedIds.length}/{MAX_SELECTIONS} 選択中
        </span>
      </div>

      {selectedIds.length < MAX_SELECTIONS && availableProducts.length > 0 && (
        <Select
          onValueChange={(value: string) => {
            console.log("value", value);

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
                    productCategory === "pc"
                      ? (product as ComparePc).pcId
                      : (product as CompareBook).bookId
                  }
                  value={
                    productCategory === "pc"
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

export default CompareProductSelector;
