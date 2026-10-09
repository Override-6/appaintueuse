// Calculs : évaluateur d'expressions (sans eval ni Function) et conversions fraction/décimal.
// Grammaire, de la priorité la plus faible à la plus forte :
//   expr      := terme (('+' | '−') terme)*
//   terme     := unaire (('×' | '÷') unaire)*
//   unaire    := ('-' | '+') unaire | puissance
//   puissance := postfixe ('^' unaire)?
//   postfixe  := primaire '%'*
//   primaire  := nombre | 'π' | '√' postfixe | '(' expr ')'
// '*' et '/' sont acceptés comme '×' et '÷'. Virgule ou point décimal.

const MAX_LENGTH = 200;

type Token = { type: 'num'; value: number } | { type: 'op'; value: string };

const OPS = new Map<string, string>([
  ['+', '+'],
  ['-', '-'],
  ['−', '-'],
  ['*', '*'],
  ['×', '*'],
  ['/', '/'],
  ['÷', '/'],
  ['^', '^'],
  ['%', '%'],
  ['(', '('],
  [')', ')'],
  ['√', '√'],
  ['π', 'π'],
]);

const NUMBER = /^(\d+(?:[.,]\d*)?|[.,]\d+)/;

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    const m = NUMBER.exec(src.slice(i));
    if (m) {
      tokens.push({ type: 'num', value: Number(m[1].replace(',', '.')) });
      i += m[1].length;
      continue;
    }
    const op = OPS.get(ch);
    if (op === undefined) {
      throw new Error(`caractère inattendu : ${ch}`);
    }
    tokens.push({ type: 'op', value: op });
    i++;
  }
  return tokens;
}

// Renvoie la valeur, ou null si l'expression est invalide ou si le résultat n'est pas fini.
export function evaluate(expr: string): number | null {
  if (expr.length === 0 || expr.length > MAX_LENGTH) {
    return null;
  }
  try {
    const tokens = tokenize(expr);
    let pos = 0;

    const fail = (): never => {
      throw new Error('expression invalide');
    };

    const eat = (op: string): boolean => {
      const t = tokens[pos];
      if (t && t.type === 'op' && t.value === op) {
        pos++;
        return true;
      }
      return false;
    };

    const parseExpr = (): number => {
      let v = parseTerm();
      for (;;) {
        const plus = eat('+');
        if (!plus && !eat('-')) {
          return v;
        }
        const start = pos;
        const rhs = parseTerm();
        // « a + b% » = a + a×b/100 (comme une calculatrice classique)
        const isPercent =
          pos - start === 2 &&
          tokens[start].type === 'num' &&
          tokens[start + 1].value === '%';
        const delta = isPercent ? v * rhs : rhs;
        v = plus ? v + delta : v - delta;
      }
    };

    const parseTerm = (): number => {
      let v = parseUnary();
      for (;;) {
        if (eat('*')) {
          v *= parseUnary();
        } else if (eat('/')) {
          const d = parseUnary();
          if (d === 0) {
            fail();
          }
          v /= d;
        } else {
          return v;
        }
      }
    };

    const parseUnary = (): number => {
      if (eat('-')) {
        return -parseUnary();
      }
      if (eat('+')) {
        return parseUnary();
      }
      return parsePower();
    };

    const parsePower = (): number => {
      const base = parsePostfix();
      return eat('^') ? Math.pow(base, parseUnary()) : base;
    };

    const parsePostfix = (): number => {
      let v = parsePrimary();
      while (eat('%')) {
        v /= 100;
      }
      return v;
    };

    const parsePrimary = (): number => {
      const t = tokens[pos++];
      if (!t) {
        return fail();
      }
      if (t.type === 'num') {
        return t.value;
      }
      if (t.value === 'π') {
        return Math.PI;
      }
      if (t.value === '√') {
        const v = parsePostfix();
        return v < 0 ? fail() : Math.sqrt(v);
      }
      if (t.value === '(') {
        const v = parseExpr();
        if (!eat(')')) {
          fail();
        }
        return v;
      }
      return fail();
    };

    const v = parseExpr();
    if (pos !== tokens.length) {
      fail();
    }
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

// Fraction la plus proche (dénominateur <= maxDenominator), ex. 0.375 -> "3/8", 1.5 -> "1 1/2".
export function toFraction(x: number, maxDenominator = 64): string {
  if (!Number.isFinite(x)) {
    return '?';
  }
  const maxQ = Math.max(1, Math.floor(maxDenominator));
  const sign = x < 0 ? '-' : '';
  const a = Math.abs(x);
  let whole = Math.floor(a);
  const frac = a - whole;

  let p = 0;
  let q = 1;
  let err = frac;
  for (let d = 1; d <= maxQ; d++) {
    const n = Math.round(frac * d);
    const e = Math.abs(frac - n / d);
    if (e < err - 1e-12) {
      p = n;
      q = d;
      err = e;
    }
  }
  if (p === q) {
    whole += 1;
    p = 0;
  }
  if (p === 0) {
    return whole === 0 ? '0' : sign + String(whole);
  }
  const g = gcd(p, q);
  p /= g;
  q /= g;
  return sign + (whole > 0 ? `${whole} ${p}/${q}` : `${p}/${q}`);
}

// Lit "3/8", "1 1/2", "-1 1/2", "5" ou un décimal (virgule ou point). undefined si invalide.
export function fromFraction(text: string): number | undefined {
  const s = text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/,/g, '.')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/ ?\/ ?/g, '/');

  let m = /^(-?)(\d+) (\d+)\/(\d+)$/.exec(s);
  if (m) {
    const whole = Number(m[2]);
    const p = Number(m[3]);
    const q = Number(m[4]);
    if (q === 0 || p >= q) {
      return undefined;
    }
    const v = whole + p / q;
    return m[1] ? -v : v;
  }

  m = /^(-?\d+)\/(\d+)$/.exec(s);
  if (m) {
    const q = Number(m[2]);
    return q === 0 ? undefined : Number(m[1]) / q;
  }

  if (/^-?\d+(\.\d+)?$/.test(s)) {
    return Number(s);
  }
  return undefined;
}
