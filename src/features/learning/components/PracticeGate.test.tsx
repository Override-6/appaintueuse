import React from 'react';
import {Text} from 'react-native';
import ReactTestRenderer, {act} from 'react-test-renderer';
import '@/i18n';
import {PracticeProvider, usePractice} from '../index';
import {PracticeGate} from './PracticeGate';

function Enable({children}: {children: React.ReactNode}) {
  const {setEnabled} = usePractice();
  React.useEffect(() => setEnabled(true), [setEnabled]);
  return <>{children}</>;
}

async function mount() {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    tree = ReactTestRenderer.create(
      <PracticeProvider>
        <Enable>
          <PracticeGate answer={100}>
            <Text>RESULTAT-SECRET</Text>
          </PracticeGate>
        </Enable>
      </PracticeProvider>,
    );
  });
  return tree;
}

const text = (tree: ReactTestRenderer.ReactTestRenderer) => JSON.stringify(tree.toJSON());
const type = async (tree: ReactTestRenderer.ReactTestRenderer, value: string) => {
  const input = tree.root.findAll(n => n.props.value !== undefined && n.props.onChangeText)[0];
  await act(async () => {
    input.props.onChangeText(value);
  });
};
// Texte affiché dans un nœud (ses <Text> descendants)
const textOf = (node: ReactTestRenderer.ReactTestInstance) =>
  node
    .findAllByType(Text)
    .map(t => [t.props.children].flat().join(''))
    .join('');

const press = async (tree: ReactTestRenderer.ReactTestRenderer, label: string) => {
  const button = tree.root.findAll(
    n => n.props.accessibilityRole === 'button' && textOf(n).includes(label),
  )[0];
  await act(async () => {
    button.props.onPress();
  });
};

describe('PracticeGate', () => {
  test('un mauvais essai dit plus ou moins, sans montrer le résultat', async () => {
    const tree = await mount();
    expect(text(tree)).not.toContain('RESULTAT-SECRET');

    await type(tree, '50');
    await press(tree, 'Vérifier');
    expect(text(tree)).toContain("C'est plus que ça");
    expect(text(tree)).not.toContain('RESULTAT-SECRET');

    await type(tree, '150');
    await press(tree, 'Vérifier');
    expect(text(tree)).toContain("C'est moins que ça");
    expect(text(tree)).not.toContain('RESULTAT-SECRET');
  });

  test('la bonne réponse fait apparaître le résultat', async () => {
    const tree = await mount();
    await type(tree, '100');
    await press(tree, 'Vérifier');
    expect(text(tree)).toContain('Bravo');
    expect(text(tree)).toContain('RESULTAT-SECRET');
  });

  test('« Voir la réponse » affiche le résultat', async () => {
    const tree = await mount();
    await press(tree, 'Voir la réponse');
    expect(text(tree)).toContain('RESULTAT-SECRET');
  });
});
