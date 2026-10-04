import { CategorySelect } from "./CategorySelect";
import { DescriptionField } from "./DescriptionField";
import { PilotScaleInput } from "./PilotScaleInput";
import { PlaceInput } from "./PlaceInput";
import { ResultsField } from "./ResultsField";
import { StageField } from "./StageField";
import { TargetGroupInput } from "./TargetGroupInput";
import { TitleInput } from "./TitleInput";

/** A good practice or micro-scale pilot that already ran: what it is, for whom, at what scale and with what results. */
export function GoodPracticeFields() {
  return (
    <>
      <TitleInput />
      <DescriptionField type="goodPractice" />
      <TargetGroupInput />
      <StageField />
      <div className="grid gap-6 sm:grid-cols-2">
        <PilotScaleInput />
        <PlaceInput />
      </div>
      <ResultsField />
      <CategorySelect />
    </>
  );
}
