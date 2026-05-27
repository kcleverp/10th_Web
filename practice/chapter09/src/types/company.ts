export interface ICompanyState {
  department: string;
  error: string | null;
}

export type TCompanyAction = {
  type: 'CHANGE_DEPARTMENT';
  payload: string;
};
