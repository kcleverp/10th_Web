import type { ICompanyState, TCompanyAction } from '../types/company';

export const initialCompanyState: ICompanyState = {
  department: 'Software Developer',
  error: null,
};

export function companyReducer(
  state: ICompanyState,
  action: TCompanyAction,
): ICompanyState {
  switch (action.type) {
    case 'CHANGE_DEPARTMENT': {
      const nextDept = action.payload;
      const hasError = nextDept !== '카드 메이커';

      return {
        ...state,
        department: hasError ? state.department : nextDept,
        error: hasError ? '카드 메이커만 입력 가능합니다. (거부권 행사)' : null,
      };
    }
    default:
      return state;
  }
}
