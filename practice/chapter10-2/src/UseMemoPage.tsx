import { useState, useMemo } from 'react';
import TextInput from './components/TextInput';
import { findPrimes } from './utils/math';

export default function UseMemoPage() {
  const [limit, setLimit] = useState('1000000');

  const primes = useMemo(() => {
    console.log('소수 계산 실행');
    const num = Number(limit);
    if (Number.isNaN(num) || num < 2) return [];
    return findPrimes(Math.floor(num));
  }, [limit]);

  return (
    <div className="flex w-full max-w-4xl flex-col gap-4 text-left">
      <h1 className="text-2xl font-bold">같이 배우는 리액트: useMemo편</h1>
      <div className="flex flex-col gap-2">
        <label htmlFor="prime-input">숫자 입력 (소수 찾기):</label>
        <TextInput value={limit} onChange={setLimit} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-medium">소수 리스트:</p>
        <p className="break-all text-sm leading-relaxed">{primes.join(' ')}</p>
      </div>
    </div>
  );
}
