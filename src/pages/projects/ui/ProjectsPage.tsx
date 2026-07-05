import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { SegmentedControl } from "@astryxdesign/core/SegmentedControl";
import { SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import { archiveProject, listProjects, restoreProject } from "@/entities/project/api";
import { ProjectListStatus, ProjectSummary, projectTypeLabels } from "@/entities/project/model";
import { ProjectCard } from "@/entities/project/ui/ProjectCard";
import { CreateProjectDialog } from "@/features/project-create/ui/CreateProjectDialog";
import { ApiError } from "@/shared/api/http";
import { PageResponse } from "@/shared/api/page-response";

const styles = stylex.create({
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    color: "#1c1e21"
  },
  shell: {
    display: "grid",
    gridTemplateColumns: "280px minmax(0, 1fr)",
    minHeight: "100vh",
    "@media (max-width: 900px)": {
      gridTemplateColumns: "1fr"
    }
  },
  sidebar: {
    borderRight: "1px solid #dde3ea",
    backgroundColor: "#ffffff",
    padding: 24,
    "@media (max-width: 900px)": {
      borderRight: "none",
      borderBottom: "1px solid #dde3ea"
    }
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
    marginBottom: 24,
    "@media (max-width: 720px)": {
      flexDirection: "column"
    }
  },
  headingStack: {
    display: "grid",
    gap: 8
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginBottom: 18,
    "@media (max-width: 720px)": {
      gridTemplateColumns: "1fr"
    }
  },
  summaryCard: {
    border: "1px solid #dde3ea",
    boxShadow: "none"
  },
  projectList: {
    display: "grid",
    gap: 14
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "minmax(260px, 1fr) minmax(260px, 360px)",
    gap: 12,
    alignItems: "end",
    marginBottom: 24,
    "@media (max-width: 820px)": {
      gridTemplateColumns: "1fr"
    }
  },
  filterBox: {
    display: "grid",
    gap: 6
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

export function ProjectsPage({ onOpenProject }: { onOpenProject: (project: ProjectSummary) => void }) {
  const [projectPage, setProjectPage] = useState<PageResponse<ProjectSummary> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);
  const [mutatingProjectId, setMutatingProjectId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectListStatus>("ALL");

  async function loadProjects() {
    setIsLoading(true);
    setErrorMessage(null);
    setActionErrorMessage(null);

    try {
      setProjectPage(await listProjects({ status: "ALL", size: 50 }));
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  async function handleArchiveProject(project: ProjectSummary) {
    await runProjectStatusAction(project, archiveProject);
  }

  async function handleRestoreProject(project: ProjectSummary) {
    await runProjectStatusAction(project, restoreProject);
  }

  async function runProjectStatusAction(
    project: ProjectSummary,
    action: (projectId: string) => Promise<ProjectSummary>
  ) {
    if (mutatingProjectId) {
      return;
    }

    setMutatingProjectId(project.id);
    setActionErrorMessage(null);

    try {
      const updatedProject = await action(project.id);
      setProjectPage((currentPage) => {
        if (!currentPage) {
          return currentPage;
        }

        return {
          ...currentPage,
          items: currentPage.items.map((item) =>
            item.id === updatedProject.id ? updatedProject : item
          )
        };
      });
    } catch (error) {
      setActionErrorMessage(toProjectActionErrorMessage(error, project.status));
    } finally {
      setMutatingProjectId(null);
    }
  }

  const projects = projectPage?.items ?? [];
  const filteredProjects = filterProjects(projects, searchQuery, statusFilter);
  const activeCount = projects.filter((project) => project.status === "ACTIVE").length;
  const visibleArchivedCount = filteredProjects.filter((project) => project.status === "ARCHIVED").length;
  const totalDocuments = projects.reduce((sum, project) => sum + project.documentCount, 0);
  const hasFilter = searchQuery.trim().length > 0 || statusFilter !== "ALL";

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
                목록에서 마지막 활동일을 확인하세요.
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
            <Button
              label="새 프로젝트"
              variant="primary"
              onClick={() => setIsCreateDialogOpen(true)}
            />
          </div>

          <div {...stylex.props(styles.summaryGrid)}>
            <SummaryCard label="전체 프로젝트" value={`${projectPage?.total ?? 0}개`} />
            <SummaryCard label="진행 중" value={`${activeCount}개`} />
            <SummaryCard label="연결 문서" value={`${totalDocuments}개`} />
          </div>

          {!isLoading && !errorMessage && projects.length > 0 ? (
            <div {...stylex.props(styles.controls)}>
              <TextInput
                label="프로젝트 검색"
                value={searchQuery}
                placeholder="프로젝트명, 설명, 유형으로 검색"
                hasClear
                onChange={setSearchQuery}
              />

              <div {...stylex.props(styles.filterBox)}>
                <Text type="supporting" weight="medium" display="block">
                  상태 필터
                </Text>
                <SegmentedControl
                  value={statusFilter}
                  label="프로젝트 상태 필터"
                  layout="fill"
                  onChange={(nextStatus) => setStatusFilter(nextStatus as ProjectListStatus)}
                >
                  {statusFilterOptions.map((option) => (
                    <SegmentedControlItem
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </SegmentedControl>
              </div>
            </div>
          ) : null}

          {isLoading ? <LoadingState /> : null}
          {!isLoading && errorMessage ? (
            <ErrorState message={errorMessage} onRetry={loadProjects} />
          ) : null}
          {!isLoading && !errorMessage && actionErrorMessage ? (
            <ActionErrorState message={actionErrorMessage} />
          ) : null}
          {!isLoading && !errorMessage && projects.length === 0 ? (
            <EmptyState onCreate={() => setIsCreateDialogOpen(true)} />
          ) : null}
          {!isLoading && !errorMessage && projects.length > 0 && filteredProjects.length === 0 ? (
            <NoSearchResultState
              hasFilter={hasFilter}
              onReset={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
            />
          ) : null}
          {!isLoading && !errorMessage && filteredProjects.length > 0 ? (
            <div {...stylex.props(styles.projectList)}>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isActionPending={mutatingProjectId === project.id}
                  isActionDisabled={Boolean(mutatingProjectId)}
                  onOpen={onOpenProject}
                  onArchive={handleArchiveProject}
                  onRestore={handleRestoreProject}
                />
              ))}
              {visibleArchivedCount > 0 ? (
                <Text type="supporting" display="block">
                  보관된 프로젝트 {visibleArchivedCount}개가 포함되어 있습니다.
                </Text>
              ) : null}
            </div>
          ) : null}
        </main>
      </div>
      <CreateProjectDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreated={onOpenProject}
      />
    </div>
  );
}

const statusFilterOptions: Array<{ value: ProjectListStatus; label: string }> = [
  { value: "ALL", label: "전체" },
  { value: "ACTIVE", label: "진행 중" },
  { value: "ARCHIVED", label: "보관됨" }
];

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

function ActionErrorState({ message }: { message: string }) {
  return (
    <Card padding={4} xstyle={[styles.stateCard, styles.stateStack]}>
      <Heading level={3}>프로젝트 상태를 변경하지 못했습니다</Heading>
      <Text type="supporting" display="block">
        {message}
      </Text>
    </Card>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card padding={5} xstyle={[styles.stateCard, styles.stateStack]}>
      <Heading level={3}>아직 프로젝트가 없습니다</Heading>
      <Text type="supporting" display="block">
        새 프로젝트를 만들면 견적서, 제안서, 계약서 검토를 프로젝트별로 시작할 수 있습니다.
      </Text>
      <Button label="새 프로젝트" variant="primary" onClick={onCreate} />
    </Card>
  );
}

function NoSearchResultState({
  hasFilter,
  onReset
}: {
  hasFilter: boolean;
  onReset: () => void;
}) {
  return (
    <Card padding={5} xstyle={[styles.stateCard, styles.stateStack]}>
      <Heading level={3}>조건에 맞는 프로젝트가 없습니다</Heading>
      <Text type="supporting" display="block">
        검색어를 줄이거나 상태 필터를 변경해 다시 확인해주세요.
      </Text>
      {hasFilter ? (
        <Button label="검색 조건 초기화" variant="secondary" onClick={onReset} />
      ) : null}
    </Card>
  );
}

function filterProjects(
  projects: ProjectSummary[],
  searchQuery: string,
  statusFilter: ProjectListStatus
): ProjectSummary[] {
  const normalizedQuery = normalizeSearchText(searchQuery);

  return projects.filter((project) => {
    if (statusFilter !== "ALL" && project.status !== statusFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return normalizeSearchText([
      project.name,
      project.description ?? "",
      projectTypeLabels[project.type]
    ].join(" ")).includes(normalizedQuery);
  });
}

function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase("ko-KR");
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

function toProjectActionErrorMessage(error: unknown, previousStatus: ProjectSummary["status"]): string {
  const actionName = previousStatus === "ACTIVE" ? "보관" : "복원";

  if (error instanceof ApiError) {
    if (error.status === 404) {
      return "프로젝트를 찾을 수 없습니다.";
    }

    if (error.status === 409) {
      return `현재 프로젝트 상태에서는 ${actionName}할 수 없습니다. 목록을 다시 불러와 확인해주세요.`;
    }

    return `서버가 ${error.status} 응답을 반환했습니다.`;
  }

  if (error instanceof TypeError) {
    return "백엔드 서버에 연결할 수 없습니다. API 서버 실행 상태를 확인해주세요.";
  }

  return `프로젝트를 ${actionName}하지 못했습니다.`;
}
