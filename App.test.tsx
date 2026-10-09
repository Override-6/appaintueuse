import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import App from './App';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

// Test de fumée : l'app démarre et l'onglet d'accueil (Calculatrice) s'affiche
test("l'app se monte sans erreur", async () => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    tree = ReactTestRenderer.create(<App />);
  });
  await act(async () => {
    jest.runOnlyPendingTimers();
  });
  expect(JSON.stringify(tree.toJSON())).toContain('Calcul');
  await act(async () => {
    tree.unmount();
  });
});
