import { apiGet, apiPost } from "@/shared/api/http";
import { PageResponse } from "@/shared/api/page-response";
import { ProjectDetail, ProjectListStatus, ProjectSummary, ProjectType } from "./model";

export type ListProjectsParams = {
  page?: number;
  size?: number;
  status?: ProjectListStatus;
};

export function listProjects(params: ListProjectsParams = {}): Promise<PageResponse<ProjectSummary>> {
  const search = new URLSearchParams();

  search.set("page", String(params.page ?? 1));
  search.set("size", String(params.size ?? 20));
  search.set("status", params.status ?? "ACTIVE");

  return apiGet<PageResponse<ProjectSummary>>(`/projects?${search.toString()}`);
}

export function getProject(projectId: string): Promise<ProjectDetail> {
  return apiGet<ProjectDetail>(`/projects/${encodeURIComponent(projectId)}`);
}

export type CreateProjectPayload = {
  name: string;
  description?: string | null;
  type: ProjectType;
};

export function createProject(payload: CreateProjectPayload): Promise<ProjectSummary> {
  return apiPost<ProjectSummary, CreateProjectPayload>("/projects", payload);
}
