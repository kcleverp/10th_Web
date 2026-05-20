import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import type { Lp } from '../types/common';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setErrorMsg(null);
    setSelectedFile(null);
    setTagInput('');

    if (mode === 'edit' && initialLp) {
      setTitle(initialLp.title);
      setContent(initialLp.content);
      setThumbnailUrl(initialLp.thumbnail ?? '');
      setTags(initialLp.tags.map((t) => t.name));
      setPublished(initialLp.published);
      setPreviewUrl(initialLp.thumbnail ?? null);
    } else {
      const e = emptyForm();
      setTitle(e.title);
      setContent(e.content);
      setThumbnailUrl(e.thumbnailUrl);
      setTags(e.tags);
      setPublished(e.published);
      setPreviewUrl(null);
    }
  }, [isOpen, mode, initialLp]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }, []);

  const addTag = useCallback(() => {
    const t = tagInput.trim();
    if (!t || tags.includes(t)) return;
    setTags([...tags, t]);
    setTagInput('');
  }, [tags, tagInput]);

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
