export default function MovieTrailer({ trailerUrl }) {
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    if (url.includes('/embed/')) return url;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    return url;
  };

  const embedUrl = getEmbedUrl(trailerUrl);

  if (!embedUrl) return null;

  return (
    <div className="movie-trailer-container">
      <div className="movie-trailer">
        <iframe
          src={embedUrl}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
