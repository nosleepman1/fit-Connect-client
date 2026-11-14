// components/coach/CoachCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { User } from '../../types/models';
import { Avatar } from '../ui/Avatar';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  coach: User;
  onSelectPlans: (coach: User) => void;
  onMessageCoach: (coach: User) => void;
}

export function CoachCard({ coach, onSelectPlans, onMessageCoach }: Props) {
  const theme = useTheme();
  const profile = coach.coachProfile;
  if (!profile) return null;

  const lowestPrice = profile.plans.reduce(
    (min, p) => (p.price < min ? p.price : min),
    profile.plans[0]?.price || 49
  );

  return (
    <View
      className="mb-4 rounded-2xl border p-4 shadow-sm"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
      {/* Profil du coach */}
      <View className="flex-row items-start justify-between">
        <View className="flex-1 flex-row items-center pr-2">
          <Avatar
            uri={coach.avatarUrl}
            size={52}
            name={coach.fullName}
            isVerified={coach.isVerified}
          />
          <View className="ml-3 flex-1">
            <Text
              className="text-base font-bold"
              style={{ color: theme.textPrimary }}
              numberOfLines={1}>
              {coach.fullName}
            </Text>
            <Text className="text-xs font-medium" style={{ color: theme.textMuted }}>
              @{coach.username}
            </Text>

            {/* Note & Élèves */}
            <View className="mt-1 flex-row items-center gap-2">
              <View
                className="flex-row items-center rounded-md border px-2 py-0.5"
                style={{
                  backgroundColor: 'rgba(255, 209, 102, 0.15)',
                  borderColor: 'rgba(255, 209, 102, 0.3)',
                }}>
                <Ionicons name="star" size={11} color={theme.gold} />
                <Text className="ml-1 text-[11px] font-bold" style={{ color: theme.gold }}>
                  {profile.ratingAverage.toFixed(1)} ({profile.reviewsCount})
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={12} color={theme.textSecondary} />
                <Text className="ml-1 text-xs" style={{ color: theme.textSecondary }}>
                  {profile.studentsCount} élèves
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Badge Certifié */}
        <View
          className="flex-row items-center rounded-full border px-2.5 py-0.5"
          style={{
            backgroundColor: 'rgba(255, 209, 102, 0.15)',
            borderColor: 'rgba(255, 209, 102, 0.4)',
          }}>
          <MaterialCommunityIcons name="check-decagram" size={13} color={theme.gold} />
          <Text
            className="ml-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ color: theme.gold }}>
            Certifié
          </Text>
        </View>
      </View>

      {/* Bio / Description */}
      <Text
        className="mt-3 text-xs leading-relaxed"
        style={{ color: theme.textSecondary }}
        numberOfLines={2}>
        {coach.bio}
      </Text>

      {/* Spécialités */}
      <View className="mt-2.5 flex-row flex-wrap gap-1.5">
        {profile.specialties.map((spec, idx) => (
          <View
            key={idx}
            className="rounded-full border px-2.5 py-0.5"
            style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
            <Text className="text-[10px] font-medium" style={{ color: theme.textPrimary }}>
              {spec}
            </Text>
          </View>
        ))}
      </View>

      {/* Diplômes Vérifiés */}
      {profile.diplomas.length > 0 && (
        <View
          className="mt-2.5 flex-row items-center border-t pt-2.5"
          style={{ borderColor: theme.border }}>
          <MaterialCommunityIcons name="school-outline" size={15} color={theme.accent} />
          <Text
            className="ml-1.5 flex-1 text-[11px] font-medium"
            style={{ color: theme.textSecondary }}
            numberOfLines={1}>
            {profile.diplomas[0]}
          </Text>
        </View>
      )}

      {/* Bas de carte : Prix et Actions */}
      <View
        className="mt-3 flex-row items-center justify-between border-t pt-3"
        style={{ borderColor: theme.border }}>
        <View>
          <Text
            className="text-[10px] font-medium uppercase tracking-wider"
            style={{ color: theme.textMuted }}>
            Dès
          </Text>
          <Text className="text-base font-extrabold" style={{ color: theme.accent }}>
            {lowestPrice} €
            <Text className="text-xs font-normal" style={{ color: theme.textSecondary }}>
              {' '}
              /mois
            </Text>
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => onMessageCoach(coach)}
            className="h-9 w-9 items-center justify-center rounded-xl border"
            style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}
            activeOpacity={0.7}>
            <Feather name="message-circle" size={16} color={theme.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onSelectPlans(coach)}
            className="flex-row items-center rounded-xl px-3.5 py-2"
            style={{ backgroundColor: theme.accent }}
            activeOpacity={0.8}>
            <Text className="text-xs font-bold uppercase tracking-wider text-background">
              Voir les offres
            </Text>
            <Ionicons name="arrow-forward" size={13} color="#0B0B0F" className="ml-1" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
