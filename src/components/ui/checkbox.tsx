"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import * as React from "react";

interface CheckboxGroupProps {
  items: { label: string; value: string }[];
  values: string[];
  onValueChange: (value: string[]) => void;
}
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

function CheckboxGroup({
  className,
  items,
  values,
  onValueChange,
  ...props
}: React.ComponentProps<"div"> & CheckboxGroupProps) {
  return (
    <div
      data-slot="checkbox-group"
      className={cn("space-y-3", className)}
      {...props}
    >
      {items.map((item) => (
        <div className="flex items-center space-x-2" key={item.value}>
          <Checkbox
            id={item.value}
            checked={values.includes(item.value)}
            onCheckedChange={(checked) => {
              if (checked) {
                onValueChange([...values, item.value]);
              } else {
                onValueChange(values.filter((value) => value !== item.value));
              }
            }}
          />
          <Label
            htmlFor={item.value}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
export { Checkbox, CheckboxGroup };
