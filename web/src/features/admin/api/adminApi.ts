import { apiBaseUrl } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";
import { mapSubmissionDetail, submissionDetailDtoSchema, type SubmissionDetail } from "@/shared/submissions/submissionModel";

import {
  adminInnovationDtoSchema,
  adminInnovationListDtoSchema,
  challengeListDtoSchema,
  createdDtoSchema,
  feedbackListDtoSchema,
  inboxPageDtoSchema,
  materialListDtoSchema,
  overviewDtoSchema,
  publishedDraftDtoSchema,
  trendsDtoSchema,
  type FeedbackStatus,
} from "../schemas/adminDtoSchemas";
import type { InboxFilter } from "../types/inbox-filter";

const admin = `${apiBaseUrl}/admin`;
const enc = encodeURIComponent;

function query(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "" && value !== false) {
      search.set(key, String(value));
    }
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}

export const getOverview = () => fetchJson(`${admin}/overview`, { schema: overviewDtoSchema });

export const getInbox = (filter: InboxFilter) =>
  fetchJson(
    `${admin}/submissions${query({
      status: filter.status,
      type: filter.type,
      categoryId: filter.categoryId,
      unseen: filter.unseen,
      q: filter.q,
      page: filter.page,
      pageSize: filter.pageSize,
    })}`,
    { schema: inboxPageDtoSchema },
  );

const detail = async (request: Promise<unknown>): Promise<SubmissionDetail> => mapSubmissionDetail(submissionDetailDtoSchema.parse(await request));

/** Opening marks the submission seen (and moves a fresh one to "in review"). */
export const openSubmission = (id: string) => detail(fetchJson(`${admin}/submissions/${enc(id)}`));

export const replyAsStaff = (id: string, body: string) =>
  detail(fetchJson(`${admin}/submissions/${enc(id)}/messages`, { method: "POST", json: { body } }));

export const changeSubmissionStatus = (id: string, status: string, note: string) =>
  detail(fetchJson(`${admin}/submissions/${enc(id)}/status`, { method: "PUT", json: { status, note: note || null } }));

export const moderateSubmission = (id: string, body: Record<string, string | null>) =>
  detail(fetchJson(`${admin}/submissions/${enc(id)}/moderation`, { method: "PUT", json: body }));

export const replaceSubmissionLinks = (id: string, innovationIds: string[]) =>
  detail(fetchJson(`${admin}/submissions/${enc(id)}/links`, { method: "PUT", json: { innovationIds } }));

export const publishSubmissionAsInnovation = (id: string) =>
  fetchJson(`${admin}/submissions/${enc(id)}/publish-as-innovation`, { method: "POST", schema: publishedDraftDtoSchema });

export const getAdminInnovations = (params: { status?: string; categoryId?: string; q?: string }) =>
  fetchJson(`${admin}/innovations${query(params)}`, { schema: adminInnovationListDtoSchema });

export const getAdminInnovation = (id: string) => fetchJson(`${admin}/innovations/${enc(id)}`, { schema: adminInnovationDtoSchema });

export const createInnovation = (body: Record<string, string>) =>
  fetchJson(`${admin}/innovations`, { method: "POST", json: body, schema: createdDtoSchema });

export const updateInnovation = (id: string, body: Record<string, string>) =>
  fetchJson(`${admin}/innovations/${enc(id)}`, { method: "PUT", json: body });

export type PublicationStep = "verify" | "publish" | "unpublish";

export const changePublication = (kind: "innovations" | "challenges" | "materials", id: string, step: PublicationStep) =>
  fetchJson(`${admin}/${kind}/${enc(id)}/${step}`, { method: "POST" });

export const deleteKnowledgeItem = (kind: "innovations" | "challenges" | "materials", id: string) =>
  fetchJson(`${admin}/${kind}/${enc(id)}`, { method: "DELETE" });

export const getAdminChallenges = () => fetchJson(`${admin}/challenges`, { schema: challengeListDtoSchema });
export const getAdminMaterials = () => fetchJson(`${admin}/materials`, { schema: materialListDtoSchema });

export const saveChallenge = (id: string | null, body: Record<string, string>) =>
  id
    ? fetchJson(`${admin}/challenges/${enc(id)}`, { method: "PUT", json: body })
    : fetchJson(`${admin}/challenges`, { method: "POST", json: body, schema: createdDtoSchema });

export const saveMaterial = (id: string | null, body: Record<string, string>) =>
  id
    ? fetchJson(`${admin}/materials/${enc(id)}`, { method: "PUT", json: body })
    : fetchJson(`${admin}/materials`, { method: "POST", json: body, schema: createdDtoSchema });

export const getFeedback = (params: { kind?: string; status?: string }) =>
  fetchJson(`${admin}/feedback${query(params)}`, { schema: feedbackListDtoSchema });

export const reviewFeedback = (id: string, status: Exclude<FeedbackStatus, "new">, staffNote: string) =>
  fetchJson(`${admin}/feedback/${enc(id)}`, { method: "PUT", json: { status, staffNote: staffNote || null } });

export const getTrends = (params: { from?: string; to?: string; type?: string }) =>
  fetchJson(`${admin}/trends${query(params)}`, { schema: trendsDtoSchema });
