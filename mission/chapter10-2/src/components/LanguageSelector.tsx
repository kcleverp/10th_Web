import { languageOptions } from '../constants/movie';
import { useRenderLog } from '../hooks/useRenderLog';
import type { LanguageCode } from '../types/movie';

interface LanguageSelectorProps {
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  useRenderLog('LanguageSelector');
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="language" className="text-sm font-semibold text-gray-700">
        🌐 언어
      </label>
      <select
        id="language"
        value={value}
        onChange={(e) => onChange(e.target.value as LanguageCode)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
