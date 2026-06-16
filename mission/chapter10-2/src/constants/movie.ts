import type { LanguageCode } from '../types/movie';

export const languageOptions: { label: string; value: LanguageCode }[] = [
  { label: '한국어', value: 'ko-KR' },
  { label: '영어', value: 'en-US' },
  { label: '일본어', value: 'ja-JP' },
];

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const DEFAULT_QUERY = '명탐정 코난';
