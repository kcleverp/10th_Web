import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Lp } from '../types/common';
import { createLp, updateLp } from '../apis/lpApi';
import { uploadImage } from '../apis/uploadApi';
import type { LpFormModalMode } from './useLpFormModalState';

type UseLpFormMutationArgs = {
  mode: LpFormModalMode;
  initialLp?: Lp | null;
  form: {
    title: string;
    content: string;
    thumbnailUrl: string;
    tags: string[];
    published: boolean;
    selectedFile: File | null;
  };
  onClose: () => void;
};

export function useLpFormMutation({ mode, initialLp, form, onClose }: UseLpFormMutationArgs) {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { title, content, thumbnailUrl, tags, published, selectedFile } = form;

  const { mutate: handleSave, isPending } = useMutation({
    onMutate: () => {
      setErrorMsg(null);
    },
    mutationFn: async () => {
      if (!title.trim() || !content.trim()) {
        throw new Error('제목과 내용을 입력해주세요.');
      }

      let thumb = thumbnailUrl.trim();
      if (selectedFile) {
        thumb = await uploadImage(selectedFile);
      }
      if (!thumb) {
        throw new Error('썸네일 이미지를 선택하거나 업로드해주세요.');
      }

      const body = {
        title: title.trim(),
        content: content.trim(),
        thumbnail: thumb,
        tags,
        published,
      };

      if (mode === 'create') {
        await createLp(body);
      } else if (initialLp) {
        await updateLp(initialLp.id, body);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      if (mode === 'edit' && initialLp) {
        queryClient.invalidateQueries({ queryKey: ['lps', 'detail', initialLp.id] });
      }
      onClose();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : '저장에 실패했습니다.';
      setErrorMsg(msg);
    },
  });

  return { handleSave, isPending, errorMsg, setErrorMsg };
}
