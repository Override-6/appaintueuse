import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import '@/i18n';
import type {RootTabScreenProps} from '@/navigation/types';
import {CalculatorScreen} from './CalculatorScreen';

type Params = {initial?: string; nonce?: number} | undefined;

function screen(params: Params) {
  const props = {route: {params}, navigation: {}} as unknown as RootTabScreenProps<'Calculator'>;
  return <CalculatorScreen {...props} />;
}

const expressionOf = (tree: ReactTestRenderer.ReactTestRenderer) =>
  tree.root.findByProps({accessibilityLabel: 'Expression'}).props.value;

describe('CalculatorScreen : nombre reçu d’un autre écran', () => {
  test('affiche le nombre envoyé, puis le remplace par le suivant', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(screen(undefined));
    });
    expect(expressionOf(tree)).toBe('');

    await act(async () => {
      tree.update(screen({initial: '314,16', nonce: 1}));
    });
    expect(expressionOf(tree)).toBe('314,16');

    // Même nombre renvoyé plus tard (nonce différent) : pris en compte à nouveau
    await act(async () => {
      tree.update(screen({initial: '12', nonce: 2}));
    });
    expect(expressionOf(tree)).toBe('12');
  });
});

describe('CalculatorScreen : curseur', () => {
  test("redonne le focus au champ à chaque retour sur l'onglet", async () => {
    let onFocusEvent: () => void = () => {};
    const navigation = {
      addListener: (_event: string, cb: () => void) => {
        onFocusEvent = cb;
        return () => {};
      },
    };
    const props = {route: {params: undefined}, navigation} as unknown as RootTabScreenProps<'Calculator'>;
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<CalculatorScreen {...props} />);
    });
    // Le champ de saisie : TextInput simulé par Jest, dont `focus` est un espion
    const input = tree.root.findByProps({accessibilityLabel: 'Expression'}).instance;
    input.focus.mockClear();
    await act(async () => {
      onFocusEvent();
    });
    expect(input.focus).toHaveBeenCalledTimes(1);
    await act(async () => {
      tree.unmount();
    });
  });
});
