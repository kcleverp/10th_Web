import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Lp } from '../types/common';
import { createLp, updateLp } from '../apis/lpApi';
import { uploadImage } from '../apis/uploadApi';
import { useLpFormModalState, type LpFormModalMode } from '../hooks/useLpFormModalState';

type LpFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: LpFormModalMode;
  initialLp?: Lp | null;
};

const LpFormModal = ({ isOpen, onClose, mode, initialLp }: LpFormModalProps) => {
  const queryClient = useQueryClient();
  const {
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
  } = useLpFormModalState(isOpen, mode, initialLp);

  const saveMutation = useMutation({
    mutationFn: async () => {
      setErrorMsg(null);
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white shadow-2xl border border-[#eee] rounded-sm p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-start border-b border-[#f0f0f0] pb-4">
          <h2 className="text-sm font-black tracking-widest text-[#807bff]">
            {mode === 'create' ? 'ADD LP' : 'EDIT LP'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-black text-lg leading-none px-1"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-black tracking-widest text-gray-400">TITLE</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-[#ccc] rounded-sm px-3 py-2 text-sm outline-none focus:border-[#807bff] transition-colors"
            placeholder="제목"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-black tracking-widest text-gray-400">CONTENT</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="border border-[#ccc] rounded-sm px-3 py-2 text-sm outline-none focus:border-[#807bff] transition-colors resize-none"
            placeholder="내용"
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black tracking-widest text-gray-400">THUMBNAIL</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs text-gray-600" />
          {previewUrl && (
            <img src={previewUrl} alt="" className="w-full aspect-video object-cover border border-[#eee] rounded-sm" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black tracking-widest text-gray-400">TAGS</span>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 border border-[#ccc] rounded-sm px-3 py-2 text-xs outline-none focus:border-[#807bff]"
              placeholder="태그 입력"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-[#807bff] text-white text-[10px] font-black tracking-widest rounded-sm hover:bg-black transition-colors"
            >
              ADD
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 border border-[#eee] px-2 py-1 rounded-sm text-[10px] text-gray-700 bg-[#fafafa]"
              >
                #{t}
                <button type="button" onClick={() => removeTag(t)} className="text-gray-400 hover:text-red-500">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-[11px] text-gray-700 cursor-pointer">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          <span className="font-bold tracking-wide">공개 (published)</span>
        </label>

        {errorMsg && <p className="text-[11px] text-red-500 font-bold">{errorMsg}</p>}

        <button
          type="button"
          disabled={saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
          className="w-full bg-black text-white py-4 text-[10px] font-black tracking-widest hover:bg-[#807bff] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed rounded-sm"
        >
          {saveMutation.isPending ? 'SAVING…' : mode === 'create' ? 'ADD LP' : 'SAVE'}
        </button>
      </div>
    </div>
  );
};

export default LpFormModal;
