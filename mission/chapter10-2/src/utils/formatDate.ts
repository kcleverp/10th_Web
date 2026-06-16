import type { LanguageCode } from '../types/movie';

const localeMap: Record<LanguageCode, string> = {
  'ko-KR': 'ko-KR',
  'en-US': 'en-US',
  'ja-JP': 'ja-JP',
};

export function formatDate(dateString: string, language: LanguageCode): string {
  if (!dateString) return '-';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString(localeMap[language], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
