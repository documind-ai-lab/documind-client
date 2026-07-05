import { Badge } from "@astryxdesign/core/Badge";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import * as stylex from "@stylexjs/stylex";
import { ProjectSummary, ProjectType } from "../model";

const styles = stylex.create({
  card: {
    border: "1px solid #dde3ea",
    boxShadow: "none"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start"
  },
  titleStack: {
    display: "grid",
    gap: 6,
    minWidth: 0
  },
  description: {
    marginTop: 10,
    color: "#596579",
    lineHeight: 1.55
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18
  },
  metaItem: {
    border: "1px solid #dde3ea",
    borderRadius: 8,
    padding: "8px 10px",
    backgroundColor: "#f8fafc"
  }
});

const projectTypeLabels: Record<ProjectType, string> = {
  ESTIMATE_REVIEW: "견적 검토",
  PROPOSAL_REVIEW: "제안 검토",
  CONTRACT_REVIEW: "계약 검토",
  MEETING_NOTE_SUMMARY: "회의록 정리",
  GENERAL_DOCUMENT_ANALYSIS: "일반 문서 분석"
};

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Card padding={4} xstyle={styles.card}>
      <div {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.titleStack)}>
          <Heading level={3}>{project.name}</Heading>
          <Text type="supporting" display="block">
            {projectTypeLabels[project.type]}
          </Text>
        </div>
        <Badge
          variant={project.status === "ACTIVE" ? "green" : "neutral"}
          label={project.status === "ACTIVE" ? "진행 중" : "보관됨"}
        />
      </div>

      <Text type="supporting" display="block" xstyle={styles.description}>
        {project.description ?? "프로젝트 설명이 아직 없습니다."}
      </Text>

      <div {...stylex.props(styles.meta)}>
        <div {...stylex.props(styles.metaItem)}>
          <Text type="supporting" display="block">
            문서
          </Text>
          <Text weight="medium" display="block">
            {project.documentCount}개
          </Text>
        </div>
        <div {...stylex.props(styles.metaItem)}>
          <Text type="supporting" display="block">
            리스크 후보
          </Text>
          <Text weight="medium" display="block">
            {project.riskCandidateCount}개
          </Text>
        </div>
        <div {...stylex.props(styles.metaItem)}>
          <Text type="supporting" display="block">
            마지막 활동
          </Text>
          <Text weight="medium" display="block">
            {formatDate(project.lastActivityAt)}
          </Text>
        </div>
      </div>
    </Card>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}
