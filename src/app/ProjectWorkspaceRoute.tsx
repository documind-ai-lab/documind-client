import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import { getProject } from "@/entities/project/api";
import { ProjectDetail } from "@/entities/project/model";
import { ProjectWorkspacePage } from "@/pages/project-workspace/ui/ProjectWorkspacePage";
import { ApiError } from "@/shared/api/http";

const styles = stylex.create({
  statePage: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    backgroundColor: "#f5f7fa",
    color: "#1c1e21"
  },
  stateCard: {
    width: "100%",
    maxWidth: 560,
    border: "1px solid #dde3ea",
    boxShadow: "none"
  },
  stateStack: {
    display: "grid",
    gap: 12
  }
});

export function ProjectWorkspaceRoute({
  projectId,
  onBack
}: {
  projectId: string;
  onBack: () => void;
}) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadProject() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const nextProject = await getProject(projectId);

        if (isCurrent) {
          setProject(nextProject);
        }
      } catch (error) {
        if (isCurrent) {
          setProject(null);
          setErrorMessage(toProjectRouteErrorMessage(error));
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadProject();

    return () => {
      isCurrent = false;
    };
  }, [projectId]);

  if (isLoading) {
    return (
      <RouteState
        title="프로젝트를 불러오는 중입니다"
        description="워크스페이스 진입에 필요한 프로젝트 정보를 확인하고 있습니다."
      />
    );
  }

  if (errorMessage || !project) {
    return (
      <RouteState
        title="워크스페이스를 열 수 없습니다"
        description={errorMessage ?? "프로젝트 정보를 찾을 수 없습니다."}
        actionLabel="프로젝트 목록"
        onAction={onBack}
      />
    );
  }

  return <ProjectWorkspacePage project={project} onBack={onBack} />;
}

function RouteState({
  title,
  description,
  actionLabel,
  onAction
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div {...stylex.props(styles.statePage)}>
      <Card padding={5} xstyle={[styles.stateCard, styles.stateStack]}>
        <Heading level={2}>{title}</Heading>
        <Text type="supporting" display="block">
          {description}
        </Text>
        {actionLabel && onAction ? (
          <Button label={actionLabel} variant="secondary" onClick={onAction} />
        ) : null}
      </Card>
    </div>
  );
}

function toProjectRouteErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return "프로젝트 주소 형식이 올바르지 않습니다.";
    }

    if (error.status === 404) {
      return "프로젝트를 찾을 수 없습니다.";
    }

    return `서버가 ${error.status} 응답을 반환했습니다.`;
  }

  if (error instanceof TypeError) {
    return "백엔드 서버에 연결할 수 없습니다.";
  }

  return "프로젝트 정보를 불러오지 못했습니다.";
}
