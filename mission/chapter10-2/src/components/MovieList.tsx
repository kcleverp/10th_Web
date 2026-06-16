import { memo } from 'react';
import type { LanguageCode, Movie } from '../types/movie';
import { useRenderLog } from '../hooks/useRenderLog';
import MovieCard from './MovieCard';

interface MovieListProps {
  movies: Movie[];
  language: LanguageCode;
  isLoading: boolean;
  error: Error | null;
}

function MovieList({ movies, language, isLoading, error }: MovieListProps) {
  useRenderLog('MovieList', { count: movies.length });

  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <p className="text-sm text-gray-500">영화를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <p className="text-sm text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} language={language} />
      ))}
    </section>
  );
}

export default memo(MovieList);
