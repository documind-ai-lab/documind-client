export function getProjectIdFromPath(pathname: string): string | null {
  if (pathname === "/" || pathname === "/projects") {
    return null;
  }

  if (!pathname.startsWith("/projects/")) {
    return null;
  }

  const [projectId] = pathname.slice("/projects/".length).split("/");

  if (!projectId) {
    return null;
  }

  try {
    return decodeURIComponent(projectId);
  } catch {
    return projectId;
  }
}

export function navigateToPath(path: string) {
  if (window.location.pathname === path) {
    return;
  }

  window.history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
