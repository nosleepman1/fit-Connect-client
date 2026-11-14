// components/feed/WorkoutSummaryCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  summary: {
    durationSeconds: number;
    totalVolumeKg: number;
    prCount: number;
    exercises: { name: string; maxWeight: number; totalSets: number }[];
  };
}

export function WorkoutSummaryCard({ summary }: Props) {
  const theme = useTheme();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remainMins = mins % 60;
    if (hrs > 0) return `${hrs}h ${remainMins}m`;
    return `${mins} min`;
  };

  return (
    <View
      className="my-2.5 rounded-2xl border p-3.5"
      style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
      {/* En-tête de la séance */}
      <View
        className="flex-row items-center justify-between border-b pb-2.5"
        style={{ borderColor: theme.border }}>
        <View className="flex-row items-center">
          <View
            className="mr-2 h-7 w-7 items-center justify-center rounded-lg"
            style={{
              backgroundColor: theme.isLight ? 'rgba(0,0,0,0.06)' : 'rgba(198, 255, 61, 0.15)',
            }}>
            <MaterialCommunityIcons name="dumbbell" size={16} color={theme.accent} />
          </View>
          <Text className="text-xs font-bold" style={{ color: theme.textPrimary }}>
            Séance Validée
          </Text>
        </View>

        {summary.prCount > 0 && (
          <View
            className="flex-row items-center rounded-full border px-2.5 py-0.5"
            style={{
              backgroundColor: 'rgba(255, 209, 102, 0.15)',
              borderColor: 'rgba(255, 209, 102, 0.3)',
            }}>
            <Ionicons name="trophy" size={12} color={theme.gold} />
            <Text className="ml-1 text-[11px] font-bold" style={{ color: theme.gold }}>
              +{summary.prCount} PR
            </Text>
          </View>
        )}
      </View>

      {/* Métriques Clés */}
      <View
        className="flex-row justify-around border-b py-2.5"
        style={{ borderColor: theme.border }}>
        <View className="items-center">
          <Text className="text-[10px] font-medium" style={{ color: theme.textMuted }}>
            DURÉE
          </Text>
          <Text className="mt-0.5 text-sm font-black" style={{ color: theme.textPrimary }}>
            {formatDuration(summary.durationSeconds)}
          </Text>
        </View>

        <View className="h-6 w-[1px] self-center" style={{ backgroundColor: theme.border }} />

        <View className="items-center">
          <Text className="text-[10px] font-medium" style={{ color: theme.textMuted }}>
            VOLUME
          </Text>
          <Text className="mt-0.5 text-sm font-black" style={{ color: theme.accent }}>
            {summary.totalVolumeKg.toLocaleString('fr-FR')} kg
          </Text>
        </View>

        <View className="h-6 w-[1px] self-center" style={{ backgroundColor: theme.border }} />

        <View className="items-center">
          <Text className="text-[10px] font-medium" style={{ color: theme.textMuted }}>
            EXERCICES
          </Text>
          <Text className="mt-0.5 text-sm font-black" style={{ color: theme.textPrimary }}>
            {summary.exercises.length}
          </Text>
        </View>
      </View>

      {/* Liste concise des exercices */}
      <View className="gap-1.5 pt-2.5">
        {summary.exercises.map((ex, idx) => (
          <View key={idx} className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center pr-2">
              <View
                className="mr-2 h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: theme.accent }}
              />
              <Text
                className="text-xs font-medium"
                style={{ color: theme.textPrimary }}
                numberOfLines={1}>
                {ex.name}
              </Text>
            </View>
            <Text className="text-xs font-semibold" style={{ color: theme.accent }}>
              {ex.maxWeight} kg <Text style={{ color: theme.textMuted }}>({ex.totalSets}s)</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
