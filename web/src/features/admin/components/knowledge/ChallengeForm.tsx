"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { libraryCategories } from "@/shared/constants/library-categories";
import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";
import { Input } from "@/shared/ui/primitives/Input";
import { Select } from "@/shared/ui/primitives/Select";
import { Textarea } from "@/shared/ui/primitives/Textarea";

import type { AdminChallenge } from "../../schemas/adminDtoSchemas";
import { ActionError } from "../submission/ActionError";

type ChallengeFormProps = Readonly<{
  initial: AdminChallenge | null;
  isSaving: boolean;
  error?: string;
  onSave: (body: Record<string, string>) => void;
  onCancel: () => void;
}>;

const labelClasses = "text-sm font-bold text-foreground";

export function ChallengeForm({ error, initial, isSaving, onCancel, onSave }: ChallengeFormProps) {
  const t = useTranslations("Admin.knowledge.challenges");
  const tForm = useTranslations("Admin.knowledge.form");
  const [values, setValues] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    categoryId: initial?.categoryId ?? "",
    source: initial?.source ?? "",
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
        <label className={labelClasses} htmlFor="challenge-title">{t("fields.title")}</label>
        <Input id="challenge-title" maxLength={300} onChange={set("title")} required value={values.title} />
        <label className={labelClasses} htmlFor="challenge-description">{t("fields.description")}</label>
        <Textarea id="challenge-description" maxLength={8000} onChange={set("description")} required value={values.description} />
        <label className={labelClasses} htmlFor="challenge-category">{t("fields.category")}</label>
        <Select id="challenge-category" onChange={set("categoryId")} value={values.categoryId}>
          <option value="">{tForm("none")}</option>
          {libraryCategories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </Select>
        <label className={labelClasses} htmlFor="challenge-source">{t("fields.source")}</label>
        <Input id="challenge-source" maxLength={500} onChange={set("source")} value={values.source} />
        <ActionError error={error} />
        <div className="flex gap-2">
          <Button disabled={isSaving} type="submit">{tForm("save")}</Button>
          <Button onClick={onCancel} variant="outline">{tForm("cancel")}</Button>
        </div>
        <p className="text-sm text-muted">{tForm("draftNote")}</p>
      </form>
    </Card>
  );
}
