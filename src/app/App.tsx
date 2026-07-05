import { useState } from "react";
import { ProjectSummary } from "@/entities/project/model";
import { ProjectWorkspacePage } from "@/pages/project-workspace/ui/ProjectWorkspacePage";
import { ProjectsPage } from "@/pages/projects/ui/ProjectsPage";

export function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectSummary | null>(null);

  if (selectedProject) {
    return (
      <ProjectWorkspacePage
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return <ProjectsPage onOpenProject={setSelectedProject} />;
}
