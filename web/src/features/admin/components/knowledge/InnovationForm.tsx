"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { libraryCategories } from "@/shared/constants/library-categories";
import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";
import { FormField } from "@/shared/ui/primitives/FormField";
import { Input } from "@/shared/ui/primitives/Input";
import { Select } from "@/shared/ui/primitives/Select";
import { Textarea } from "@/shared/ui/primitives/Textarea";

import { innovationFields, type InnovationField, type InnovationFormValues } from "../../hooks/useInnovationEditor";
import type { AdminInnovation } from "../../schemas/adminDtoSchemas";
import { ActionError } from "../submission/ActionError";

type InnovationFormProps = Readonly<{
  initial: AdminInnovation | undefined;
  isSaving: boolean;
  saved: boolean;
  saveError?: string;
  fieldError: (field: InnovationField) => string | undefined;
  onSave: (values: InnovationFormValues) => void;
}>;

const longFields: ReadonlyArray<InnovationField> = ["problems", "solution", "targetGroup", "beneficiaries", "evidence"];
const urlFields: ReadonlyArray<InnovationField> = ["sourceUrl", "videoUrl", "materialsUrl", "detailsPdfUrl", "licenseUrl"];

/** All text and links of a library card, in the order of the official ROPS sections. */
export function InnovationForm({ fieldError, initial, isSaving, onSave, saveError, saved }: InnovationFormProps) {
  const t = useTranslations("Admin.knowledge.editor");
  const [values, setValues] = useState<InnovationFormValues>(
    () => Object.fromEntries(innovationFields.map((field) => [field, (initial?.[field] as string | null | undefined) ?? ""])) as InnovationFormValues,
  );

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave(values);
  };

  return (
    <Card className="p-6">
      <form className="flex flex-col gap-5" noValidate onSubmit={submit}>
        {innovationFields.map((field) => (
          <FormField error={fieldError(field)} hint={urlFields.includes(field) ? t("urlHint") : undefined} id={`innovation-${field}`} key={field} label={t(`fields.${field}`)}>
            {(controlProps) =>
              field === "categoryId" ? (
                <Select {...controlProps} onChange={(event) => setValues({ ...values, categoryId: event.target.value })} value={values.categoryId}>
                  <option value="">{t("chooseCategory")}</option>
                  {libraryCategories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Select>
              ) : longFields.includes(field) ? (
                <Textarea {...controlProps} onChange={(event) => setValues({ ...values, [field]: event.target.value })} value={values[field]} />
              ) : (
                <Input
                  {...controlProps}
                  inputMode={urlFields.includes(field) ? "url" : undefined}
                  onChange={(event) => setValues({ ...values, [field]: event.target.value })}
                  value={values[field]}
                />
              )
            }
          </FormField>
        ))}
        <ActionError error={saveError} />
        <div className="flex flex-wrap items-center gap-4">
          <Button disabled={isSaving} size="lg" type="submit">{isSaving ? t("saving") : t("save")}</Button>
          <p aria-live="polite" className="font-semibold text-primary" role="status">{saved && !isSaving ? t("saved") : null}</p>
        </div>
      </form>
    </Card>
  );
}
