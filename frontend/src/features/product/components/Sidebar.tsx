import { Fragment } from "react/jsx-runtime";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Separator } from "../../../components/ui/separator";
import type { FilterTerm } from "../types";
import { TAB_VALUES } from "../types/constants";

type SidebarProps = {
  selectedTab: string;
  filterTerms: FilterTerm[];
  selectedOption: (value: string) => void;
};

export default function Sidebar({
  selectedTab,
  filterTerms,
  selectedOption,
}: SidebarProps) {
  return (
    <div className="w-64 border rounded p-4 flex flex-col">
      <Label className="mb-4">絞り込み条件</Label>
      <Separator />
      {selectedTab === TAB_VALUES.PC ? (
        <>
          {filterTerms.map((filterTerm) => (
            <Fragment key={filterTerm.id}>
              <div className="m-2">
                <Label className="mb-2">{filterTerm.label}</Label>
                <RadioGroup
                  onValueChange={(value) => selectedOption(value)}
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
        </>
      ) : (
        <div>技術書用のサイドバー</div>
      )}
    </div>
  );
}
