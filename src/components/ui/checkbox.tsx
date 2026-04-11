import * as React from "react";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "type"> {
  checked: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked, indeterminate = false, onCheckedChange, className, disabled, ...props }, ref) => {
    const isActive = checked || indeterminate;

    return (
      <button
        {...props}
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!(checked && !indeterminate))}
        className={cn(
          "inline-flex h-4 w-4 min-h-4 min-w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
          isActive
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-transparent hover:border-primary/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        {indeterminate ? <Minus className="h-3 w-3" /> : checked ? <Check className="h-3 w-3" /> : null}
      </button>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
