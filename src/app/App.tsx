import { useEffect, useState } from "react";
import { ProjectSummary } from "@/entities/project/model";
import { ProjectsPage } from "@/pages/projects/ui/ProjectsPage";
import { ProjectWorkspaceRoute } from "./ProjectWorkspaceRoute";
import { getProjectIdFromPath, navigateToPath } from "./routing";

export function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const projectId = getProjectIdFromPath(currentPath);

  useEffect(() => {
    function handlePopState() {
      setCurrentPath(window.location.pathname);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigateToProjects() {
    navigateToPath("/projects");
  }

  function navigateToProject(project: ProjectSummary) {
    navigateToPath(`/projects/${project.id}`);
  }

  if (projectId) {
    return (
      <ProjectWorkspaceRoute
        projectId={projectId}
        onBack={navigateToProjects}
      />
    );
  }

  return <ProjectsPage onOpenProject={navigateToProject} />;
}
