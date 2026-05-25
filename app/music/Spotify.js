export const Spotify = () => {
  return (
    <div className="flex justify-center items-center p-4 mt-4">
      <div className="w-full md:w-1/2">
        <iframe
          className="w-full"
          style={{ height: "60vh" }}
          src="https://open.spotify.com/embed/artist/1UCnQ8NE1crGwyq5GKaQ6d?utm_source=generator"
          height="352"
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Spotify;
