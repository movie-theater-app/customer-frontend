export default function MovieDetails({ movie }) {
  return (
    <div className="movie-details">
      <h1 className="movie-title">{movie.title}</h1>
      <p className="movie-description">{movie.description}</p>
      <div className="movie-poster">
        <img src={movie.poster_url} alt={movie.title} />
      </div>
      <div className="movie-info">
        <div className="movie-info-item">
          <span className="info-header">Genre</span>
          <span className="info-value">{movie.genre}</span>
        </div>
        <div className="movie-info-item">
          <span className="info-header">Duration</span>
          <span className="info-value">{movie.duration_minutes} min</span>
        </div>
        <div className="movie-info-item">
          <span className="info-header">Age Rating</span>
          <span className="info-value">{movie.age_rating}</span>
        </div>
      </div>
    </div>
  );
}
