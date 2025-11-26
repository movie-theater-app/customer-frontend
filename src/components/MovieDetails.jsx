export default function MovieDetails({ movie }) {
  return (
    <div className="movie-details">
      <h1 className="movie-title">{movie.title}</h1>
      <p className="movie-description">{movie.description}</p>
      <div className="movie-poster">
        <img src={movie.poster_url} alt={movie.title} />
      </div>
    </div>
  );
}
