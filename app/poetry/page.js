import Poetry from "./Poetry";

export const metadata = {
  title: "Poetry | Moises Trejo",
  description:
    "Explore my collection of original poetry and creative writing. Read verses that capture emotions, experiences, and artistic expression.",
  openGraph: {
    title: "Poetry | Moises Trejo", 
    description:
      "Explore my collection of original poetry and creative writing. Read verses that capture emotions, experiences, and artistic expression.",
  },
};

const Page = () => {
  return (
    <div>
      <Poetry />
    </div>
  );
};

export default Page;
