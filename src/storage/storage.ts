import {createAsyncStorage} from '@react-native-async-storage/async-storage';

const DB_NAME = 'appaintueuse';

// Résolu à chaque appel : bon marché côté natif, et compatible avec le mock de test
const store = () => createAsyncStorage(DB_NAME);

// Journal sobre : une ligne par échec, sans faire planter l'app
function warn(action: string, key: string, error: unknown) {
  const reason = error instanceof Error ? error.message : String(error);
  console.warn(`[storage] ${action} « ${key} » a échoué : ${reason}`);
}

// Lit une valeur JSON ; undefined si absente, illisible ou refusée par isValid
export async function loadJson<T>(
  key: string,
  isValid: (value: unknown) => value is T,
): Promise<T | undefined> {
  try {
    const raw = await store().getItem(key);
    if (raw === null) return undefined;
    const value: unknown = JSON.parse(raw);
    if (isValid(value)) return value;
    warn('lecture', key, 'valeur invalide');
    return undefined;
  } catch (error) {
    warn('lecture', key, error);
    return undefined;
  }
}

// Écrit une valeur en JSON ; les erreurs sont journalisées, jamais propagées
export async function saveJson(key: string, value: unknown): Promise<void> {
  try {
    await store().setItem(key, JSON.stringify(value));
  } catch (error) {
    warn('écriture', key, error);
  }
}

// Supprime une clé ; les erreurs sont journalisées, jamais propagées
export async function removeKey(key: string): Promise<void> {
  try {
    await store().removeItem(key);
  } catch (error) {
    warn('suppression', key, error);
  }
}
