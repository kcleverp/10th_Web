import { memo } from 'react';
import { TMDB_IMAGE_BASE } from '../constants/movie';
import { useRenderLog } from '../hooks/useRenderLog';
import type { LanguageCode, Movie } from '../types/movie';
import { formatDate } from '../utils/formatDate';

interface MovieCardProps {
  movie: Movie;
  language: LanguageCode;
  onClick: (movie: Movie) => void;
}

function MovieCard({ movie, language, onClick }: MovieCardProps) {
  useRenderLog('MovieCard', { id: movie.id, title: movie.title });

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE}/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <article
      onClick={() => onClick(movie)}
      className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="relative">
        <img
          src={posterUrl}
          alt={movie.title}
          className="aspect-[2/3] w-full object-cover"
        />
        <span className="absolute right-2 top-2 rounded-md bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
          {movie.vote_average.toFixed(1)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 text-base font-bold text-gray-900">{movie.title}</h3>
        <p className="mb-2 text-sm text-gray-500">{formatDate(movie.release_date, language)}</p>
        <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
          {movie.overview || '줄거리 정보가 없습니다.'}
        </p>
      </div>
    </article>
  );
}

export default memo(MovieCard);
