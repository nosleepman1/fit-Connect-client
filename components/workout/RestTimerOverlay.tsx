// components/workout/RestTimerOverlay.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutStore } from '../../store/workoutStore';
import { useTheme } from '../../hooks/useTheme';

export function RestTimerOverlay() {
  const theme = useTheme();
  const restTimerSeconds = useWorkoutStore((s) => s.restTimerSeconds);
  const isRestTimerRunning = useWorkoutStore((s) => s.isRestTimerRunning);
  const tickRestTimer = useWorkoutStore((s) => s.tickRestTimer);
  const adjustRestTimer = useWorkoutStore((s) => s.adjustRestTimer);
  const stopRestTimer = useWorkoutStore((s) => s.stopRestTimer);

  useEffect(() => {
    let interval: any;
    if (isRestTimerRunning && restTimerSeconds > 0) {
      interval = setInterval(() => {
        tickRestTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRestTimerRunning, restTimerSeconds, tickRestTimer]);

  if (!isRestTimerRunning || restTimerSeconds <= 0) return null;

  const mins = Math.floor(restTimerSeconds / 60);
  const remainSecs = restTimerSeconds % 60;
  const formatted = `${mins}:${remainSecs < 10 ? '0' : ''}${remainSecs}`;

  return (
    <View
      className="absolute bottom-20 left-4 right-4 z-50 flex-row items-center justify-between rounded-2xl border p-3.5 shadow-2xl"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.accent,
      }}>
      <View className="flex-row items-center">
        <View
          className="mr-3 h-10 w-10 items-center justify-center rounded-full border"
          style={{
            backgroundColor: theme.isLight ? 'rgba(0,0,0,0.05)' : 'rgba(198, 255, 61, 0.15)',
            borderColor: theme.accent,
          }}>
          <Ionicons name="timer-outline" size={20} color={theme.accent} />
        </View>
        <View>
          <Text
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: theme.textSecondary }}>
            TEMPS DE REPOS
          </Text>
          <Text className="font-mono text-xl font-black" style={{ color: theme.accent }}>
            {formatted}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() => adjustRestTimer(-15)}
          className="rounded-xl border px-3 py-1.5"
          style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}
          activeOpacity={0.7}>
          <Text className="text-xs font-bold" style={{ color: theme.textSecondary }}>
            -15s
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => adjustRestTimer(30)}
          className="rounded-xl border px-3 py-1.5"
          style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.accent }}
          activeOpacity={0.7}>
          <Text className="text-xs font-bold" style={{ color: theme.accent }}>
            +30s
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={stopRestTimer}
          className="ml-1 h-8 w-8 items-center justify-center rounded-full border"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            borderColor: 'rgba(239, 68, 68, 0.4)',
          }}
          activeOpacity={0.7}>
          <Ionicons name="close" size={16} color={theme.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
