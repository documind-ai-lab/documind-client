import { apiGet } from "@/shared/api/http";
import { PageResponse } from "@/shared/api/page-response";
import { ProjectListStatus, ProjectSummary } from "./model";

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
