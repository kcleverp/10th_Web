import type { Lp } from '../types/common';
import { useLpFormModalState, type LpFormModalMode } from '../hooks/useLpFormModalState';
import { useLpFormMutation } from '../hooks/useLpFormMutation';
import Modal from './Modal';

type LpFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: LpFormModalMode;
  initialLp?: Lp | null;
};

const LpFormModal = ({ isOpen, onClose, mode, initialLp }: LpFormModalProps) => {
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
    handleFileChange,
    addTag,
    removeTag,
  } = useLpFormModalState(isOpen, mode, initialLp);

  const { handleSave, isPending, errorMsg } = useLpFormMutation({
    mode,
    initialLp,
    form: { title, content, thumbnailUrl, tags, published, selectedFile },
    onClose,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeDisabled={isPending}
      title={mode === 'create' ? 'ADD LP' : 'EDIT LP'}
    >
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
        disabled={isPending}
        onClick={() => handleSave()}
        className="w-full bg-black text-white py-4 text-[10px] font-black tracking-widest hover:bg-[#807bff] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed rounded-sm"
      >
        {isPending ? 'SAVING…' : mode === 'create' ? 'ADD LP' : 'SAVE'}
      </button>
    </Modal>
  );
};

export default LpFormModal;
