import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import { listProjects } from "@/entities/project/api";
import { ProjectCard } from "@/entities/project/ui/ProjectCard";
import { ApiError } from "@/shared/api/http";
import { PageResponse } from "@/shared/api/page-response";
import { ProjectSummary } from "@/entities/project/model";

const styles = stylex.create({
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    color: "#1c1e21"
  },
  shell: {
    display: "grid",
    gridTemplateColumns: "280px minmax(0, 1fr)",
    minHeight: "100vh"
  },
  sidebar: {
    borderRight: "1px solid #dde3ea",
    backgroundColor: "#ffffff",
    padding: 24
  },
  sidebarStack: {
    display: "grid",
    gap: 18
  },
  main: {
    padding: 32
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
    marginBottom: 24
  },
  headingStack: {
    display: "grid",
    gap: 8
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginBottom: 24
  },
  summaryCard: {
    border: "1px solid #dde3ea",
    boxShadow: "none"
  },
  projectList: {
    display: "grid",
    gap: 14
  },
  stateCard: {
    border: "1px solid #dde3ea",
    boxShadow: "none",
    maxWidth: 720
  },
  stateStack: {
    display: "grid",
    gap: 12
  },
  navItem: {
    border: "1px solid #dde3ea",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f8fafc"
  },
  navItemActive: {
    borderColor: "#1f6f78",
    backgroundColor: "#eef8f9"
  }
});

export function ProjectsPage() {
  const [projectPage, setProjectPage] = useState<PageResponse<ProjectSummary> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadProjects() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setProjectPage(await listProjects({ status: "ALL" }));
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  const projects = projectPage?.items ?? [];
  const activeCount = projects.filter((project) => project.status === "ACTIVE").length;
  const archivedCount = projects.filter((project) => project.status === "ARCHIVED").length;
  const totalDocuments = projects.reduce((sum, project) => sum + project.documentCount, 0);

  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.shell)}>
        <aside {...stylex.props(styles.sidebar)}>
          <div {...stylex.props(styles.sidebarStack)}>
            <div>
              <Text type="supporting" weight="medium" display="block">
                DocuMind
              </Text>
              <Heading level={1}>프로젝트</Heading>
            </div>

            <div {...stylex.props(styles.navItem, styles.navItemActive)}>
              <Text weight="medium" display="block">
                프로젝트 목록
              </Text>
              <Text type="supporting" display="block">
                문서 분석 업무공간
              </Text>
            </div>

            <div {...stylex.props(styles.navItem)}>
              <Text weight="medium" display="block">
                최근 활동
              </Text>
              <Text type="supporting" display="block">
                다음 단계에서 연결 예정
              </Text>
            </div>
          </div>
        </aside>

        <main {...stylex.props(styles.main)}>
          <div {...stylex.props(styles.toolbar)}>
            <div {...stylex.props(styles.headingStack)}>
              <Badge variant="blue" label="Project API 연결" />
              <Heading level={2}>프로젝트별 문서 분석 워크스페이스</Heading>
              <Text type="supporting" display="block">
                백엔드에 저장된 프로젝트를 불러와 문서 검토 작업의 시작점을 보여줍니다.
              </Text>
            </div>
            <Button label="새 프로젝트" variant="primary" />
          </div>

          <div {...stylex.props(styles.summaryGrid)}>
            <SummaryCard label="전체 프로젝트" value={`${projectPage?.total ?? 0}개`} />
            <SummaryCard label="진행 중" value={`${activeCount}개`} />
            <SummaryCard label="연결 문서" value={`${totalDocuments}개`} />
          </div>

          {isLoading ? <LoadingState /> : null}
          {!isLoading && errorMessage ? (
            <ErrorState message={errorMessage} onRetry={loadProjects} />
          ) : null}
          {!isLoading && !errorMessage && projects.length === 0 ? <EmptyState /> : null}
          {!isLoading && !errorMessage && projects.length > 0 ? (
            <div {...stylex.props(styles.projectList)}>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              {archivedCount > 0 ? (
                <Text type="supporting" display="block">
                  보관된 프로젝트 {archivedCount}개가 포함되어 있습니다.
                </Text>
              ) : null}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card padding={4} xstyle={styles.summaryCard}>
      <Text type="supporting" display="block">
        {label}
      </Text>
      <Heading level={3}>{value}</Heading>
    </Card>
  );
}

function LoadingState() {
  return (
    <Card padding={5} xstyle={[styles.stateCard, styles.stateStack]}>
      <Heading level={3}>프로젝트를 불러오는 중입니다</Heading>
      <Text type="supporting" display="block">
        백엔드 Project API 응답을 기다리고 있습니다.
      </Text>
    </Card>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card padding={5} xstyle={[styles.stateCard, styles.stateStack]}>
      <Heading level={3}>프로젝트 목록을 불러오지 못했습니다</Heading>
      <Text type="supporting" display="block">
        {message}
      </Text>
      <Button label="다시 시도" variant="secondary" onClick={onRetry} />
    </Card>
  );
}

function EmptyState() {
  return (
    <Card padding={5} xstyle={[styles.stateCard, styles.stateStack]}>
      <Heading level={3}>아직 프로젝트가 없습니다</Heading>
      <Text type="supporting" display="block">
        새 프로젝트를 만들면 견적서, 제안서, 계약서 검토를 프로젝트별로 시작할 수 있습니다.
      </Text>
      <Button label="새 프로젝트" variant="primary" />
    </Card>
  );
}

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return `서버가 ${error.status} 응답을 반환했습니다.`;
  }

  if (error instanceof TypeError) {
    return "백엔드 서버에 연결할 수 없습니다. API 서버 실행 상태를 확인해주세요.";
  }

  return "알 수 없는 오류가 발생했습니다.";
}
