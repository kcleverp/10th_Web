import type { IState, TCounterAction } from '../types/counter';

export const initialCounterState: IState = {
  counter: 0,
  error: null,
};

export function counterReducer(state: IState, action: TCounterAction): IState {
  switch (action.type) {
    case 'INCREASE':
      return {
        ...state,
        counter: state.counter + action.payload,
      };
    case 'DECREASE':
      return {
        ...state,
        counter: state.counter - 1,
      };
    case 'RESET_TO_ZERO':
      return {
        ...state,
        counter: 0,
      };
    default:
      return state;
  }
}
