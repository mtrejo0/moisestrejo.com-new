

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

const Page = () => {
  return (
    <div className="flex justify-center items-center p-4 mt-4">
      <iframe style={{height:"60vh"}} src="https://open.spotify.com/embed/artist/1UCnQ8NE1crGwyq5GKaQ6d?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    </div>
  );
};

export default Page;
