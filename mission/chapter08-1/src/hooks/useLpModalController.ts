import { useCallback, useMemo, useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import type { Lp } from '../types/common';
import type { LpFormModalMode } from './useLpFormModalState';

export type LpModalState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; lp: Lp };

type AuthUser = { id: number; email: string; name: string };

export function useLpModalController(user: AuthUser | null, navigate: NavigateFunction) {
  const [lpModal, setLpModal] = useState<LpModalState>({ mode: 'closed' });

  const openCreate = useCallback(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLpModal({ mode: 'create' });
  }, [user, navigate]);

  const openEdit = useCallback(
    (lp: Lp) => {
      if (!user) {
        navigate('/login');
        return;
      }
      setLpModal({ mode: 'edit', lp });
    },
    [user, navigate]
  );

  const close = useCallback(() => {
    setLpModal({ mode: 'closed' });
  }, []);

  const outletContext = useMemo(
    () => ({ openLpModalCreate: openCreate, openLpModalEdit: openEdit }),
    [openCreate, openEdit]
  );

  const modalProps = useMemo(
    () => ({
      isOpen: lpModal.mode !== 'closed',
      mode: (lpModal.mode === 'edit' ? 'edit' : 'create') as LpFormModalMode,
      initialLp: lpModal.mode === 'edit' ? lpModal.lp : null,
      onClose: close,
    }),
    [lpModal, close]
  );

  return { lpModal, outletContext, modalProps };
}
