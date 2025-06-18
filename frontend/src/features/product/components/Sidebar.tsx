import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Separator } from "../../../components/ui/separator";

export type FilterTerm = {
  id: number;
  label: string;
  options: string[];
};

type SidebarProps = {
  filterTerms: FilterTerm[];
  selectedOption: (value: string) => void;
};

export default function Sidebar({ filterTerms, selectedOption }: SidebarProps) {
  return (
    <div className="w-64 border rounded p-4 flex flex-col gap-4">
      <Label>絞り込み条件</Label>
      <Separator />
      {filterTerms.map((filterTerm) => (
        <div key={filterTerm.id} className="m-2">
          <Label className="mb-2">{filterTerm.label}</Label>
          <RadioGroup
            onValueChange={(value) => selectedOption(value)}
            className="m-2 flex flex-col gap-2"
          >
            {filterTerm.options.map((term) => (
              <Label key={term} className="flex items-center">
                <RadioGroupItem value={term} id={term} />
                {term}
              </Label>
            ))}
          </RadioGroup>
          <Separator />
        </div>
      ))}
    </div>
  );
}
