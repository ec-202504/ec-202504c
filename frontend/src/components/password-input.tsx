import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { FormControl } from "./ui/form";
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

type PasswordInputProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  placeholder?: string;
  autoComplete?: string;
};

export function PasswordInput<T extends FieldValues>({
  field,
  placeholder,
  autoComplete,
}: PasswordInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl>
      <div className="relative">
        <Input
          {...field}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </FormControl>
  );
}
