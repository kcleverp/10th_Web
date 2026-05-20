import type { Lp } from './common';

export type HomeLayoutOutletContext = {
  openLpModalCreate: () => void;
  openLpModalEdit: (lp: Lp) => void;
};
