import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {removeKey, saveJson, loadJson} from '@/storage/storage';
import type {PlanPiece} from '../logic/plan';
import {
  EMPTY_RATE_DRAFT,
  DEFAULT_RATE_DM2_PER_L,
  PAINT_PLAN_KEY,
  isPaintPlanData,
  type KnownDraft,
  type PaintPlanData,
  type RateDraft,
  type ShapeDraft,
} from '../logic/persist';

type PlanActions = {
  addPiece: (piece: PlanPiece) => void;
  removePiece: (index: number) => void;
  setCount: (index: number, count: number) => void;
  setRate: (rateDm2PerL: number) => void;
  setShapeDraft: (draft: ShapeDraft) => void;
  clearShapeDraft: () => void;
  setKnownDraft: (draft: KnownDraft) => void;
  clearKnownDraft: () => void;
  setRateDraft: (draft: RateDraft) => void;
  reset: () => void; // Recommencer : efface l'état et le stockage
};

export type PlanState = PaintPlanData & PlanActions;

const INITIAL: PaintPlanData = {
  pieces: [],
  rateDm2PerL: DEFAULT_RATE_DM2_PER_L,
  rateDraft: EMPTY_RATE_DRAFT,
};

const PaintPlanContext = createContext<PlanState | undefined>(undefined);

// Parcours « Combien de peinture ? » : pièces, rendement et brouillons, gardés en mémoire
export function PaintPlanProvider({children}: {children: ReactNode}) {
  const [data, setData] = useState<PaintPlanData | undefined>(undefined);
  // Dernier état connu : les mises à jour rapides (frappe) ne perdent aucune saisie
  const latest = useRef<PaintPlanData>(INITIAL);

  // Chargement unique ; sans données valides, on démarre à vide
  useEffect(() => {
    let alive = true;
    loadJson(PAINT_PLAN_KEY, isPaintPlanData).then(saved => {
      if (!alive) return;
      latest.current = saved ?? INITIAL;
      setData(latest.current);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Met à jour l'affichage et sauvegarde sans attendre le stockage
  const update = useCallback((patch: (d: PaintPlanData) => PaintPlanData) => {
    const next = patch(latest.current);
    latest.current = next;
    setData(next);
    saveJson(PAINT_PLAN_KEY, next);
  }, []);

  const actions = useMemo<PlanActions>(
    () => ({
      addPiece: piece => update(d => ({...d, pieces: [...d.pieces, piece]})),
      removePiece: index =>
        update(d => ({...d, pieces: d.pieces.filter((_, i) => i !== index)})),
      setCount: (index, count) =>
        update(d => ({
          ...d,
          pieces: d.pieces.map((p, i) => (i === index ? {...p, count} : p)),
        })),
      setRate: rateDm2PerL => update(d => ({...d, rateDm2PerL})),
      setShapeDraft: shapeDraft => update(d => ({...d, shapeDraft})),
      clearShapeDraft: () => update(d => ({...d, shapeDraft: undefined})),
      setKnownDraft: knownDraft => update(d => ({...d, knownDraft})),
      clearKnownDraft: () => update(d => ({...d, knownDraft: undefined})),
      setRateDraft: rateDraft => update(d => ({...d, rateDraft})),
      reset: () => {
        latest.current = INITIAL;
        setData(INITIAL);
        removeKey(PAINT_PLAN_KEY);
      },
    }),
    [update],
  );

  const value = useMemo(() => (data ? {...data, ...actions} : undefined), [data, actions]);

  // Rien n'est affiché tant que l'état sauvegardé n'est pas chargé
  if (!value) return null;
  return <PaintPlanContext.Provider value={value}>{children}</PaintPlanContext.Provider>;
}

export function usePaintPlan(): PlanState {
  const ctx = useContext(PaintPlanContext);
  if (!ctx) {
    throw new Error('usePaintPlan doit être utilisé dans PaintPlanProvider');
  }
  return ctx;
}
