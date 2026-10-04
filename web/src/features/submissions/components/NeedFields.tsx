import { CategorySelect } from "./CategorySelect";
import { DescriptionField } from "./DescriptionField";
import { PlaceInput } from "./PlaceInput";
import { TitleInput } from "./TitleInput";

type NeedFieldsProps = Readonly<{
  type: "need" | "localChallenge";
}>;

/** A need or a local challenge: the description matters most; a title is optional (the start of the text is used). */
export function NeedFields({ type }: NeedFieldsProps) {
  return (
    <>
      <DescriptionField type={type} />
      <TitleInput optional />
      <div className="grid gap-6 sm:grid-cols-2">
        <CategorySelect />
        <PlaceInput />
      </div>
    </>
  );
}
