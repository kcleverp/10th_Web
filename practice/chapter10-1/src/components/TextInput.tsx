import { memo } from 'react';

interface ITextInput {
  onChange: (text: string) => void;
}

const TextInput = memo(({ onChange }: ITextInput) => {
  console.log('TextInput 렌더링');
  return (
    <input
      type="text"
      placeholder="텍스트를 입력하세요"
      className="w-full max-w-md border p-2"
      onChange={(e) => onChange(e.target.value)}
    />
  );
});

export default TextInput;
