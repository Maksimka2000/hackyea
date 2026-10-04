import { CategorySelect } from "./CategorySelect";
import { DescriptionField } from "./DescriptionField";
import { SimilarInnovations } from "./SimilarInnovations";
import { StageField } from "./StageField";
import { TargetGroupInput } from "./TargetGroupInput";
import { TitleInput } from "./TitleInput";

/** The idea card: essence, target group and stage, then a check against similar innovations in the library. */
export function IdeaFields() {
  return (
    <>
      <TitleInput />
      <DescriptionField type="idea" />
      <TargetGroupInput />
      <StageField />
      <CategorySelect />
      <SimilarInnovations />
    </>
  );
}
