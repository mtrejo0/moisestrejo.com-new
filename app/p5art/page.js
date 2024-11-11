import P5Art from "./P5Art";

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

const Page = () => {
  return (
    <div>
      <P5Art />
    </div>
  );
};

export default Page;
