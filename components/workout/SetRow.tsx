// components/workout/SetRow.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ExerciseSet } from '../../types/models';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  set: ExerciseSet;
  exerciseIndex: number;
  setIndex: number;
  onUpdate: (data: Partial<ExerciseSet>) => void;
  onComplete: () => void;
  onDelete: () => void;
}

export function SetRow({ set, onUpdate, onComplete, onDelete }: Props) {
  const theme = useTheme();

  return (
    <View
      className="mb-2 flex-row items-center justify-between rounded-xl border px-3 py-2"
      style={{
        backgroundColor: set.isCompleted
          ? theme.isLight
            ? 'rgba(34, 197, 94, 0.1)'
            : 'rgba(198, 255, 61, 0.1)'
          : theme.surfaceAlt,
        borderColor: set.isCompleted ? theme.accent : theme.border,
      }}>
      {/* Numéro de série & Type */}
      <View className="w-12 flex-row items-center">
        <View
          className="h-6 w-6 items-center justify-center rounded-full"
          style={{
            backgroundColor: set.isCompleted ? theme.accent : theme.border,
          }}>
          <Text
            className="text-xs font-bold"
            style={{ color: set.isCompleted ? '#0B0B0F' : theme.textSecondary }}>
            {set.setNumber}
          </Text>
        </View>
        {set.isPersonalRecord && (
          <View className="ml-1">
            <Ionicons name="trophy" size={11} color={theme.gold} />
          </View>
        )}
      </View>

      {/* Saisie Poids (kg) */}
      <View className="mx-1 flex-1 flex-row items-center justify-center">
        <TextInput
          value={set.weightKg ? String(set.weightKg) : ''}
          onChangeText={(val) => {
            const num = parseFloat(val.replace(',', '.'));
            onUpdate({ weightKg: isNaN(num) ? 0 : num });
          }}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={theme.textMuted}
          className="min-w-[50px] rounded-lg border px-2.5 py-1.5 text-center text-xs font-bold"
          style={{
            backgroundColor: theme.surface,
            borderColor: set.isCompleted ? theme.accent : theme.border,
            color: set.isCompleted ? theme.accent : theme.textPrimary,
          }}
        />
        <Text className="ml-1 text-[11px]" style={{ color: theme.textMuted }}>
          kg
        </Text>
      </View>

      {/* Saisie Répétitions */}
      <View className="mx-1 flex-1 flex-row items-center justify-center">
        <TextInput
          value={set.reps ? String(set.reps) : ''}
          onChangeText={(val) => {
            const num = parseInt(val, 10);
            onUpdate({ reps: isNaN(num) ? 0 : num });
          }}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={theme.textMuted}
          className="min-w-[46px] rounded-lg border px-2.5 py-1.5 text-center text-xs font-bold"
          style={{
            backgroundColor: theme.surface,
            borderColor: set.isCompleted ? theme.accent : theme.border,
            color: set.isCompleted ? theme.accent : theme.textPrimary,
          }}
        />
        <Text className="ml-1 text-[11px]" style={{ color: theme.textMuted }}>
          reps
        </Text>
      </View>

      {/* Bouton Validation Série */}
      <View className="ml-2 flex-row items-center gap-1.5">
        <TouchableOpacity
          onPress={onComplete}
          className="h-8 w-8 items-center justify-center rounded-lg border"
          style={{
            backgroundColor: set.isCompleted ? theme.accent : theme.surface,
            borderColor: set.isCompleted ? theme.accent : theme.border,
          }}
          activeOpacity={0.7}>
          <Ionicons
            name="checkmark"
            size={16}
            color={set.isCompleted ? '#0B0B0F' : theme.textMuted}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete} className="p-1" activeOpacity={0.7}>
          <MaterialCommunityIcons name="trash-can-outline" size={15} color={theme.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
