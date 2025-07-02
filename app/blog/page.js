import Medium from "./Medium";
import Blog from "./Blog";

export const metadata = {
  title: "Blog | Moises Trejo",
  description:
    "Read my latest articles and thoughts on technology, programming, and more on Medium.",
  openGraph: {
    title: "Blog | Moises Trejo",
    description:
      "Read my latest articles and thoughts on technology, programming, and more on Medium.",
  },
};

const Page = () => {
  return (
    <div>
      <Blog/>
      <Medium />
    </div>
  );
};

export default Page;
