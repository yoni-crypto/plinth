"use client";

import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.ComponentPropsWithRef<"div"> {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ name, label, description, required, children, className, ...props }, ref) => {
    const form = useFormContext?.();
    const error = form?.formState?.errors?.[name];

    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props}>
        {label && (
          <Label htmlFor={name} className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
        )}
        {children}
        {description && !error && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {error && (
          <p className="text-xs text-destructive">{error.message as string}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
