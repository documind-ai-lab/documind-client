import { DocumentSummary } from "./model";
import { apiGetWithOwner, apiPostFormWithOwner, apiPostWithOwner } from "@/shared/api/http";
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
    `/projects/${encodeURIComponent(params.projectId)}/documents?${search.toString()}`
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
    `/projects/${encodeURIComponent(params.projectId)}/documents`,
    body
  );
}

export type RetryDocumentParams = {
  projectId: string;
  documentId: string;
};

export function retryDocument(params: RetryDocumentParams): Promise<DocumentSummary> {
  return apiPostWithOwner<DocumentSummary, Record<string, never>>(
    `/projects/${encodeURIComponent(params.projectId)}/documents/${encodeURIComponent(
      params.documentId
    )}/retry`,
    {}
  );
}
