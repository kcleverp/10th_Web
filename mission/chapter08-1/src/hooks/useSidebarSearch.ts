import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';

export function useSidebarSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setSearch(searchParams.get('search') ?? '');
  }, [searchParams]);

  useEffect(() => {
    const normalized = debouncedSearch.trim();

    setSearchParams(
      (prev) => {
        const current = (prev.get('search') ?? '').trim();
        if (normalized === current) return prev;

        const next = new URLSearchParams(prev);
        if (normalized) next.set('search', normalized);
        else next.delete('search');
        return next;
      },
      { replace: true },
    );
  }, [debouncedSearch, setSearchParams]);

  return { search, setSearch };
}
