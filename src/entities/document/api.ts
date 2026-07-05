import { DocumentSummary } from "./model";
import { apiGetWithOwner, apiPostFormWithOwner } from "@/shared/api/http";
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

export type UploadDocumentParams = {
  projectId: string;
  file: File;
};

export function uploadDocument(params: UploadDocumentParams): Promise<DocumentSummary> {
  const body = new FormData();

  body.append("file", params.file);

  return apiPostFormWithOwner<DocumentSummary>(
    `/projects/${params.projectId}/documents`,
    body
  );
}
