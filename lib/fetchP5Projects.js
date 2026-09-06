const P5_BASE = "https://mtrejo0.github.io/p5";
const P5_PROJECTS_JSON = `${P5_BASE}/p5jsProjects.json`;

export function getP5ProjectUrl(id) {
  const segments = String(id)
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${P5_BASE}/${segments}/`;
}

/** Fetch the project list from the GitHub Pages–hosted p5 repo. */
export async function fetchP5Projects() {
  try {
    const response = await fetch(P5_PROJECTS_JSON, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error("Failed to fetch p5 projects:", response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching p5 projects:", error);
    return [];
  }
}

export { P5_BASE };
