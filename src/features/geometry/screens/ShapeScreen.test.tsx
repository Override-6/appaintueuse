import React from 'react';
import {Text} from 'react-native';
import ReactTestRenderer, {act} from 'react-test-renderer';
import '@/i18n';
import {PracticeProvider} from '@/features/learning';
import type {GeometryScreenProps} from '@/navigation/types';
import {ShapeScreen} from './ShapeScreen';

async function mount(shapeId: string) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  const props = {route: {params: {shapeId}}, navigation: {}} as unknown as GeometryScreenProps<'Shape'>;
  await act(async () => {
    tree = ReactTestRenderer.create(
      <PracticeProvider>
        <ShapeScreen {...props} />
      </PracticeProvider>,
    );
  });
  return tree;
}

const texts = (tree: ReactTestRenderer.ReactTestRenderer) =>
  tree.root
    .findAllByType(Text)
    .map(t => [t.props.children].flat(5).join(''))
    .join(' | ');

const fields = (tree: ReactTestRenderer.ReactTestRenderer) =>
  tree.root.findAll(n => n.props.onChangeText && n.props.keyboardType);

describe('ShapeScreen : tout suit l’unité choisie', () => {
  test('cm par défaut : champs, résultat et schéma en cm / cm²', async () => {
    const tree = await mount('circle');
    await act(async () => {
      fields(tree)[0].props.onChangeText('5');
    });
    const all = texts(tree);
    expect(all).toContain(' cm²'); // résultat en cm²
    expect(all).not.toContain('dm²');
    // L'aire est aussi écrite sur le schéma (éléments SVG, hors <Text>)
    expect(JSON.stringify(tree.toJSON())).toContain('78,54 cm²');
  });
});
