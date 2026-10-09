import fs from 'fs';
import path from 'path';
import calculator from './locales/fr/calculator.json';
import common from './locales/fr/common.json';
import conversions from './locales/fr/conversions.json';
import geometry from './locales/fr/geometry.json';
import learning from './locales/fr/learning.json';
import maths from './locales/fr/maths.json';
import mix from './locales/fr/mix.json';
import paint from './locales/fr/paint.json';

const fr: Record<string, unknown> = {
  ...common,
  ...calculator,
  ...maths,
  ...geometry,
  ...conversions,
  ...learning,
  ...paint,
  ...mix,
};

const SRC = path.resolve(__dirname, '..');
const KEY_PATTERN = /\b(?:t|tr)\(\s*'([a-zA-Z][\w.]*)'/g; // clés statiques t('a.b.c')

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(full);
    }
    return /\.tsx?$/.test(entry.name) && !/\.test\./.test(entry.name)
      ? [full]
      : [];
  });
}

const resolve = (key: string): unknown =>
  key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown> | undefined)?.[part],
      fr,
    );

test('chaque clé t(...) du code existe dans les traductions françaises', () => {
  const missing: string[] = [];
  for (const file of sourceFiles(SRC)) {
    const code = fs.readFileSync(file, 'utf8');
    for (const match of code.matchAll(KEY_PATTERN)) {
      if (resolve(match[1]) === undefined) {
        missing.push(`${path.relative(SRC, file)} → ${match[1]}`);
      }
    }
  }
  expect(missing).toEqual([]);
});
