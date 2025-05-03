import Apps from "./Apps";

export const metadata = {
  title: "Apps | Moises Trejo", 
  description: "A collection of web apps and tools I've built, including both external links and interactive demos you can try right here.",
  openGraph: {
    title: "Apps | Moises Trejo",
    description: "A collection of web apps and tools I've built, including both external links and interactive demos you can try right here.",
  },
};

const Page = () => {
  return <Apps />;
};

export default Page;
