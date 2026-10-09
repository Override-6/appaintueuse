// Outils de test partagés des écrans du parcours (pas un fichier de test)
import React, {type ComponentType, type ReactElement} from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {clearAllMockStorages} from '@react-native-async-storage/async-storage/jest';
import {Button, NumField} from '@/components';
import {PracticeProvider} from '@/features/learning';
import {
  PaintPlanProvider,
  usePaintPlan,
  type PlanState,
} from '@/features/paint/context/PaintPlanContext';

export type AnyScreen = ComponentType<Record<string, unknown>>;
export type Tree = ReactTestRenderer.ReactTestRenderer;

// Dernier état vu par la sonde : l'écran et le test partagent le même contexte
let current: PlanState | undefined;
export const plan = () => current;

function Probe() {
  current = usePaintPlan();
  return null;
}

export const navigation = () => ({
  navigate: jest.fn(),
  push: jest.fn(),
  popTo: jest.fn(),
  goBack: jest.fn(),
});

// Monte un élément dans le provider et attend le chargement
export async function render(element: ReactElement): Promise<Tree> {
  let tree!: Tree;
  await act(async () => {
    tree = ReactTestRenderer.create(
      <PracticeProvider>
        <PaintPlanProvider>
          <Probe />
          {element}
        </PaintPlanProvider>
      </PracticeProvider>,
    );
  });
  await act(async () => {});
  return tree;
}

export async function unmount(tree: Tree) {
  await act(async () => {
    tree.unmount();
  });
  current = undefined;
}

// Écrit des brouillons comme le ferait l'utilisateur, puis quitte l'écran
export async function seed(action: (p: PlanState) => void) {
  const tree = await render(<></>);
  await act(async () => {
    action(current!);
  });
  await act(async () => {});
  await unmount(tree);
}

export const fields = (tree: Tree) => tree.root.findAll(n => n.type === NumField);

export const buttonNamed = (tree: Tree, label: string) =>
  tree.root.findAll(n => n.type === Button && n.props.label === label)[0];

export const text = (tree: Tree) => JSON.stringify(tree.toJSON());

export function resetHarness() {
  clearAllMockStorages();
  current = undefined;
}
