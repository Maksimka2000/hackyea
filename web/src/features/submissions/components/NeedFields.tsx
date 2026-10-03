import { AreaSelect } from "./AreaSelect";
import { DescriptionField } from "./DescriptionField";
import { PlaceInput } from "./PlaceInput";
import { SubmitterSelect } from "./SubmitterSelect";

export function NeedFields() {
  return (
    <>
      <DescriptionField type="need" />
      <div className="grid gap-6 sm:grid-cols-2">
        <AreaSelect />
        <PlaceInput />
      </div>
      <SubmitterSelect />
    </>
  );
}
