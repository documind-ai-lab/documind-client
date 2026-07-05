export type DocumentStatus =
  | "TEXT_EXTRACTION_PENDING"
  | "TEXT_EXTRACTING"
  | "READY"
  | "FAILED";

export type DocumentSummary = {
  id: string;
  projectId: string;
  originalName: string;
  extension: string;
  mimeType: string;
  sizeBytes: number;
  status: DocumentStatus;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export const documentStatusLabels: Record<DocumentStatus, string> = {
  TEXT_EXTRACTION_PENDING: "텍스트 추출 대기",
  TEXT_EXTRACTING: "텍스트 추출 중",
  READY: "분석 가능",
  FAILED: "처리 실패"
};
