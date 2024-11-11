import Portfolio from "./Portfolio";

export const metadata = {
  title: "Portfolio | Moises Trejo",
  description:
    "Explore my portfolio of web applications, visualizations and software projects. View demos and descriptions of apps I have built using various technologies.",
  openGraph: {
    title: "Portfolio | Moises Trejo",
    description:
      "Explore my portfolio of web applications, visualizations and software projects. View demos and descriptions of apps I have built using various technologies.",
  },
};

const Page = () => {
  return <Portfolio />;
};

export default Page;
