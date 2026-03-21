import Link from "next/link";
import { fetchP5Projects } from "../../../lib/fetchP5Projects";

const HEROKU_BASE = "https://p5-heroku-ea7d718a9c54.herokuapp.com";

export async function generateStaticParams() {
  const projects = await fetchP5Projects();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const projects = await fetchP5Projects();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return { title: "Project Not Found | Moises Trejo" };
  }

  const description = Array.isArray(project.description)
    ? project.description.join(" ")
    : project.description;

  return {
    title: `${project.name} - p5.js Art | Moises Trejo`,
    description,
    openGraph: {
      title: `${project.name} - p5.js Art | Moises Trejo`,
      description,
    },
  };
}

const Page = async ({ params }) => {
  const { id } = await params;

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-2 flex items-center gap-3">
        <Link
          href="/p5art"
          className="text-black text-sm px-3 py-1 rounded bg-white border border-black hover:bg-gray-100 transition-colors no-underline"
        >
          &larr; All Projects
        </Link>
      </div>
      <iframe
        src={`${HEROKU_BASE}/${id}/`}
        className="w-full flex-1 border-0"
        title="P5.js Project"
      />
    </div>
  );
};

export default Page;
