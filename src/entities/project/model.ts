export type ProjectType =
  | "ESTIMATE_REVIEW"
  | "PROPOSAL_REVIEW"
  | "CONTRACT_REVIEW"
  | "MEETING_NOTE_SUMMARY"
  | "GENERAL_DOCUMENT_ANALYSIS";

export type ProjectStatus = "ACTIVE" | "ARCHIVED";

export type ProjectSummary = {
  id: string;
  name: string;
  description: string | null;
  type: ProjectType;
  status: ProjectStatus;
  documentCount: number;
  riskCandidateCount: number;
  lastActivityAt: string;
};

export type ProjectDetail = ProjectSummary & {
  createdAt: string;
  updatedAt: string;
};

export type ProjectListStatus = ProjectStatus | "ALL";

export const projectTypeLabels: Record<ProjectType, string> = {
  ESTIMATE_REVIEW: "견적 검토",
  PROPOSAL_REVIEW: "제안 검토",
  CONTRACT_REVIEW: "계약 검토",
  MEETING_NOTE_SUMMARY: "회의록 정리",
  GENERAL_DOCUMENT_ANALYSIS: "일반 문서 분석"
};
