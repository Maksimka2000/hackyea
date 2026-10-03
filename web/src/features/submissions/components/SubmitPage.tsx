import { Card } from "@/shared/ui/primitives/Card";
import { Container } from "@/shared/ui/primitives/Container";

import type { SubmissionType } from "../constants/submission-types";

import { NextStepsPanel } from "./NextStepsPanel";
import { SubmissionForm } from "./SubmissionForm";
import { SubmitHeader } from "./SubmitHeader";
import { TypeSwitch } from "./TypeSwitch";

type SubmitPageProps = Readonly<{
  type: SubmissionType;
}>;

export function SubmitPage({ type }: SubmitPageProps) {
  return (
    <>
      <SubmitHeader type={type} />
      <Container className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="flex flex-col gap-6">
          <TypeSwitch current={type} />
          <Card className="p-6 sm:p-8">
            {/* key: switching between need and idea starts a fresh form. */}
            <SubmissionForm key={type} type={type} />
          </Card>
        </div>
        <NextStepsPanel />
      </Container>
    </>
  );
}
