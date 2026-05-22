import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Lp } from '../types/common';
import { usePreviewUrl } from './usePreviewUrl';

export type LpFormModalMode = 'create' | 'edit';

const emptyForm = () => ({
  title: '',
  content: '',
  thumbnailUrl: '',
  tags: [] as string[],
  published: true,
});

export function useLpFormModalState(
  isOpen: boolean,
  mode: LpFormModalMode,
  initialLp?: Lp | null
) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [published, setPublished] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const remoteUrl = useMemo(
    () => (mode === 'edit' && initialLp ? initialLp.thumbnail ?? null : null),
    [mode, initialLp]
  );

  const { previewUrl, selectedFile, handleFileChange } = usePreviewUrl(isOpen, remoteUrl);

  useEffect(() => {
    if (!isOpen) {
      const e = emptyForm();
      setTitle(e.title);
      setContent(e.content);
      setThumbnailUrl(e.thumbnailUrl);
      setTags(e.tags);
      setPublished(e.published);
      setTagInput('');
      setErrorMsg(null);
      return;
    }

    setErrorMsg(null);
    setTagInput('');

    if (mode === 'edit' && initialLp) {
      setTitle(initialLp.title);
      setContent(initialLp.content);
      setThumbnailUrl(initialLp.thumbnail ?? '');
      setTags(initialLp.tags.map((t) => t.name));
      setPublished(initialLp.published);
    } else {
      const e = emptyForm();
      setTitle(e.title);
      setContent(e.content);
      setThumbnailUrl(e.thumbnailUrl);
      setTags(e.tags);
      setPublished(e.published);
    }
  }, [isOpen, mode, initialLp]);

  const addTag = useCallback(() => {
    const t = tagInput.trim();
    if (!t) return;
    setTags((prev) => (prev.includes(t) ? prev : [...prev, t]));
    setTagInput('');
  }, [tagInput]);

  const removeTag = useCallback((name: string) => {
    setTags((prev) => prev.filter((x) => x !== name));
  }, []);

  return {
    title,
    setTitle,
    content,
    setContent,
    thumbnailUrl,
    tags,
    tagInput,
    setTagInput,
    published,
    setPublished,
    selectedFile,
    previewUrl,
    errorMsg,
    setErrorMsg,
    handleFileChange,
    addTag,
    removeTag,
  };
}
