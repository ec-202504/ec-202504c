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
    <div className="w-64 border border-border rounded-lg pt-4 px-4 flex flex-col bg-card shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Label className="text-lg font-semibold tracking-wide text-foreground">
          絞り込み条件
        </Label>
      </div>
      <Separator className="bg-border" />

      <div className="m-2">
        <Label
          htmlFor="price"
          className="flex items-center gap-1 text-base text-foreground"
        >
          予算（上限）
        </Label>
        <div className="flex items-center gap-1 mt-2 bg-muted rounded-md px-2 py-1">
          <span className="text-sm text-muted-foreground">¥</span>
          <input
            id="price"
            type="text"
            min="0"
            className="w-full border-none bg-transparent focus:outline-none focus:ring-0 text-foreground placeholder-muted-foreground"
            placeholder="例: 30000"
            value={price || ""}
            onChange={(e) => onPriceChange?.(e.target.value)}
          />
        </div>
      </div>
      <Separator className="bg-border" />

      {filterTerms.map((filterTerm, index) => (
        <Fragment key={filterTerm.id}>
          <div className="m-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Label className="font-medium text-base tracking-wide text-foreground">
                  {filterTerm.label}
                </Label>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleClearSelection(filterTerm.id)}
                className="h-6 w-6 p-0 hover:bg-muted hover:text-muted-foreground transition-transform hover:scale-110"
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
                  className="flex items-center gap-3 cursor-pointer hover:bg-muted rounded-md px-3 py-2 transition-colors"
                >
                  <RadioGroupItem
                    value={term.id.toString()}
                    id={term.id.toString()}
                    className="text-primary border-border"
                  />
                  <span className="text-foreground">{term.name}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {index < filterTerms.length - 1 && (
            <Separator className="bg-border" />
          )}
        </Fragment>
      ))}
    </div>
  );
}
