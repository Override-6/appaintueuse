import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {createAsyncStorage} from '@react-native-async-storage/async-storage';
import {clearAllMockStorages} from '@react-native-async-storage/async-storage/jest';
import {PAINT_PLAN_KEY, EMPTY_RATE_DRAFT, DEFAULT_RATE_DM2_PER_L} from '../logic/persist';
import {PaintPlanProvider, usePaintPlan, type PlanState} from './PaintPlanContext';

// Dernier état vu par la sonde : permet d'agir comme un écran le ferait
let plan: PlanState | undefined;
function Probe() {
  plan = usePaintPlan();
  return null;
}

const raw = () => createAsyncStorage('appaintueuse');

// Monte le provider puis laisse le chargement se terminer
async function mount() {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    tree = ReactTestRenderer.create(
      <PaintPlanProvider>
        <Probe />
      </PaintPlanProvider>,
    );
  });
  await act(async () => {});
  return tree;
}

// Démonte (l'app est fermée ou on quitte l'écran) en laissant les écritures finir
async function unmount(tree: ReactTestRenderer.ReactTestRenderer) {
  await act(async () => {});
  await act(async () => {
    tree.unmount();
  });
  plan = undefined;
}

// Exécute une action du contexte puis laisse la sauvegarde se terminer
async function run(action: (p: PlanState) => void) {
  await act(async () => {
    action(plan!);
  });
  await act(async () => {});
}

beforeEach(() => {
  clearAllMockStorages();
  plan = undefined;
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('chargement', () => {
  test('n\'affiche rien tant que l\'état sauvegardé n\'est pas chargé', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <PaintPlanProvider>
          <Probe />
        </PaintPlanProvider>,
      );
    });
    expect(plan).toBeUndefined();
    await act(async () => {});
    expect(plan).toBeDefined();
    await unmount(tree);
  });

  test('sans stockage, démarre à vide avec le rendement par défaut', async () => {
    const tree = await mount();
    expect(plan!.pieces).toEqual([]);
    expect(plan!.rateDm2PerL).toBe(DEFAULT_RATE_DM2_PER_L);
    expect(plan!.shapeDraft).toBeUndefined();
    expect(plan!.knownDraft).toBeUndefined();
    expect(plan!.rateDraft).toEqual(EMPTY_RATE_DRAFT);
    await unmount(tree);
  });
});

describe('persistance entre deux montages', () => {
  test('une pièce ajoutée et le rendement sont revenus après un démontage', async () => {
    const first = await mount();
    await run(p => p.addPiece({areaDm2: 12, count: 2}));
    await run(p => p.setRate(50));
    await unmount(first);

    const second = await mount();
    expect(plan!.pieces).toEqual([{areaDm2: 12, count: 2}]);
    expect(plan!.rateDm2PerL).toBe(50);
    await unmount(second);
  });

  test('les exemplaires modifiés et les pièces retirées sont mémorisés', async () => {
    const first = await mount();
    await run(p => p.addPiece({areaDm2: 4, count: 1}));
    await run(p => p.addPiece({areaDm2: 9, count: 1}));
    await run(p => p.setCount(0, 3));
    await run(p => p.removePiece(1));
    await unmount(first);

    const second = await mount();
    expect(plan!.pieces).toEqual([{areaDm2: 4, count: 3}]);
    await unmount(second);
  });

  test('le brouillon de forme est restauré tel quel', async () => {
    const draft = {
      shapeId: 'cylinder' as const,
      vals: {radius: '2', height: '5'},
      unit: 'cm' as const,
      parts: ['side'],
      count: '2',
    };
    const first = await mount();
    await run(p => p.setShapeDraft(draft));
    await unmount(first);

    const second = await mount();
    expect(plan!.shapeDraft).toEqual(draft);
    await unmount(second);
  });

  test('le brouillon de surface connue et le formulaire de rendement sont restaurés', async () => {
    const known = {value: '350', unit: 'dm2' as const, count: '1'};
    const rate = {...EMPTY_RATE_DRAFT, mode: 'ml' as const, ml: '500', mlArea: '3', mlUnit: 'm2' as const};
    const first = await mount();
    await run(p => p.setKnownDraft(known));
    await run(p => p.setRateDraft(rate));
    await unmount(first);

    const second = await mount();
    expect(plan!.knownDraft).toEqual(known);
    expect(plan!.rateDraft).toEqual(rate);
    await unmount(second);
  });

  test('effacer un brouillon le retire du stockage', async () => {
    const first = await mount();
    await run(p => p.setKnownDraft({value: '3', unit: 'dm2', count: '1'}));
    await run(p => p.clearKnownDraft());
    await unmount(first);

    const second = await mount();
    expect(plan!.knownDraft).toBeUndefined();
    await unmount(second);
  });
});

describe('Recommencer', () => {
  test('reset efface l\'état, les brouillons et le stockage', async () => {
    const first = await mount();
    await run(p => p.addPiece({areaDm2: 12, count: 1}));
    await run(p => p.setRate(40));
    await run(p => p.setShapeDraft({shapeId: 'square', vals: {side: '4'}, unit: 'dm', parts: ['face'], count: '1'}));
    await run(p => p.reset());

    expect(plan!.pieces).toEqual([]);
    expect(plan!.rateDm2PerL).toBe(DEFAULT_RATE_DM2_PER_L);
    expect(plan!.shapeDraft).toBeUndefined();
    expect(await raw().getItem(PAINT_PLAN_KEY)).toBeNull();
    await unmount(first);

    const second = await mount();
    expect(plan!.pieces).toEqual([]);
    expect(plan!.shapeDraft).toBeUndefined();
    await unmount(second);
  });
});

describe('données corrompues', () => {
  test('JSON illisible : démarrage propre, puis utilisable', async () => {
    await raw().setItem(PAINT_PLAN_KEY, '{pas du json');
    const tree = await mount();
    expect(plan!.pieces).toEqual([]);
    await run(p => p.addPiece({areaDm2: 6, count: 1}));
    expect(plan!.pieces).toEqual([{areaDm2: 6, count: 1}]);
    await unmount(tree);
  });

  test('forme invalide : démarrage propre', async () => {
    await raw().setItem(PAINT_PLAN_KEY, JSON.stringify({pieces: 'n\'importe quoi', rateDm2PerL: 3}));
    const tree = await mount();
    expect(plan!.pieces).toEqual([]);
    expect(plan!.rateDm2PerL).toBe(DEFAULT_RATE_DM2_PER_L);
    await unmount(tree);
  });

  test('un stockage qui refuse la lecture ne fait pas planter l\'écran', async () => {
    jest.spyOn(raw(), 'getItem').mockRejectedValueOnce(new Error('illisible'));
    const tree = await mount();
    expect(plan!.pieces).toEqual([]);
    await unmount(tree);
  });
});
