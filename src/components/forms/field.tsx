import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { frTypo } from "@/lib/fr-typography";

export const fieldClasses =
  "min-h-12 w-full rounded-md border border-ink-950/20 bg-paper px-4 text-base text-ink-950 transition-colors hover:border-ink-950/40 focus:border-ink-950 aria-[invalid=true]:border-danger";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

/** Visible label, optional hint and textual error tied to the control with ids (§14). */
export function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-graphite">
          {frTypo(hint)}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-danger-strong">
          {frTypo(error)}
        </p>
      )}
    </div>
  );
}

export function FormError({ children }: { children: string }) {
  return (
    <p className="flex items-start gap-3 rounded-md border border-danger-strong/30 bg-danger-50 p-4 text-danger-strong">
      <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.5} />
      {frTypo(children)}
    </p>
  );
}
