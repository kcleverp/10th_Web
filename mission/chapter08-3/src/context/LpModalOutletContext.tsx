import { createContext, useContext } from 'react';
import type { HomeLayoutOutletContext } from '../types/layout';

export const LpModalOutletContext = createContext<HomeLayoutOutletContext | null>(null);

export function useLpModalOutlet() {
  return useContext(LpModalOutletContext);
}
