import P5Art from "./P5Art";
import { fetchP5Projects } from "../../lib/fetchP5Projects";

export const metadata = {
  title: "p5.js Art | Moises Trejo",
  description:
    "Explore my collection of interactive p5.js art and visualizations. Experience creative coding through generative art, animations, and visual experiments.",
  openGraph: {
    title: "p5.js Art | Moises Trejo",
    description:
      "Explore my collection of interactive p5.js art and visualizations. Experience creative coding through generative art, animations, and visual experiments.",
  },
};

const Page = async () => {
  const projects = await fetchP5Projects();
  return (
    <div>
      <P5Art projects={projects} />
    </div>
  );
};

export default Page;
