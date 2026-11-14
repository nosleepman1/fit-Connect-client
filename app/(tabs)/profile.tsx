// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Avatar } from '../../components/ui/Avatar';
import { MOCK_BADGES } from '../../services/mockData';
import { useAuthStore } from '../../store/authStore';
import { useWorkoutStore } from '../../store/workoutStore';
import { SettingsModal } from '../../components/settings/SettingsModal';
import { useTheme } from '../../hooks/useTheme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { currentUser, isCoachMode, toggleUserMode } = useAuthStore();
  const { personalRecords, workoutHistory } = useWorkoutStore();
  const [activeTab, setActiveTab] = useState<'PRS' | 'BADGES' | 'HISTORY' | 'PLANS'>('PRS');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background, paddingTop: insets.top }}>
      {/* HEADER */}
      <View
        className="flex-row items-center justify-between border-b px-4 py-3"
        style={{ backgroundColor: theme.background, borderColor: theme.border }}>
        <Text className="text-xl font-black" style={{ color: theme.textPrimary }}>
          @{currentUser.username}
        </Text>

        <View className="flex-row items-center gap-2.5">
          {/* Bouton de basculement Mode Athlète / Coach */}
          <TouchableOpacity
            onPress={toggleUserMode}
            className="flex-row items-center rounded-full border px-3 py-1.5"
            style={{
              backgroundColor: isCoachMode
                ? 'rgba(255, 209, 102, 0.15)'
                : 'rgba(198, 255, 61, 0.15)',
              borderColor: isCoachMode ? theme.gold : theme.accent,
            }}
            activeOpacity={0.8}>
            <MaterialCommunityIcons
              name={isCoachMode ? 'shield-account' : 'account'}
              size={14}
              color={isCoachMode ? theme.gold : theme.accent}
            />
            <Text
              className="ml-1 text-[11px] font-bold"
              style={{ color: isCoachMode ? theme.gold : theme.accent }}>
              {isCoachMode ? 'Mode Coach' : 'Mode Athlète'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowSettingsModal(true)}
            className="h-9 w-9 items-center justify-center rounded-full border"
            style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}
            activeOpacity={0.7}>
            <Feather name="settings" size={17} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* BANNIÈRE PROFIL */}
        <View
          className="border-b p-4"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          <View className="flex-row items-start justify-between">
            <Avatar
              uri={currentUser.avatarUrl}
              size={68}
              name={currentUser.fullName}
              isVerified={currentUser.isVerified}
            />

            {/* Statistiques Profil */}
            <View className="ml-4 flex-1 flex-row justify-around self-center">
              <View className="items-center">
                <Text className="text-base font-extrabold" style={{ color: theme.textPrimary }}>
                  {currentUser.postsCount}
                </Text>
                <Text className="text-[10px] font-medium" style={{ color: theme.textMuted }}>
                  Posts
                </Text>
              </View>

              <View className="items-center">
                <Text className="text-base font-extrabold" style={{ color: theme.textPrimary }}>
                  {currentUser.followersCount}
                </Text>
                <Text className="text-[10px] font-medium" style={{ color: theme.textMuted }}>
                  Followers
                </Text>
              </View>

              <View className="items-center">
                <Text className="text-base font-extrabold" style={{ color: theme.textPrimary }}>
                  {currentUser.followingCount}
                </Text>
                <Text className="text-[10px] font-medium" style={{ color: theme.textMuted }}>
                  Suivis
                </Text>
              </View>

              <View className="items-center">
                <View className="flex-row items-center">
                  <Ionicons name="flame" size={14} color={theme.fire} />
                  <Text
                    className="ml-0.5 text-base font-extrabold"
                    style={{ color: theme.textPrimary }}>
                    {currentUser.currentStreakWeeks}
                  </Text>
                </View>
                <Text className="text-[10px] font-medium" style={{ color: theme.textMuted }}>
                  Semaines
                </Text>
              </View>
            </View>
          </View>

          {/* Nom & Bio */}
          <View className="mt-3">
            <View className="flex-row items-center">
              <Text className="text-base font-bold" style={{ color: theme.textPrimary }}>
                {currentUser.fullName}
              </Text>
              {currentUser.role === 'COACH' && (
                <View
                  className="ml-2 rounded-md border px-2 py-0.5"
                  style={{
                    backgroundColor: 'rgba(255, 209, 102, 0.15)',
                    borderColor: 'rgba(255, 209, 102, 0.4)',
                  }}>
                  <Text className="text-[10px] font-bold" style={{ color: theme.gold }}>
                    COACH CERTIFIÉ
                  </Text>
                </View>
              )}
            </View>

            <Text className="mt-1 text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
              {currentUser.bio}
            </Text>

            {currentUser.homeGym && (
              <View className="mt-2 flex-row items-center">
                <Ionicons name="location-sharp" size={12} color={theme.accent} />
                <Text className="ml-1 text-xs font-semibold" style={{ color: theme.accent }}>
                  {currentUser.homeGym}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ONGLETS DU PROFIL */}
        <View
          className="flex-row border-b"
          style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
          <TouchableOpacity
            onPress={() => setActiveTab('PRS')}
            className="flex-1 items-center border-b-2 py-3"
            style={{ borderColor: activeTab === 'PRS' ? theme.accent : 'transparent' }}
            activeOpacity={0.7}>
            <View className="flex-row items-center">
              <Ionicons
                name="trophy"
                size={14}
                color={activeTab === 'PRS' ? theme.accent : theme.textMuted}
              />
              <Text
                className="ml-1 text-xs font-bold"
                style={{ color: activeTab === 'PRS' ? theme.accent : theme.textMuted }}>
                Records (PR)
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('BADGES')}
            className="flex-1 items-center border-b-2 py-3"
            style={{ borderColor: activeTab === 'BADGES' ? theme.accent : 'transparent' }}
            activeOpacity={0.7}>
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="medal"
                size={15}
                color={activeTab === 'BADGES' ? theme.accent : theme.textMuted}
              />
              <Text
                className="ml-1 text-xs font-bold"
                style={{ color: activeTab === 'BADGES' ? theme.accent : theme.textMuted }}>
                Badges
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('HISTORY')}
            className="flex-1 items-center border-b-2 py-3"
            style={{ borderColor: activeTab === 'HISTORY' ? theme.accent : 'transparent' }}
            activeOpacity={0.7}>
            <View className="flex-row items-center">
              <Ionicons
                name="time"
                size={14}
                color={activeTab === 'HISTORY' ? theme.accent : theme.textMuted}
              />
              <Text
                className="ml-1 text-xs font-bold"
                style={{ color: activeTab === 'HISTORY' ? theme.accent : theme.textMuted }}>
                Séances
              </Text>
            </View>
          </TouchableOpacity>

          {currentUser.role === 'COACH' && (
            <TouchableOpacity
              onPress={() => setActiveTab('PLANS')}
              className="flex-1 items-center border-b-2 py-3"
              style={{ borderColor: activeTab === 'PLANS' ? theme.gold : 'transparent' }}
              activeOpacity={0.7}>
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="shield-star"
                  size={15}
                  color={activeTab === 'PLANS' ? theme.gold : theme.textMuted}
                />
                <Text
                  className="ml-1 text-xs font-bold"
                  style={{ color: activeTab === 'PLANS' ? theme.gold : theme.textMuted }}>
                  Plans
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* CONTENU DE L'ONGLET SÉLECTIONNÉ */}
        <View className="p-4">
          {activeTab === 'PRS' && (
            <View className="gap-2.5">
              {personalRecords.map((pr) => (
                <View
                  key={pr.exerciseId}
                  className="flex-row items-center justify-between rounded-2xl border p-3.5"
                  style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                  <View className="flex-1 flex-row items-center pr-3">
                    <View
                      className="mr-3 h-10 w-10 items-center justify-center rounded-xl border"
                      style={{
                        backgroundColor: 'rgba(255, 209, 102, 0.15)',
                        borderColor: 'rgba(255, 209, 102, 0.3)',
                      }}>
                      <Ionicons name="trophy" size={18} color={theme.gold} />
                    </View>
                    <View>
                      <Text className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                        {pr.exerciseName}
                      </Text>
                      <Text className="mt-0.5 text-xs" style={{ color: theme.textMuted }}>
                        {pr.weightKg} kg × {pr.reps} reps ({pr.dateAchieved})
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-base font-black" style={{ color: theme.accent }}>
                      {pr.estimatedOneRepMax} kg
                    </Text>
                    <Text className="text-[10px] uppercase" style={{ color: theme.textMuted }}>
                      1RM Estimé
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'BADGES' && (
            <View className="gap-2.5">
              {MOCK_BADGES.map((badge) => (
                <View
                  key={badge.id}
                  className="flex-row items-center rounded-2xl border p-3.5"
                  style={{
                    backgroundColor: badge.isUnlocked ? theme.surface : theme.surfaceAlt,
                    borderColor: badge.isUnlocked ? theme.accent : theme.border,
                    opacity: badge.isUnlocked ? 1 : 0.6,
                  }}>
                  <View
                    className="mr-3.5 h-11 w-11 items-center justify-center rounded-full border"
                    style={{
                      backgroundColor: badge.isUnlocked
                        ? 'rgba(198, 255, 61, 0.2)'
                        : theme.surfaceAlt,
                      borderColor: badge.isUnlocked ? theme.accent : theme.border,
                    }}>
                    <MaterialCommunityIcons
                      name={badge.isUnlocked ? 'medal' : 'lock-outline'}
                      size={22}
                      color={badge.isUnlocked ? theme.accent : theme.textMuted}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                      {badge.title}
                    </Text>
                    <Text className="mt-0.5 text-xs" style={{ color: theme.textSecondary }}>
                      {badge.description}
                    </Text>
                    {badge.unlockedAt && (
                      <Text
                        className="mt-1 text-[10px] font-semibold"
                        style={{ color: theme.accent }}>
                        Débloqué le {badge.unlockedAt}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'HISTORY' && (
            <View className="gap-2.5">
              {workoutHistory.map((sess) => (
                <View
                  key={sess.id}
                  className="flex-row items-center justify-between rounded-2xl border p-3.5"
                  style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                  <View className="flex-1 flex-row items-center">
                    <View
                      className="mr-3 h-10 w-10 items-center justify-center rounded-xl border"
                      style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
                      <MaterialCommunityIcons name="dumbbell" size={20} color={theme.accent} />
                    </View>
                    <View>
                      <Text className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                        {sess.title}
                      </Text>
                      <Text className="mt-0.5 text-xs" style={{ color: theme.textMuted }}>
                        {Math.floor(sess.durationSeconds / 60)} min •{' '}
                        {(sess.totalVolumeKg || 0).toLocaleString('fr-FR')} kg
                      </Text>
                    </View>
                  </View>

                  {sess.prCount > 0 && (
                    <View
                      className="rounded-full border px-2.5 py-1"
                      style={{
                        backgroundColor: 'rgba(255, 209, 102, 0.15)',
                        borderColor: 'rgba(255, 209, 102, 0.4)',
                      }}>
                      <Text className="text-xs font-bold" style={{ color: theme.gold }}>
                        +{sess.prCount} PR
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {activeTab === 'PLANS' && currentUser.coachProfile && (
            <View className="gap-3">
              {currentUser.coachProfile.plans.map((plan) => (
                <View
                  key={plan.id}
                  className="rounded-2xl border p-4 shadow-sm"
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: 'rgba(255, 209, 102, 0.3)',
                  }}>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-sm font-extrabold" style={{ color: theme.textPrimary }}>
                      {plan.title}
                    </Text>
                    <Text className="text-base font-black" style={{ color: theme.accent }}>
                      {plan.price} €
                    </Text>
                  </View>
                  <Text className="mb-3 text-xs" style={{ color: theme.textSecondary }}>
                    {plan.description}
                  </Text>
                  <View className="gap-1.5 border-t pt-2" style={{ borderColor: theme.border }}>
                    {plan.features.map((f, i) => (
                      <View key={i} className="flex-row items-center">
                        <Ionicons name="checkmark-circle" size={13} color={theme.gold} />
                        <Text className="ml-1.5 text-xs" style={{ color: theme.textPrimary }}>
                          {f}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* MODAL DES PARAMÈTRES & THÈMES */}
      <SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </View>
  );
}
