import { ApiError } from "@/shared/lib/api-error";

import {
  createSubmissionResponseDtoSchema,
  submissionStatusDtoSchema,
  type CreateSubmissionResponseDto,
  type SubmissionStatusDto,
} from "../schemas/submissionDtoSchema";
import type { CreateSubmissionRequest } from "../types/create-submission-request";

const MOCK_LATENCY_MS = 800;

/* Fictional demo submissions, one per status. A newly created submission always opens "demo-new". */
const rawDemoSubmissions: Record<string, unknown> = {
  "demo-new": {
    reference: "ZG-2026-0001",
    type: "need",
    status: "received",
    createdAt: "2026-10-03T12:40:00+02:00",
    title: null,
    description: "Starsza osoba z naszej miejscowości mieszka sama i rzadko wychodzi z domu. Szukamy sposobu, żeby jej pomóc.",
    reply: null,
  },
  "demo-review": {
    reference: "ZG-2026-0002",
    type: "idea",
    status: "in-review",
    createdAt: "2026-10-02T09:15:00+02:00",
    title: "Wspólny obiad dla seniorów w świetlicy wiejskiej",
    description:
      "Raz w tygodniu wspólny obiad w świetlicy, który pomoże seniorom spotkać się z sąsiadami.\nPomysł jest na etapie planowania, szukamy partnerów w gminie.",
    reply: null,
  },
  "demo-answered": {
    reference: "ZG-2026-0003",
    type: "need",
    status: "answered",
    createdAt: "2026-10-01T16:20:00+02:00",
    title: null,
    description: "W naszej gminie osoby z niepełnosprawnością mają trudności z dojazdem do urzędu.",
    reply: {
      text: "Dziękujemy za zgłoszenie.\nW bibliotece innowacji znajdziesz rozwiązania dotyczące dostępności usług publicznych. Jeśli opiszesz sprawę dokładniej, pomożemy skontaktować się z odpowiednim partnerem w gminie.",
      repliedAt: "2026-10-02T11:05:00+02:00",
    },
  },
  "demo-closed": {
    reference: "ZG-2026-0004",
    type: "idea",
    status: "closed",
    createdAt: "2026-09-28T10:00:00+02:00",
    title: "Mobilny punkt informacji dla cudzoziemców",
    description: "Punkt informacyjny, który raz w miesiącu odwiedza mniejsze miejscowości.",
    reply: {
      text: "Dziękujemy za pomysł. Przekazaliśmy go zespołowi Inkubatora Włączenia Społecznego. Zgłoszenie zamykamy; w razie pytań skontaktujemy się z Tobą.",
      repliedAt: "2026-09-30T14:30:00+02:00",
    },
  },
};

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

/** Type "test-error" or "test-limit" in the description to preview the error states. */
export async function createSubmissionMock(request: CreateSubmissionRequest): Promise<CreateSubmissionResponseDto> {
  await wait(MOCK_LATENCY_MS);

  if (/test-limit/i.test(request.description)) {
    throw new ApiError(429);
  }

  if (/test-error/i.test(request.description)) {
    throw new ApiError(500);
  }

  return createSubmissionResponseDtoSchema.parse({ token: "demo-new", reference: "ZG-2026-0001" });
}

/** Parsed through the same schema as live data, so a drifting mock fails loudly. */
export async function getSubmissionStatusMock(token: string): Promise<SubmissionStatusDto | null> {
  const raw = rawDemoSubmissions[token];

  return raw ? submissionStatusDtoSchema.parse(raw) : null;
}
