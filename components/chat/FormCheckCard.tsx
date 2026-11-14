// components/chat/FormCheckCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  exerciseName: string;
  status: 'PENDING' | 'REVIEWED';
  coachNote?: string;
  rating?: number;
  onOpenVideo?: () => void;
}

export const FormCheckCard: React.FC<Props> = ({
  exerciseName,
  status,
  coachNote,
  rating,
  onOpenVideo,
}) => {
  const theme = useTheme();
  const isReviewed = status === 'REVIEWED';

  return (
    <View
      className="my-2 rounded-2xl border p-3.5 shadow-md"
      style={{
        backgroundColor: theme.surfaceAlt,
        borderColor: isReviewed ? theme.accent : 'rgba(255, 209, 102, 0.4)',
      }}>
      {/* En-tête */}
      <View
        className="flex-row items-center justify-between border-b pb-2.5"
        style={{ borderColor: theme.border }}>
        <View className="flex-row items-center">
          <View
            className="mr-2 h-8 w-8 items-center justify-center rounded-full"
            style={{
              backgroundColor: isReviewed ? 'rgba(198, 255, 61, 0.2)' : 'rgba(255, 209, 102, 0.2)',
            }}>
            <MaterialCommunityIcons
              name="video-check-outline"
              size={18}
              color={isReviewed ? theme.accent : theme.gold}
            />
          </View>
          <View>
            <Text
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: isReviewed ? theme.accent : theme.gold }}>
              DEMANDE DE FORM CHECK
            </Text>
            <Text className="text-xs font-bold" style={{ color: theme.textPrimary }}>
              {exerciseName}
            </Text>
          </View>
        </View>

        <View
          className="rounded-full border px-2.5 py-1"
          style={{
            backgroundColor: isReviewed ? 'rgba(198, 255, 61, 0.15)' : 'rgba(255, 209, 102, 0.15)',
            borderColor: isReviewed ? theme.accent : theme.gold,
          }}>
          <Text
            className="text-[10px] font-bold"
            style={{ color: isReviewed ? theme.accent : theme.gold }}>
            {isReviewed ? 'ANALYSÉ' : 'EN ATTENTE'}
          </Text>
        </View>
      </View>

      {/* Aperçu vidéo */}
      <TouchableOpacity
        onPress={onOpenVideo}
        className="relative mt-2.5 h-24 items-center justify-center overflow-hidden rounded-xl border bg-black/60"
        style={{ borderColor: theme.border }}
        activeOpacity={0.8}>
        <View className="h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
          <Ionicons name="play" size={20} color="#FFFFFF" />
        </View>
        <View className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5">
          <Text className="text-[10px] font-semibold text-white">{"Vidéo d'exécution"}</Text>
        </View>
      </TouchableOpacity>

      {/* Retour du coach si validé */}
      {isReviewed && coachNote ? (
        <View
          className="mt-3 rounded-xl border p-2.5"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="text-[11px] font-bold" style={{ color: theme.gold }}>
              Retour du Coach :
            </Text>
            {rating && (
              <View className="flex-row items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < rating ? 'star' : 'star-outline'}
                    size={11}
                    color={theme.gold}
                  />
                ))}
              </View>
            )}
          </View>
          <Text className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
            {coachNote}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
