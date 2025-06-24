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
    <div className="w-64 border rounded p-4 flex flex-col">
      <Label className="mb-4">絞り込み条件</Label>
      <Separator />
      {filterTerms.map((filterTerm) => (
        <Fragment key={filterTerm.id}>
          <div className="m-2">
            <div className="flex items-center justify-between mb-2">
              <Label>{filterTerm.label}</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleClearSelection(filterTerm.id)}
                className="h-6 w-6 p-0"
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
                <Label key={term.id} className="flex items-center">
                  <RadioGroupItem
                    value={term.id.toString()}
                    id={term.id.toString()}
                  />
                  {term.name}
                </Label>
              ))}
            </RadioGroup>
          </div>

          <Separator />
        </Fragment>
      ))}
      <div className="mt-4">
        <Label htmlFor="price">予算（上限）</Label>
        <div className="flex items-center gap-1 mt-1">
          <input
            id="price"
            type="text"
            min="0"
            className="w-full border rounded px-2 py-1"
            placeholder="例: 30000"
            value={price || ""}
            onChange={(e) => onPriceChange?.(e.target.value)}
          />
          <span className="text-sm text-gray-500">円</span>
        </div>
      </div>
    </div>
  );
}
