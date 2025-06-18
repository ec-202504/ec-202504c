import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Separator } from "../../../components/ui/separator";

export type FilterTerm = {
  id: number;
  label: string;
  options: string[];
};

export type FilterTermList = {
  terms: FilterTerm[];
};

type SidebarProps = {
  filterTerms: FilterTerm[];
  selectedOption: (value: string) => void;
};

export default function Sidebar({ filterTerms, selectedOption }: SidebarProps) {
  return (
    <div className="w-64 border rounded p-4 flex flex-col gap-4">
      <div>
        <Label>絞り込み条件</Label>
        <Separator />
        <div className="mt-2">
          {filterTerms.map((filterTerm) => (
            <div key={filterTerm.id}>
              <Label>{filterTerm.label}</Label>
              <RadioGroup
                onValueChange={(value) => selectedOption(value)}
                className="ml-2 flex flex-col gap-1"
              >
                {filterTerm.options.map((term) => (
                  <Label key={term} className="flex items-center gap-2">
                    <RadioGroupItem value={term} id={term} />
                    {term}
                  </Label>
                ))}
              </RadioGroup>
              <Separator />
            </div>
          ))}
        </div>
        {/* <div className="mt-2">
                    <Label>ディスプレイサイズ(インチ)</Label>
                    <Input
                        type="number"
                        min={0}
                        step={0.1}
                        {...register("displaySize")}
                    />
                </div> */}
      </div>
    </div>
  );
}
