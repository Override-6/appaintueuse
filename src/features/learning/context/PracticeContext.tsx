import React, {createContext, useContext, useMemo, useState, type ReactNode} from 'react';

type PracticeState = {enabled: boolean; setEnabled: (v: boolean) => void};

const PracticeContext = createContext<PracticeState | undefined>(undefined);

// Mode « À toi d'essayer » : état en mémoire, désactivé par défaut
export function PracticeProvider({children}: {children: ReactNode}) {
  const [enabled, setEnabled] = useState(false);
  const value = useMemo(() => ({enabled, setEnabled}), [enabled]);
  return <PracticeContext.Provider value={value}>{children}</PracticeContext.Provider>;
}

export function usePractice(): PracticeState {
  const ctx = useContext(PracticeContext);
  if (!ctx) {
    throw new Error('usePractice doit être utilisé dans PracticeProvider');
  }
  return ctx;
}
