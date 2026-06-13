import { memo } from 'react';

interface ITextInput {
  value: string;
  onChange: (value: string) => void;
}

const TextInput = memo(({ value, onChange }: ITextInput) => {
  console.log('TextInput 렌더링');
  return (
    <input
      id="prime-input"
      type="number"
      min={2}
      value={value}
      className="w-full max-w-md rounded border border-blue-500 p-2 outline-none focus:border-blue-600"
      onChange={(e) => onChange(e.target.value)}
    />
  );
});

export default TextInput;
