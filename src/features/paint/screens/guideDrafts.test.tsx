import '@/i18n';
import {act} from 'react-test-renderer';
import {ShapeTile} from '@/features/paint/components/ShapeTile';
import {
  GuideDimensionsScreen,
  GuideKnownSurfaceScreen,
  GuideShapeScreen,
} from '@/features/paint/screens';
import {
  buttonNamed,
  fields,
  navigation,
  plan,
  render,
  resetHarness,
  seed,
  text,
  unmount,
  type AnyScreen,
} from './draftHarness';

const KnownScreen = GuideKnownSurfaceScreen as AnyScreen;
const ShapeScreen = GuideShapeScreen as AnyScreen;
const DimensionsScreen = GuideDimensionsScreen as AnyScreen;

beforeEach(resetHarness);

describe('surface connue', () => {
  test('l\'unité par défaut est le dm² : 350 vaut 350 dm²', async () => {
    const tree = await render(<KnownScreen navigation={navigation()} route={undefined} />);
    await act(async () => {
      fields(tree)[0].props.onChange('350');
    });
    expect(plan()!.knownDraft).toEqual({value: '350', unit: 'dm2', count: '1'});
    expect(text(tree)).toContain('= 350 dm²');
    await unmount(tree);
  });

  test('le brouillon en cours est repris à l\'ouverture de l\'écran', async () => {
    await seed(p => p.setKnownDraft({value: '12', unit: 'm2', count: '3'}));
    const tree = await render(<KnownScreen navigation={navigation()} route={undefined} />);
    expect(fields(tree)[0].props.value).toBe('12');
    expect(fields(tree)[1].props.value).toBe('3');
    await unmount(tree);
  });

  test('« Ajouter cette pièce » ajoute la pièce et efface le brouillon', async () => {
    await seed(p => p.setKnownDraft({value: '2', unit: 'm2', count: '1'}));
    const nav = navigation();
    const tree = await render(<KnownScreen navigation={nav} route={undefined} />);
    await act(async () => {
      buttonNamed(tree, 'Ajouter cette pièce').props.onPress();
    });
    expect(plan()!.pieces).toEqual([{areaDm2: 200, count: 1}]);
    expect(plan()!.knownDraft).toBeUndefined();
    expect(nav.popTo).toHaveBeenCalledWith('GuideSurface');
    await unmount(tree);
  });
});

describe('choix de la forme', () => {
  test("ouvrir une autre forme ne perd PAS le brouillon en cours", async () => {
    const draft = {shapeId: 'square' as const, vals: {side: '4'}, unit: 'cm' as const, parts: ['face'], count: '2'};
    await seed(p => p.setShapeDraft(draft));
    const nav = navigation();
    const tree = await render(<ShapeScreen navigation={nav} route={undefined} />);
    await act(async () => {
      tree.root.findAll(n => n.type === ShapeTile && n.props.shapeId === 'circle')[0].props.onPress();
    });
    // Retour sans rien saisir : le carré à moitié rempli est toujours là
    expect(plan()!.shapeDraft).toEqual(draft);
    expect(nav.push).toHaveBeenCalledWith('GuideDimensions', {shapeId: 'circle'});
    await unmount(tree);
  });

  test('saisir une mesure dans une autre forme remplace alors le brouillon', async () => {
    await seed(p => p.setShapeDraft({shapeId: 'square', vals: {side: '4'}, unit: 'cm', parts: ['face'], count: '2'}));
    const tree = await render(
      <DimensionsScreen navigation={navigation()} route={{params: {shapeId: 'circle'}}} />,
    );
    await act(async () => {
      fields(tree)[0].props.onChange('6');
    });
    expect(plan()!.shapeDraft).toMatchObject({shapeId: 'circle', vals: {radius: '6'}, unit: 'cm', count: '1'});
    await unmount(tree);
  });

  test('la même forme garde son brouillon', async () => {
    const draft = {shapeId: 'square' as const, vals: {side: '4'}, unit: 'cm' as const, parts: ['face'], count: '2'};
    await seed(p => p.setShapeDraft(draft));
    const tree = await render(<ShapeScreen navigation={navigation()} route={undefined} />);
    await act(async () => {
      tree.root.findAll(n => n.type === ShapeTile && n.props.shapeId === 'square')[0].props.onPress();
    });
    expect(plan()!.shapeDraft).toEqual(draft);
    await unmount(tree);
  });
});

describe('mesures d\'une forme', () => {
  test('la même forme est préremplie : mesures, unité, exemplaires', async () => {
    await seed(p => p.setShapeDraft({shapeId: 'square', vals: {side: '4'}, unit: 'cm', parts: ['face'], count: '2'}));
    const tree = await render(
      <DimensionsScreen navigation={navigation()} route={{params: {shapeId: 'square'}}} />,
    );
    expect(fields(tree)[0].props.value).toBe('4');
    expect(fields(tree)[1].props.value).toBe('2');
    await unmount(tree);
  });

  test('une autre forme ne reprend pas les mesures', async () => {
    await seed(p => p.setShapeDraft({shapeId: 'square', vals: {side: '4'}, unit: 'dm', parts: ['face'], count: '1'}));
    const tree = await render(
      <DimensionsScreen navigation={navigation()} route={{params: {shapeId: 'circle'}}} />,
    );
    expect(fields(tree)[0].props.value).toBe('');
    await unmount(tree);
  });

  test('« Ajouter cette pièce » ajoute la pièce et efface le brouillon', async () => {
    await seed(p => p.setShapeDraft({shapeId: 'square', vals: {side: '10'}, unit: 'dm', parts: ['face'], count: '1'}));
    const nav = navigation();
    const tree = await render(
      <DimensionsScreen navigation={nav} route={{params: {shapeId: 'square'}}} />,
    );
    await act(async () => {
      buttonNamed(tree, 'Ajouter cette pièce').props.onPress();
    });
    expect(plan()!.pieces).toHaveLength(1);
    expect(plan()!.shapeDraft).toBeUndefined();
    expect(nav.popTo).toHaveBeenCalledWith('GuideSurface');
    await unmount(tree);
  });
});
