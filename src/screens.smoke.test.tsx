import React, {ComponentType, ReactElement} from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {clearAllMockStorages} from '@react-native-async-storage/async-storage/jest';
import './i18n';
import {CalculatorScreen} from '@/features/calculator/screens';
import {ConversionsScreen} from '@/features/conversions/screens';
import * as geometry from '@/features/geometry/screens';
import {SURFACE_SHAPES} from '@/features/geometry';
import {PracticeProvider} from '@/features/learning';
import * as maths from '@/features/maths/screens';
import {PaintPlanProvider} from '@/features/paint/context/PaintPlanContext';
import * as paint from '@/features/paint/screens';

// Tests de fumée : chaque écran se monte sans planter (props de navigation factices)
type AnyScreen = ComponentType<Record<string, unknown>>;
const navigation = {navigate: jest.fn(), goBack: jest.fn()};

beforeEach(() => {
  clearAllMockStorages();
});

async function mount(element: ReactElement) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    tree = ReactTestRenderer.create(
      <PracticeProvider>
        <PaintPlanProvider>{element}</PaintPlanProvider>
      </PracticeProvider>,
    );
  });
  // Le provider charge l'état sauvegardé avant d'afficher ses enfants
  await act(async () => {});
  const json = JSON.stringify(tree.toJSON());
  await act(async () => {
    tree.unmount();
  });
  return json;
}

const screens: [string, AnyScreen, Record<string, unknown>][] = [
  ['Calculatrice', CalculatorScreen as AnyScreen, {}],
  ['Conversions', ConversionsScreen as AnyScreen, {}],
  ...Object.entries({...maths, ...paint, ...geometry})
    .filter(([name]) => name !== 'ShapeScreen')
    .map(
      ([name, comp]) =>
        [
          name,
          comp as AnyScreen,
          // Les écrans du parcours qui reçoivent la forme choisie en paramètre
          name === 'GuideDimensionsScreen'
            ? {route: {params: {shapeId: 'cylinder'}}}
            : {},
        ] as [string, AnyScreen, Record<string, unknown>],
    ),
  ...SURFACE_SHAPES.map(
    s =>
      [`ShapeScreen:${s.id}`, geometry.ShapeScreen as AnyScreen, {route: {params: {shapeId: s.id}}}] as [
        string,
        AnyScreen,
        Record<string, unknown>,
      ],
  ),
];

describe('écrans', () => {
  test.each(screens)('%s se monte', async (_name, Screen, extra) => {
    const json = await mount(<Screen navigation={navigation} route={{params: undefined}} {...extra} />);
    expect(json).not.toContain('undefined');
    expect(json.length).toBeGreaterThan(10);
  });
});
