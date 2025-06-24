import { Fragment } from "react/jsx-runtime";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Separator } from "../../../components/ui/separator";
import { Button } from "../../../components/ui/button";
import { X } from "lucide-react";
import type { FilterTerm } from "../types";

type SidebarProps = {
  filterTerms: FilterTerm[];
  selectedOption: (filterTermId: string, termId: string) => void;
  selectedValues?: Record<string, string>;
  price?: string;
  onPriceChange?: (price: string) => void;
};

export default function Sidebar({
  filterTerms,
  selectedOption,
  selectedValues = {},
  price,
  onPriceChange,
}: SidebarProps) {
  const handleClearSelection = (filterTermId: string) => {
    selectedOption(filterTermId, "");
  };

  return (
    <div className="w-64 border rounded pt-4 px-4 flex flex-col bg-white shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Label className="text-lg font-semibold tracking-wide">
          絞り込み条件
        </Label>
      </div>
      <Separator />

      <div className="m-2">
        <Label htmlFor="price" className="flex items-center gap-1 text-base">
          予算（上限）
        </Label>
        <div className="flex items-center gap-1 mt-2 bg-gray-50 rounded px-2 py-1">
          <span className="text-sm text-gray-500">¥</span>
          <input
            id="price"
            type="text"
            min="0"
            className="w-full border-none bg-transparent focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
            placeholder="例: 30000"
            value={price || ""}
            onChange={(e) => onPriceChange?.(e.target.value)}
          />
        </div>
      </div>
      <Separator />

      {filterTerms.map((filterTerm) => (
        <Fragment key={filterTerm.id}>
          <div className="m-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Label className="font-medium text-base tracking-wide">
                  {filterTerm.label}
                </Label>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleClearSelection(filterTerm.id)}
                className="h-6 w-6 p-0 hover:bg-gray-100 hover:text-gray-500 transition-transform hover:scale-110"
                aria-label="選択解除"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <RadioGroup
              value={selectedValues[filterTerm.id] || ""}
              onValueChange={(value) => selectedOption(filterTerm.id, value)}
              className="m-2 flex flex-col gap-2"
            >
              {filterTerm.options.map((term) => (
                <Label
                  key={term.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 rounded px-2 py-1 transition"
                >
                  <RadioGroupItem
                    value={term.id.toString()}
                    id={term.id.toString()}
                  />
                  <span>{term.name}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <Separator />
        </Fragment>
      ))}
    </div>
  );
}
