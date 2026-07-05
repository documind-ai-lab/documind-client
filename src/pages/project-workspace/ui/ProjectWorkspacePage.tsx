import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import * as stylex from "@stylexjs/stylex";
import { ProjectSummary, projectTypeLabels } from "@/entities/project/model";

const styles = stylex.create({
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    color: "#1c1e21"
  },
  shell: {
    display: "grid",
    gridTemplateColumns: "300px minmax(0, 1fr) 360px",
    minHeight: "100vh",
    "@media (max-width: 1100px)": {
      gridTemplateColumns: "1fr"
    }
  },
  sidebar: {
    borderRight: "1px solid #dde3ea",
    backgroundColor: "#ffffff",
    padding: 24,
    "@media (max-width: 1100px)": {
      borderRight: "none",
      borderBottom: "1px solid #dde3ea"
    }
  },
  main: {
    padding: 32
  },
  aside: {
    borderLeft: "1px solid #dde3ea",
    backgroundColor: "#ffffff",
    padding: 24,
    "@media (max-width: 1100px)": {
      borderLeft: "none",
      borderTop: "1px solid #dde3ea"
    }
  },
  stack: {
    display: "grid",
    gap: 16
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
    marginBottom: 24,
    "@media (max-width: 720px)": {
      flexDirection: "column"
    }
  },
  headerText: {
    display: "grid",
    gap: 8,
    minWidth: 0
  },
  panel: {
    border: "1px solid #dde3ea",
    boxShadow: "none"
  },
  emptyPanel: {
    display: "grid",
    gap: 12
  },
  meta: {
    display: "grid",
    gap: 10
  },
  metaItem: {
    border: "1px solid #dde3ea",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f8fafc"
  },
  chatSurface: {
    minHeight: 460
  },
  sourceTabs: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8
  },
  sourceTab: {
    border: "1px solid #dde3ea",
    borderRadius: 8,
    padding: "8px 10px",
    backgroundColor: "#f8fafc",
    textAlign: "center"
  }
});

export function ProjectWorkspacePage({
  project,
  onBack
}: {
  project: ProjectSummary;
  onBack: () => void;
}) {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.shell)}>
        <aside {...stylex.props(styles.sidebar)}>
          <div {...stylex.props(styles.stack)}>
            <Button label="프로젝트 목록" variant="secondary" onClick={onBack} />

            <div>
              <Text type="supporting" weight="medium" display="block">
                DocuMind
              </Text>
              <Heading level={1}>워크스페이스</Heading>
            </div>

            <Card padding={4} xstyle={[styles.panel, styles.emptyPanel]}>
              <Heading level={2}>문서</Heading>
              <Text type="supporting" display="block">
                업로드된 문서가 없습니다.
              </Text>
              <Button label="문서 업로드" variant="primary" isDisabled />
            </Card>

            <div {...stylex.props(styles.meta)}>
              <div {...stylex.props(styles.metaItem)}>
                <Text type="supporting" display="block">
                  문서 수
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
            </div>
          </div>
        </aside>

        <main {...stylex.props(styles.main)}>
          <div {...stylex.props(styles.header)}>
            <div {...stylex.props(styles.headerText)}>
              <Badge variant="blue" label={projectTypeLabels[project.type]} />
              <Heading level={2}>{project.name}</Heading>
              <Text type="supporting" display="block">
                {project.description ?? "프로젝트 설명이 아직 없습니다."}
              </Text>
            </div>
            <Badge
              variant={project.status === "ACTIVE" ? "green" : "neutral"}
              label={project.status === "ACTIVE" ? "진행 중" : "보관됨"}
            />
          </div>

          <Card padding={5} xstyle={[styles.panel, styles.emptyPanel, styles.chatSurface]}>
            <Heading level={3}>AI 채팅</Heading>
            <Text type="supporting" display="block">
              문서를 업로드하면 프로젝트 문맥을 기반으로 질문할 수 있습니다.
            </Text>
            <Button label="질문 입력" variant="secondary" isDisabled />
          </Card>
        </main>

        <aside {...stylex.props(styles.aside)}>
          <div {...stylex.props(styles.stack)}>
            <Heading level={2}>출처와 근거</Heading>
            <div {...stylex.props(styles.sourceTabs)}>
              <div {...stylex.props(styles.sourceTab)}>
                <Text weight="medium" display="block">
                  출처
                </Text>
              </div>
              <div {...stylex.props(styles.sourceTab)}>
                <Text weight="medium" display="block">
                  리스크
                </Text>
              </div>
              <div {...stylex.props(styles.sourceTab)}>
                <Text weight="medium" display="block">
                  사실
                </Text>
              </div>
              <div {...stylex.props(styles.sourceTab)}>
                <Text weight="medium" display="block">
                  요약
                </Text>
              </div>
            </div>

            <Card padding={4} xstyle={[styles.panel, styles.emptyPanel]}>
              <Heading level={3}>근거 없음</Heading>
              <Text type="supporting" display="block">
                AI 답변이 생성되면 문서명, 페이지, 인용 문구가 표시됩니다.
              </Text>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
