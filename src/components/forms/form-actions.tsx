import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormActionsProps {
  children?: React.ReactNode;
  className?: string;
  submitLabel?: string;
  cancelHref?: string;
  isSubmitting?: boolean;
}

export function FormActions({ children, className, submitLabel = "Save", isSubmitting }: FormActionsProps) {
  return (
    <div className={cn("flex items-center justify-end gap-2", className)}>
      {children}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
}
