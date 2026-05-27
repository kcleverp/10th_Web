export interface IState {
  counter: number;
  error?: string | null;
}

export type TCounterAction =
  | { type: 'INCREASE'; payload: number }
  | { type: 'DECREASE' }
  | { type: 'RESET_TO_ZERO' };
