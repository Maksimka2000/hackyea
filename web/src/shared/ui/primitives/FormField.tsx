import type { ReactNode } from "react";

export type FieldControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
};

type FormFieldProps = Readonly<{
  id: string;
  label: string;
  hint?: string;
  error?: string;
  /** Receives the id and aria attributes the control must set, so label, hint and error stay connected. */
  children: (controlProps: FieldControlProps) => ReactNode;
}>;

export function FormField({ children, error, hint, id, label }: FormFieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-bold text-foreground" htmlFor={id}>
        {label}
      </label>
      {children({
        id,
        "aria-describedby": describedBy || undefined,
        "aria-invalid": error ? true : undefined,
      })}
      {hint ? (
        <p className="text-sm text-muted" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="font-semibold text-danger" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
