import Spotify from "./Spotify"

export const metadata = {
  title: "Music | Moises Trejo",
  description:
    "Check out my music on Spotify.",
  openGraph: {
    title: "Music | Moises Trejo",
    description:
      "Check out my music on Spotify.",
  },
};

export const Page = () => {
  return (
    <Spotify/>
  );
};

export default Page;
