import { useReducer, useState, type ChangeEvent } from 'react';
import { companyReducer, initialCompanyState } from '../reducers/companyReducer';

export default function CompanyPage() {
  const [inputDept, setInputDept] = useState<string>('');
  const [state, dispatch] = useReducer(companyReducer, initialCompanyState);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputDept(e.target.value);
  };

  const handleApplyChange = () => {
    dispatch({ type: 'CHANGE_DEPARTMENT', payload: inputDept });
  };

  return (
    <section className="w-full max-w-[600px]">
      <h2 className="mb-4 text-3xl font-bold">{state.department}</h2>
      {state.error && (
        <p className="mb-4 text-sm font-semibold text-red-500">{state.error}</p>
      )}

      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={inputDept}
          onChange={handleInputChange}
          placeholder="변경하시고 싶은 직무를 입력해 주세요 (단 거부권 행사 가능)"
          className="w-full border p-2"
        />
        <button
          type="button"
          onClick={handleApplyChange}
          className="self-start rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600"
        >
          직무 변경하기
        </button>
      </div>
    </section>
  );
}
