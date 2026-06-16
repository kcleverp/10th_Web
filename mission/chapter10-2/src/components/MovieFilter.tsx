import { memo, useState } from 'react';
import { DEFAULT_QUERY } from '../constants/movie';
import { useRenderLog } from '../hooks/useRenderLog';
import type { LanguageCode, MovieFilterValues } from '../types/movie';
import Input from './Input';
import LanguageSelector from './LanguageSelector';
import SelectBox from './SelectBox';

interface MovieFilterProps {
  onSearch: (filter: MovieFilterValues) => void;
}

function MovieFilter({ onSearch }: MovieFilterProps) {
  useRenderLog('MovieFilter');

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>('ko-KR');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch({ query, includeAdult, language });
  };

  return (
    <section className="mb-8 rounded-xl bg-white p-6 shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="🎬 영화 제목"
            name="query"
            value={query}
            onChange={setQuery}
            placeholder="영화 제목을 입력하세요"
          />
          <SelectBox
            label="⚙️ 옵션"
            checked={includeAdult}
            onChange={setIncludeAdult}
            checkboxLabel="성인 콘텐츠 표시"
          />
        </div>

        <LanguageSelector value={language} onChange={setLanguage} />

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        >
          🔍 검색하기
        </button>
      </form>
    </section>
  );
}

export default memo(MovieFilter);
