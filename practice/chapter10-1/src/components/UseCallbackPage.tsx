import { useState, useCallback } from 'react';
import CountButton from './CountButton';
import TextInput from './TextInput';

export default function UseCallbackPage() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  const handleIncreaseCount = useCallback((number: number) => {
    setCount((prev) => prev + number);
  }, []);

  const handleText = useCallback((text: string) => {
    setText(text);
  }, []);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <h2 className="text-2xl font-bold">useCallback 사용</h2>
      <p className="text-xl">카운트: {count}</p>
      <CountButton onClick={handleIncreaseCount} />
      <p className="text-xl">입력 텍스트: {text || '(없음)'}</p>
      <TextInput onChange={handleText} />
    </div>
  );
}
