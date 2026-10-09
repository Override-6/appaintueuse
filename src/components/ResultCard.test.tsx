import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {NavigationContext} from '@react-navigation/native';
import '@/i18n';
import {ResultCard} from './ResultCard';

async function mount(element: React.ReactElement) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    tree = ReactTestRenderer.create(element);
  });
  return tree;
}

const withNavigation = (navigate: jest.Mock, child: React.ReactElement) => (
  <NavigationContext.Provider value={{navigate} as never}>{child}</NavigationContext.Provider>
);

describe('ResultCard : icône calculatrice', () => {
  test('envoie le nombre à la calculatrice', async () => {
    const navigate = jest.fn();
    const tree = await mount(withNavigation(navigate, <ResultCard label="Surface" value={314.16} />));
    const button = tree.root.findByProps({accessibilityLabel: 'Ouvrir dans la calculatrice'});
    await act(async () => {
      button.props.onPress();
    });
    expect(navigate).toHaveBeenCalledWith('Calculator', {initial: '314,16', nonce: expect.any(Number)});
  });

  test("pas d'icône quand le résultat n'est pas un nombre", async () => {
    const tree = await mount(withNavigation(jest.fn(), <ResultCard label="Surface" value={undefined} />));
    expect(tree.root.findAllByProps({accessibilityLabel: 'Ouvrir dans la calculatrice'})).toHaveLength(0);
  });

  test("pas d'icône hors navigation", async () => {
    const tree = await mount(<ResultCard label="Surface" value={5} />);
    expect(tree.root.findAllByProps({accessibilityLabel: 'Ouvrir dans la calculatrice'})).toHaveLength(0);
  });
});
