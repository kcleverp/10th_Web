import { memo } from 'react';
import { TMDB_IMAGE_BASE } from '../constants/movie';
import { useRenderLog } from '../hooks/useRenderLog';
import type { LanguageCode, Movie } from '../types/movie';
import { formatDate } from '../utils/formatDate';

interface MovieDetailModalProps {
  movie: Movie | null;
  language: LanguageCode;
  onClose: () => void;
}

export default memo(function MovieDetailModal({ movie, language, onClose }: MovieDetailModalProps) {
  useRenderLog('MovieDetailModal', { movieId: movie?.id ?? null });

  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_BASE}/original${movie.backdrop_path}`
    : movie.poster_path
      ? `${TMDB_IMAGE_BASE}/w780${movie.poster_path}`
      : null;

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE}/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const popularityPercent = Math.min(Math.round(movie.popularity), 100);

  const handleImdbSearch = () => {
    window.open(
      `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          {backdropUrl ? (
            <img src={backdropUrl} alt={movie.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gray-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-lg text-white hover:bg-black/60"
            aria-label="닫기"
          >
            ×
          </button>
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <h2 className="text-2xl font-bold">{movie.title}</h2>
            <p className="mt-1 text-sm text-gray-200">{movie.original_title}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6 md:flex-row">
          <img
            src={posterUrl}
            alt={movie.title}
            className="mx-auto w-40 shrink-0 rounded-lg object-cover shadow-md md:mx-0"
          />

          <div className="flex flex-1 flex-col gap-5">
            <p className="text-lg font-semibold text-blue-500">
              {movie.vote_average.toFixed(1)}{' '}
              <span className="text-sm font-normal text-gray-500">
                ({movie.vote_count.toLocaleString()} 평가)
              </span>
            </p>

            <div>
              <h3 className="mb-1 text-sm font-bold text-gray-800">개봉일</h3>
              <p className="text-sm text-gray-600">{formatDate(movie.release_date, language)}</p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold text-gray-800">인기도</h3>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${popularityPercent}%` }}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold text-gray-800">줄거리</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {movie.overview || '줄거리 정보가 없습니다.'}
              </p>
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleImdbSearch}
                className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600"
              >
                IMDb에서 검색
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-blue-500 px-5 py-2.5 text-sm font-semibold text-blue-500 hover:bg-blue-50"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
