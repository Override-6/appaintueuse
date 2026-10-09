import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FuncId,
  HistoryItem,
  MAX_HISTORY,
  MAX_LEN,
  Sel,
} from '@/features/calculator/constants';
import { evaluate, fromFraction } from '@/features/calculator/logic/calc';
import { show, toInput } from '@/features/calculator/logic/format';

// `incoming` : nombre envoyé par un autre écran (icône calculatrice d'un résultat)
export type IncomingValue = { initial?: string; nonce?: number };

export function useCalculator(incoming?: IncomingValue) {
  const { t } = useTranslation();
  const [expr, setExpr] = useState('');
  // Position du curseur (ou de la sélection) dans l'expression
  const [sel, setSel] = useState<Sel>({ start: 0, end: 0 });
  const [echo, setEcho] = useState<string | null>(null); // "2+3 =" après un calcul
  const [fresh, setFresh] = useState(false); // le résultat vient d'être calculé
  const [error, setError] = useState(false);
  const [fracView, setFracView] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const value = evaluate(expr);
  const big =
    expr === '' && !error
      ? '0'
      : value !== null
      ? show(value, fracView)
      : error
      ? t('calculator.error')
      : '?';

  // Remplace tout le texte et place le curseur
  const setAll = (text: string, pos: number = text.length) => {
    setExpr(text);
    setSel({ start: pos, end: pos });
  };

  // Un nombre arrive d'un autre écran : il remplace l'expression comme un résultat
  // (taper un opérateur continue le calcul avec ce nombre)
  useEffect(() => {
    if (incoming?.initial !== undefined) {
      setAll(incoming.initial);
      setEcho(null);
      setError(false);
      setFresh(true);
    }
    // `nonce` change à chaque envoi, même si le nombre est le même
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incoming?.nonce]);

  // Insère à la position du curseur (remplace la sélection)
  const insert = (tok: string, cursorOffset: number = tok.length) => {
    // Juste après « = » : une nouvelle valeur repart de zéro, un opérateur continue le résultat
    const startsValue = /^[\d,π(√]/.test(tok);
    const base = fresh && startsValue ? '' : expr;
    const s0 = fresh ? (startsValue ? 0 : base.length) : sel.start;
    const e0 = fresh ? s0 : sel.end;
    const next = base.slice(0, s0) + tok + base.slice(e0);
    if (next.length > MAX_LEN) {
      return;
    }
    setError(false);
    setEcho(null);
    setFresh(false);
    setAll(next, s0 + cursorOffset);
  };

  // Efface la sélection, ou le caractère avant le curseur
  const backspace = () => {
    setError(false);
    setEcho(null);
    setFresh(false);
    if (sel.start !== sel.end) {
      setAll(expr.slice(0, sel.start) + expr.slice(sel.end), sel.start);
    } else if (sel.start > 0) {
      setAll(
        expr.slice(0, sel.start - 1) + expr.slice(sel.start),
        sel.start - 1,
      );
    }
  };

  const moveCursor = (delta: number) => {
    const pos = Math.max(0, Math.min(expr.length, sel.start + delta));
    setSel({ start: pos, end: pos });
  };

  const commit = (src: string, v: number) => {
    setHistory(h => [{ expr: src, value: v }, ...h].slice(0, MAX_HISTORY));
    setEcho(`${src} =`);
    setAll(toInput(v));
    setFresh(true);
    setError(false);
  };

  const equals = () => {
    if (fresh || expr === '') {
      return;
    }
    const v = evaluate(expr);
    if (v === null) {
      setError(true);
      return;
    }
    commit(expr, v);
  };

  const reuseHistory = (item: HistoryItem) => {
    setEcho(null);
    setFresh(false);
    setError(false);
    setAll(toInput(item.value));
  };

  const onKey = (k: string) => {
    switch (k) {
      case 'C':
        setAll('');
        setEcho(null);
        setFresh(false);
        setError(false);
        return;
      case '⌫':
        return backspace();
      case '◀':
        return moveCursor(-1);
      case '▶':
        return moveCursor(1);
      case '=':
        return equals();
      default:
        return insert(k);
    }
  };

  const onFunc = (id: FuncId) => {
    switch (id) {
      case '√':
        return insert('√()', 2); // curseur entre les parenthèses
      case 'x²':
        return insert('^2');
      case 'xʸ':
        return insert('^');
      case 'π':
        return insert('π');
      case 'space':
        return insert(' ');
      case 'fracToDec': {
        const v = fromFraction(expr) ?? evaluate(expr);
        if (v === null) {
          setError(true);
          return;
        }
        commit(expr, v);
        return;
      }
      case 'decToFrac':
        setFracView(f => !f);
        return;
    }
  };

  return {
    expr,
    sel,
    echo,
    big,
    fracView,
    history,
    onKey,
    onFunc,
    onReuse: reuseHistory,
    onTextChange: (text: string) => setAll(text.slice(0, MAX_LEN)),
    onSelect: setSel,
  };
}
