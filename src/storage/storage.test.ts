import {createAsyncStorage} from '@react-native-async-storage/async-storage';
import {clearAllMockStorages} from '@react-native-async-storage/async-storage/jest';
import {loadJson, removeKey, saveJson} from './storage';

const isNumberPair = (v: unknown): v is [number, number] =>
  Array.isArray(v) && v.length === 2 && v.every(n => typeof n === 'number');

const isAnything = (v: unknown): v is unknown => v !== undefined;

const KEY = 'test.key';
const raw = () => createAsyncStorage('appaintueuse');

beforeEach(() => {
  clearAllMockStorages();
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('écriture et lecture', () => {
  test('une valeur enregistrée se relit à l\'identique', async () => {
    await saveJson(KEY, {a: 1, b: [2, 3]});
    expect(await loadJson(KEY, isAnything)).toEqual({a: 1, b: [2, 3]});
  });

  test('une clé absente donne undefined, sans avertissement', async () => {
    expect(await loadJson(KEY, isNumberPair)).toBeUndefined();
    expect(console.warn).not.toHaveBeenCalled();
  });

  test('une valeur qui respecte le type guard est renvoyée', async () => {
    await saveJson(KEY, [1, 2]);
    expect(await loadJson(KEY, isNumberPair)).toEqual([1, 2]);
  });
});

describe('données corrompues ou invalides', () => {
  test('JSON illisible : undefined, sans planter', async () => {
    await raw().setItem(KEY, '{pas du json');
    expect(await loadJson(KEY, isNumberPair)).toBeUndefined();
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  test('valeur qui ne respecte pas le type guard : undefined', async () => {
    await saveJson(KEY, ['a', 'b']);
    expect(await loadJson(KEY, isNumberPair)).toBeUndefined();
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  test('erreur du stockage à la lecture : undefined, sans planter', async () => {
    jest.spyOn(raw(), 'getItem').mockRejectedValueOnce(new Error('disque plein'));
    expect(await loadJson(KEY, isNumberPair)).toBeUndefined();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('disque plein'));
  });
});

describe('écriture en erreur', () => {
  test('saveJson avale l\'erreur du stockage et la journalise', async () => {
    jest.spyOn(raw(), 'setItem').mockRejectedValueOnce(new Error('refusé'));
    await expect(saveJson(KEY, 1)).resolves.toBeUndefined();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('refusé'));
  });
});

describe('suppression', () => {
  test('removeKey efface la clé', async () => {
    await saveJson(KEY, [1, 2]);
    await removeKey(KEY);
    expect(await loadJson(KEY, isNumberPair)).toBeUndefined();
    expect(await raw().getItem(KEY)).toBeNull();
  });

  test('removeKey avale l\'erreur du stockage', async () => {
    jest.spyOn(raw(), 'removeItem').mockRejectedValueOnce(new Error('verrouillé'));
    await expect(removeKey(KEY)).resolves.toBeUndefined();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('verrouillé'));
  });
});
