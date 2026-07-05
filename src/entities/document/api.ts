import { DocumentSummary } from "./model";
import { apiGetWithOwner } from "@/shared/api/http";
import { PageResponse } from "@/shared/api/page-response";

export type ListDocumentsParams = {
  projectId: string;
  page?: number;
  size?: number;
};

export function listDocuments(
  params: ListDocumentsParams
): Promise<PageResponse<DocumentSummary>> {
  const search = new URLSearchParams();

  search.set("page", String(params.page ?? 1));
  search.set("size", String(params.size ?? 20));

  return apiGetWithOwner<PageResponse<DocumentSummary>>(
    `/projects/${params.projectId}/documents?${search.toString()}`
  );
}
