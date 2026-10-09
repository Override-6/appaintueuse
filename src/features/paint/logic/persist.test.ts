import {
  DEFAULT_RATE_DM2_PER_L,
  EMPTY_RATE_DRAFT,
  blankKnownDraft,
  blankShapeDraft,
  isKnownDraftFilled,
  isPaintPlanData,
  isShapeDraftFilled,
  type PaintPlanData,
} from './persist';

// Données complètes et valides, à modifier champ par champ dans chaque test
const valid = (): PaintPlanData => ({
  pieces: [
    {areaDm2: 120, count: 2, shapeId: 'cube', dims: {edge: 10}, unit: 'dm', selectedParts: ['face']},
    {areaDm2: 5, count: 1},
  ],
  rateDm2PerL: 70,
  shapeDraft: {shapeId: 'circle', vals: {radius: '3'}, unit: 'dm', parts: ['face'], count: '1'},
  knownDraft: {value: '350', unit: 'dm2', count: '2'},
  rateDraft: EMPTY_RATE_DRAFT,
});

describe('isPaintPlanData', () => {
  test('accepte des données valides, avec ou sans brouillons', () => {
    expect(isPaintPlanData(valid())).toBe(true);
    expect(isPaintPlanData({...valid(), shapeDraft: undefined, knownDraft: undefined})).toBe(true);
  });

  test('accepte les données telles qu\'elles sortent du JSON', () => {
    const state = {...valid(), knownDraft: undefined};
    expect(isPaintPlanData(JSON.parse(JSON.stringify(state)))).toBe(true);
  });

  test.each([
    ['rien', null],
    ['une chaîne', 'bonjour'],
    ['un tableau', []],
  ])('refuse %s', (_label, value) => {
    expect(isPaintPlanData(value)).toBe(false);
  });

  test('refuse un rendement absent ou nul', () => {
    expect(isPaintPlanData({...valid(), rateDm2PerL: 0})).toBe(false);
    expect(isPaintPlanData({...valid(), rateDm2PerL: '70'})).toBe(false);
  });

  test('refuse une pièce mal formée', () => {
    expect(isPaintPlanData({...valid(), pieces: [{areaDm2: 5, count: 0}]})).toBe(false);
    expect(isPaintPlanData({...valid(), pieces: [{areaDm2: 5, count: 1.5}]})).toBe(false);
    expect(isPaintPlanData({...valid(), pieces: [{areaDm2: -1, count: 1}]})).toBe(false);
    expect(isPaintPlanData({...valid(), pieces: [{areaDm2: 5, count: 1, shapeId: 'pyramide'}]})).toBe(false);
    expect(isPaintPlanData({...valid(), pieces: [{areaDm2: 5, count: 1, unit: 'km'}]})).toBe(false);
    expect(isPaintPlanData({...valid(), pieces: [{areaDm2: 5, count: 1, dims: {edge: 'dix'}}]})).toBe(false);
    expect(isPaintPlanData({...valid(), pieces: 'pas une liste'})).toBe(false);
  });

  test('refuse un brouillon de forme avec une forme inconnue ou des champs invalides', () => {
    const bad = {...valid().shapeDraft, shapeId: 'inconnue'};
    expect(isPaintPlanData({...valid(), shapeDraft: bad})).toBe(false);
    expect(isPaintPlanData({...valid(), shapeDraft: {...valid().shapeDraft, unit: 'km'}})).toBe(false);
    expect(isPaintPlanData({...valid(), shapeDraft: {...valid().shapeDraft, vals: {r: 3}}})).toBe(false);
    expect(isPaintPlanData({...valid(), shapeDraft: {...valid().shapeDraft, count: 1}})).toBe(false);
  });

  test('refuse un brouillon de surface connue avec une unité inconnue', () => {
    expect(isPaintPlanData({...valid(), knownDraft: {value: '3', unit: 'ha', count: '1'}})).toBe(false);
  });

  test('refuse un brouillon de rendement incomplet', () => {
    expect(isPaintPlanData({...valid(), rateDraft: undefined})).toBe(false);
    expect(isPaintPlanData({...valid(), rateDraft: {...EMPTY_RATE_DRAFT, mode: 'litres'}})).toBe(false);
    expect(isPaintPlanData({...valid(), rateDraft: {...EMPTY_RATE_DRAFT, mlUnit: 'cm2'}})).toBe(false);
  });
});

describe('brouillons vierges', () => {
  test('une forme vierge coche toutes ses faces, en cm, avec 1 exemplaire', () => {
    const draft = blankShapeDraft('cube');
    expect(draft).toMatchObject({shapeId: 'cube', vals: {}, unit: 'cm', count: '1'});
    expect(draft.parts.length).toBeGreaterThan(0);
  });

  test('une surface connue vierge est en dm²', () => {
    expect(blankKnownDraft()).toEqual({value: '', unit: 'dm2', count: '1'});
  });

  test('le rendement par défaut couvre 7 m² par litre, soit 700 dm²', () => {
    expect(DEFAULT_RATE_DM2_PER_L).toBe(700);
    expect(EMPTY_RATE_DRAFT.area).toBe('7');
  });
});

describe('brouillon non vide', () => {
  test('une forme sans mesure n\'est pas un brouillon en cours', () => {
    expect(isShapeDraftFilled(blankShapeDraft('cube'))).toBe(false);
    expect(isShapeDraftFilled({...blankShapeDraft('cube'), vals: {edge: '  '}})).toBe(false);
    expect(isShapeDraftFilled({...blankShapeDraft('cube'), vals: {edge: '4'}})).toBe(true);
  });

  test('une surface connue sans valeur n\'est pas un brouillon en cours', () => {
    expect(isKnownDraftFilled(blankKnownDraft())).toBe(false);
    expect(isKnownDraftFilled({value: '12', unit: 'dm2', count: '1'})).toBe(true);
  });
});
