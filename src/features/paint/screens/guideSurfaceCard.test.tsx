import '@/i18n';
import {act} from 'react-test-renderer';
import {GuideSurfaceScreen} from '@/features/paint/screens';
import {
  buttonNamed,
  navigation,
  plan,
  render,
  resetHarness,
  seed,
  text,
  unmount,
  type AnyScreen,
} from './draftHarness';

const SurfaceScreen = GuideSurfaceScreen as AnyScreen;

beforeEach(resetHarness);

describe('carte « Pièce en cours » sur l\'écran pivot', () => {
  test('sans brouillon, pas de carte', async () => {
    const tree = await render(<SurfaceScreen navigation={navigation()} route={undefined} />);
    expect(text(tree)).not.toContain('Pièce en cours');
    await unmount(tree);
  });

  test('un brouillon vide ne donne pas de carte', async () => {
    await seed(p => p.setShapeDraft({shapeId: 'square', vals: {side: ''}, unit: 'dm', parts: ['face'], count: '1'}));
    const tree = await render(<SurfaceScreen navigation={navigation()} route={undefined} />);
    expect(text(tree)).not.toContain('Pièce en cours');
    await unmount(tree);
  });

  test('« Reprendre » ouvre la forme, « Abandonner » efface le brouillon', async () => {
    await seed(p => p.setShapeDraft({shapeId: 'square', vals: {side: '4'}, unit: 'dm', parts: ['face'], count: '1'}));
    const nav = navigation();
    const tree = await render(<SurfaceScreen navigation={nav} route={undefined} />);
    expect(text(tree)).toContain('Pièce en cours');
    expect(text(tree)).toContain('Côté 4 (dm)');

    await act(async () => {
      buttonNamed(tree, 'Reprendre').props.onPress();
    });
    expect(nav.navigate).toHaveBeenCalledWith('GuideDimensions', {shapeId: 'square'});

    await act(async () => {
      buttonNamed(tree, 'Abandonner').props.onPress();
    });
    expect(plan()!.shapeDraft).toBeUndefined();
    expect(text(tree)).not.toContain('Pièce en cours');
    await unmount(tree);
  });

  test('une surface connue en cours a sa carte, qui ouvre l\'écran surface connue', async () => {
    await seed(p => p.setKnownDraft({value: '350', unit: 'dm2', count: '1'}));
    const nav = navigation();
    const tree = await render(<SurfaceScreen navigation={nav} route={undefined} />);
    expect(text(tree)).toContain('Surface saisie : 350 dm²');
    await act(async () => {
      buttonNamed(tree, 'Reprendre').props.onPress();
    });
    expect(nav.navigate).toHaveBeenCalledWith('GuideKnownSurface');
    await unmount(tree);
  });
});
