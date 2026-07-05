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

export type ProjectListStatus = ProjectStatus | "ALL";
