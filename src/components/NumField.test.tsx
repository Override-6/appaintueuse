import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {NumField, toggleSign} from './NumField';

async function mount(element: React.ReactElement) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    tree = ReactTestRenderer.create(element);
  });
  return tree;
}

describe('NumField : bouton ±', () => {
  test("absent par défaut (valeurs positives)", async () => {
    const tree = await mount(<NumField label="Surface" value="5" onChange={() => {}} />);
    expect(tree.root.findAllByProps({accessibilityLabel: '±'})).toHaveLength(0);
  });

  test('présent pour une valeur signée, et change le signe', async () => {
    const onChange = jest.fn();
    const tree = await mount(<NumField label="Température" value="5" onChange={onChange} signed />);
    await act(async () => {
      tree.root.findByProps({accessibilityLabel: '±'}).props.onPress();
    });
    expect(onChange).toHaveBeenCalledWith('-5');
  });
});

describe('toggleSign', () => {
  test('bascule le signe', () => {
    expect(toggleSign('5')).toBe('-5');
    expect(toggleSign('-5')).toBe('5');
    expect(toggleSign('')).toBe('-');
  });
});
