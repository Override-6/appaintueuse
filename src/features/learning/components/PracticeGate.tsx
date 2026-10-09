import React, {useState, type ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, NumField} from '@/components';
import {useTheme} from '@/theme';
import {parseNumber} from '@/utils/format';
import {usePractice} from '../context/PracticeContext';
import {LK} from '../keys';
import {compareGuess, type Comparison} from '../logic/check';

// `revealed` : elle a demandé à voir la réponse sans la trouver
type Attempt = {answer: number; result: Comparison | 'revealed'};
type Props = {answer: number | undefined; children: ReactNode; unit?: string};

// Mode essai : tant que le résultat n'est pas trouvé, on dit seulement « plus » ou « moins »
// (jamais la réponse ni les étapes) ; le résultat s'affiche si elle trouve ou le demande
export function PracticeGate({answer, children, unit}: Props) {
  const {enabled} = usePractice();
  const t = useTheme();
  const {t: tr} = useTranslation();
  const [guess, setGuess] = useState('');
  const [attempt, setAttempt] = useState<Attempt | undefined>(undefined);

  if (!enabled || answer === undefined) {
    return <>{children}</>;
  }

  // Un essai ne vaut que pour la réponse attendue au moment où il a été fait
  const current = attempt?.answer === answer ? attempt.result : undefined;

  if (current === 'ok' || current === 'revealed') {
    return (
      <View>
        {current === 'ok' ? (
          <Text style={[styles.feedback, {color: t.primary}]}>{tr(LK.practiceOk)}</Text>
        ) : null}
        {children}
      </View>
    );
  }

  const check = () => {
    const n = parseNumber(guess);
    if (n !== undefined) {
      setAttempt({answer, result: compareGuess(n, answer)});
    }
  };

  const onChange = (value: string) => {
    setGuess(value);
    setAttempt(undefined); // l'indice portait sur l'ancien essai
  };

  return (
    <View>
      <NumField label={tr(LK.practiceQuestion)} value={guess} onChange={onChange} unit={unit} />
      {current ? (
        <Text style={[styles.feedback, {color: t.text}]}>
          {tr(current === 'more' ? LK.practiceMore : LK.practiceLess)}
        </Text>
      ) : null}
      <Button label={tr(LK.practiceCheck)} onPress={check} />
      <Button
        label={tr(LK.practiceReveal)}
        onPress={() => setAttempt({answer, result: 'revealed'})}
        secondary
      />
    </View>
  );
}

const styles = StyleSheet.create({
  feedback: {fontSize: 18, fontWeight: '600', marginBottom: 12},
});
