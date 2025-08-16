import Products from "./Products";

export const metadata = {
  title: "Products | Moises Trejo",
  description: "A collection of web apps and tools I've built, including both external links and interactive demos you can try right here.",
  openGraph: {
    title: "Products | Moises Trejo", 
    description: "A collection of web apps and tools I've built, including both external links and interactive demos you can try right here.",
  },
};

const Page = () => {
  return <Products />;
};

export default Page;
