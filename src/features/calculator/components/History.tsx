import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MIN_TOUCH, useTheme } from '@/theme';
import type { HistoryItem } from '@/features/calculator/constants';
import { show } from '@/features/calculator/logic/format';

type Props = {
  history: HistoryItem[];
  fracView: boolean;
  onReuse: (item: HistoryItem) => void;
};

// Derniers calculs ; toucher un élément le réutilise comme valeur
export function History({ history, fracView, onReuse }: Props) {
  const { t } = useTranslation();
  const c = useTheme();
  return (
    <View style={s.historyBox}>
      {history.length === 0 ? (
        <Text style={[s.muted, { color: c.muted }]}>
          {t('calculator.history')} : {t('calculator.empty')}
        </Text>
      ) : (
        <ScrollView>
          {history.map((h, i) => (
            <Pressable
              key={`${i}-${h.expr}`}
              accessibilityRole="button"
              onPress={() => onReuse(h)}
              style={[s.histItem, { backgroundColor: c.card, borderColor: c.border }]}
            >
              <Text style={[s.histExpr, { color: c.muted }]} numberOfLines={1}>
                {h.expr}
              </Text>
              <Text style={[s.histValue, { color: c.text }]}>
                {show(h.value, fracView)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  // Hauteur minimale conservée : l'historique ne disparaît jamais
  historyBox: { flex: 1, minHeight: 96, marginBottom: 8 },
  muted: { fontSize: 16, paddingVertical: 8 },
  histItem: {
    minHeight: MIN_TOUCH,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  histExpr: { fontSize: 16, flexShrink: 1 },
  histValue: { fontSize: 22, fontWeight: '600' },
});
