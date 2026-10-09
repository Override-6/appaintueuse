import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {ShapeDiagram} from './ShapeDiagram';

async function render(element: React.ReactElement): Promise<string> {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    tree = ReactTestRenderer.create(element);
  });
  const json = JSON.stringify(tree.toJSON());
  await act(async () => {
    tree.unmount();
  });
  return json;
}

describe('ShapeDiagram', () => {
  test('écrit les valeurs saisies avec leur unité sous les lettres', async () => {
    const json = await render(
      <ShapeDiagram shapeId="cylinder" values={{radius: '5', height: '12,5'}} unit="dm" />,
    );
    expect(json).toContain('5 dm');
    expect(json).toContain('12,5 dm');
  });

  test("n'écrit rien tant que les champs sont vides", async () => {
    const json = await render(
      <ShapeDiagram shapeId="cylinder" values={{radius: ' ', height: ''}} unit="dm" />,
    );
    expect(json).not.toContain(' dm');
  });
});

describe('ShapeDiagram : aires dans les faces', () => {
  test("écrit l'aire de chaque face, arrondie à 2 décimales", async () => {
    const json = await render(<ShapeDiagram shapeId="circle" values={{radius: '5'}} unit="dm" />);
    expect(json).toContain('78,54 dm²');
  });

  test('peut masquer les aires (mode essai) tout en gardant les mesures', async () => {
    const json = await render(
      <ShapeDiagram shapeId="circle" values={{radius: '5'}} unit="dm" showAreas={false} />,
    );
    expect(json).not.toContain('78,54');
    expect(json).toContain('5 dm');
  });
});

describe('ShapeDiagram : unité choisie', () => {
  test('les aires sont écrites en cm² quand on mesure en cm', async () => {
    const json = await render(<ShapeDiagram shapeId="circle" values={{radius: '5'}} unit="cm" />);
    expect(json).toContain('78,54 cm²');
    expect(json).toContain('5 cm');
    expect(json).not.toContain('dm²');
  });

  test('par défaut le schéma est en cm', async () => {
    const json = await render(<ShapeDiagram shapeId="circle" values={{radius: '5'}} />);
    expect(json).toContain('78,54 cm²');
  });
});
