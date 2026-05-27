import { useReducer, useState } from 'react';
import { counterReducer, initialCounterState } from '../reducers/counterReducer';

export default function CounterPage() {
  const [count, setCount] = useState<number>(0);
  const handleIncrease = () => setCount(count + 1);

  const [state, dispatch] = useReducer(counterReducer, initialCounterState);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-10">
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">useState 사용</h2>
        <p className="text-xl">카운트: {count}</p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={handleIncrease} className="border p-2">
            1 증가
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">useReducer 사용</h2>
        <p className="text-xl">카운트: {state.counter}</p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: 'INCREASE', payload: 1 })}
            className="border p-2"
          >
            1 증가
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'INCREASE', payload: 3 })}
            className="border p-2"
          >
            3 증가 (Payload)
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'DECREASE' })}
            className="border p-2"
          >
            1 감소
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'RESET_TO_ZERO' })}
            className="border p-2"
          >
            리셋
          </button>
        </div>
      </section>
    </div>
  );
}
