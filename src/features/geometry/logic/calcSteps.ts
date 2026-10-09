import {formatNumber} from '@/utils/format';
import type {Dims} from './dims';

// Une étape pédagogique : clé de traduction + nombres déjà mis en forme
export type Step = {key: string; params?: Record<string, string | number>};

// Résultat d'un calcul avec ses étapes (chaque opération est petite)
export type Calc = {steps: Step[]; value: number};

// Partie peignable : identifiant et calcul de son aire (dans l'unité saisie)
export type PartDef = {id: string; calc: (d: Dims) => Calc};

const f = (n: number) => formatNumber(n);

const op = (key: string, params: Record<string, string>, value: number): Calc => ({
  steps: [{key, params}],
  value,
});

export const mul = (a: number, b: number): Calc =>
  op('geometry.calc.mul', {a: f(a), b: f(b), result: f(a * b)}, a * b);

export const div = (a: number, b: number): Calc =>
  op('geometry.calc.div', {a: f(a), b: f(b), result: f(a / b)}, a / b);

export const add = (a: number, b: number): Calc =>
  op('geometry.calc.add', {a: f(a), b: f(b), result: f(a + b)}, a + b);

export const sub = (a: number, b: number): Calc =>
  op('geometry.calc.sub', {a: f(a), b: f(b), result: f(a - b)}, a - b);

export const pi = (a: number): Calc =>
  op('geometry.calc.pi', {a: f(a), result: f(Math.PI * a)}, Math.PI * a);

export const sqrt = (a: number): Calc =>
  op('geometry.calc.sqrt', {a: f(a), result: f(Math.sqrt(a))}, Math.sqrt(a));

// Enchaîne des calculs : les étapes s'accumulent, la valeur est la dernière
export function chain(...calcs: Calc[]): Calc {
  return {
    steps: calcs.flatMap(c => c.steps),
    value: calcs[calcs.length - 1].value,
  };
}
