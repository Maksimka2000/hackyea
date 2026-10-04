"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";
import { Input } from "@/shared/ui/primitives/Input";
import { Select } from "@/shared/ui/primitives/Select";
import { Textarea } from "@/shared/ui/primitives/Textarea";

import { materialTypes, type AdminMaterial } from "../../schemas/adminDtoSchemas";
import { ActionError } from "../submission/ActionError";

type MaterialFormProps = Readonly<{
  initial: AdminMaterial | null;
  isSaving: boolean;
  error?: string;
  onSave: (body: Record<string, string>) => void;
  onCancel: () => void;
}>;

const labelClasses = "text-sm font-bold text-foreground";

export function MaterialForm({ error, initial, isSaving, onCancel, onSave }: MaterialFormProps) {
  const t = useTranslations("Admin.knowledge.materials");
  const tForm = useTranslations("Admin.knowledge.form");
  const [values, setValues] = useState({
    title: initial?.title ?? "",
    summary: initial?.summary ?? "",
    type: initial?.type ?? "article",
    url: initial?.url ?? "",
    body: initial?.body ?? "",
  });
  const set = (name: keyof typeof values) => (event: { target: { value: string } }) => setValues({ ...values, [name]: event.target.value });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave(values);
  };

  return (
    <Card className="p-5">
      <form className="flex flex-col gap-3" onSubmit={submit}>
        <h2 className="text-lg font-bold text-foreground">{initial ? t("editTitle") : t("new")}</h2>
        <label className={labelClasses} htmlFor="material-title">{t("fields.title")}</label>
        <Input id="material-title" maxLength={300} onChange={set("title")} required value={values.title} />
        <label className={labelClasses} htmlFor="material-type">{t("fields.type")}</label>
        <Select id="material-type" onChange={set("type")} value={values.type}>
          {materialTypes.map((type) => (
            <option key={type} value={type}>{t(`types.${type}`)}</option>
          ))}
        </Select>
        <label className={labelClasses} htmlFor="material-summary">{t("fields.summary")}</label>
        <Textarea className="min-h-20" id="material-summary" maxLength={1000} onChange={set("summary")} required value={values.summary} />
        <label className={labelClasses} htmlFor="material-url">{t("fields.url")}</label>
        <Input id="material-url" inputMode="url" maxLength={2000} onChange={set("url")} type="url" value={values.url} />
        <label className={labelClasses} htmlFor="material-body">{t("fields.body")}</label>
        <Textarea id="material-body" maxLength={20000} onChange={set("body")} value={values.body} />
        <p className="text-sm text-muted">{t("urlOrBody")}</p>
        <ActionError error={error} />
        <div className="flex gap-2">
          <Button disabled={isSaving} type="submit">{tForm("save")}</Button>
          <Button onClick={onCancel} variant="outline">{tForm("cancel")}</Button>
        </div>
      </form>
    </Card>
  );
}
