import { useRenderLog } from '../hooks/useRenderLog';

interface SelectBoxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  checkboxLabel: string;
}

export default function SelectBox({ label, checked, onChange, checkboxLabel }: SelectBoxProps) {
  useRenderLog('SelectBox');
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <label className="flex h-[42px] items-center gap-2 rounded-lg border border-gray-300 px-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded accent-blue-500"
        />
        <span className="text-sm text-gray-700">{checkboxLabel}</span>
      </label>
    </div>
  );
}
