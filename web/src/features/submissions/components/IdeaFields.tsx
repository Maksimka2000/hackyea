import { DescriptionField } from "./DescriptionField";
import { StageField } from "./StageField";
import { SubmitterSelect } from "./SubmitterSelect";
import { TargetGroupInput } from "./TargetGroupInput";
import { TitleInput } from "./TitleInput";

export function IdeaFields() {
  return (
    <>
      <TitleInput />
      <DescriptionField type="idea" />
      <TargetGroupInput />
      <StageField />
      <SubmitterSelect />
    </>
  );
}
