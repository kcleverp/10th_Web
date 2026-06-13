import { memo } from 'react';

interface ICountButton {
  onClick: (number: number) => void;
}

const CountButton = memo(({ onClick }: ICountButton) => {
  console.log('CountButton 렌더링');
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => onClick(1)} className="border p-2">
        1 증가
      </button>
      <button type="button" onClick={() => onClick(3)} className="border p-2">
        3 증가
      </button>
    </div>
  );
});

export default CountButton;
