import { Profiler, useCallback, useMemo, useState } from 'react';
import { DEFAULT_QUERY } from '../constants/movie';
import { onProfilerRender } from '../dev/profilerLog';
import { useFetch } from '../hooks/useFetch';
import { useRenderLog } from '../hooks/useRenderLog';
import type { MovieFilterValues, MovieResponse } from '../types/movie';
import MovieFilter from '../components/MovieFilter';
import MovieList from '../components/MovieList';
import RenderDebugPanel from '../components/dev/RenderDebugPanel';

function buildSearchUrl(filter: MovieFilterValues): string | null {
  const trimmedQuery = filter.query.trim();
  if (!trimmedQuery) return null;

  const params = new URLSearchParams({
    query: trimmedQuery,
    include_adult: String(filter.includeAdult),
    language: filter.language,
  });

  return `/search/movie?${params.toString()}`;
}

export default function HomePage() {
  useRenderLog('HomePage');

  const [appliedFilter, setAppliedFilter] = useState<MovieFilterValues>({
    query: DEFAULT_QUERY,
    includeAdult: false,
    language: 'ko-KR',
  });

  const searchUrl = useMemo(() => buildSearchUrl(appliedFilter), [appliedFilter]);
  const { data, error, isLoading } = useFetch<MovieResponse>(searchUrl);
  const movies = useMemo(() => data?.results ?? [], [data]);

  const handleSearch = useCallback((filter: MovieFilterValues) => {
    setAppliedFilter(filter);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Profiler id="MovieFilter" onRender={onProfilerRender}>
          <MovieFilter onSearch={handleSearch} />
        </Profiler>

        <Profiler id="MovieList" onRender={onProfilerRender}>
          <MovieList
            movies={movies}
            language={appliedFilter.language}
            isLoading={isLoading}
            error={error}
          />
        </Profiler>
      </main>

      <RenderDebugPanel />
    </div>
  );
}
