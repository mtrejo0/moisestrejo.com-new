import Art from "./Art";

export const metadata = {
  title: "Art Gallery | Moises Trejo",
  description:
    "Explore my digital art gallery featuring original artwork, illustrations, and creative designs. View my artistic journey and creative expression.",
  openGraph: {
    title: "Art Gallery | Moises Trejo",
    description:
      "Explore my digital art gallery featuring original artwork, illustrations, and creative designs. View my artistic journey and creative expression.",
  },
};

const Page = () => {
  return (
    <div>
      <Art />
    </div>
  );
};

export default Page;
