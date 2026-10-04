"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { libraryCategories } from "@/shared/constants/library-categories";
import { ideaStages, type SubmissionDetail } from "@/shared/submissions/submissionModel";
import { Button } from "@/shared/ui/primitives/Button";
import { Input } from "@/shared/ui/primitives/Input";
import { Select } from "@/shared/ui/primitives/Select";
import { Textarea } from "@/shared/ui/primitives/Textarea";

type ModerationFormProps = Readonly<{
  submission: SubmissionDetail;
  isPending: boolean;
  onSave: (body: Record<string, string | null>) => void;
  onCancel: () => void;
}>;

const labelClasses = "text-sm font-bold text-foreground";

export function ModerationForm({ isPending, onCancel, onSave, submission }: ModerationFormProps) {
  const t = useTranslations("Admin.submission.moderation.fields");
  const tStage = useTranslations("Submission.stage");
  const tButtons = useTranslations("Admin.submission.moderation");
  const isCard = submission.type === "idea" || submission.type === "goodPractice";
  const [values, setValues] = useState({
    title: submission.title,
    description: submission.description,
    categoryId: submission.category?.id ?? "",
    place: submission.place ?? "",
    targetGroup: submission.targetGroup ?? "",
    stage: submission.stage ?? "",
    pilotScale: submission.pilotScale ?? "",
    results: submission.results ?? "",
  });
  const set = (name: keyof typeof values) => (event: { target: { value: string } }) => setValues({ ...values, [name]: event.target.value });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim() || null])));
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={submit}>
      <label className={labelClasses} htmlFor="mod-title">{t("title")}</label>
      <Input id="mod-title" maxLength={200} onChange={set("title")} value={values.title} />
      <label className={labelClasses} htmlFor="mod-description">{t("description")}</label>
      <Textarea id="mod-description" maxLength={4000} onChange={set("description")} value={values.description} />
      <label className={labelClasses} htmlFor="mod-category">{t("category")}</label>
      <Select id="mod-category" onChange={set("categoryId")} value={values.categoryId}>
        <option value="">{t("noCategory")}</option>
        {libraryCategories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </Select>
      <label className={labelClasses} htmlFor="mod-place">{t("place")}</label>
      <Input id="mod-place" maxLength={300} onChange={set("place")} value={values.place} />
      {isCard ? (
        <>
          <label className={labelClasses} htmlFor="mod-target">{t("targetGroup")}</label>
          <Input id="mod-target" maxLength={300} onChange={set("targetGroup")} value={values.targetGroup} />
          <label className={labelClasses} htmlFor="mod-stage">{t("stage")}</label>
          <Select id="mod-stage" onChange={set("stage")} value={values.stage}>
            {ideaStages.map((stage) => (
              <option key={stage} value={stage}>{tStage(stage)}</option>
            ))}
          </Select>
        </>
      ) : null}
      {submission.type === "goodPractice" ? (
        <>
          <label className={labelClasses} htmlFor="mod-scale">{t("pilotScale")}</label>
          <Input id="mod-scale" maxLength={300} onChange={set("pilotScale")} value={values.pilotScale} />
          <label className={labelClasses} htmlFor="mod-results">{t("results")}</label>
          <Textarea id="mod-results" maxLength={4000} onChange={set("results")} value={values.results} />
        </>
      ) : null}
      <div className="flex gap-2">
        <Button disabled={isPending} type="submit">{tButtons("save")}</Button>
        <Button onClick={onCancel} variant="outline">{tButtons("cancel")}</Button>
      </div>
    </form>
  );
}
