// app/(tabs)/explore.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CoachCard } from '../../components/coach/CoachCard';
import { PlanSelectorModal } from '../../components/coach/PlanSelectorModal';
import { User, CoachingPlan } from '../../types/models';
import { useCoachStore } from '../../store/coachStore';
import { useChatStore } from '../../store/chatStore';
import { useTheme } from '../../hooks/useTheme';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const {
    coaches,
    selectedSpecialty,
    setSpecialty,
    searchQuery,
    setSearchQuery,
    submitCertificationApplication,
    applicationStatus,
  } = useCoachStore();

  const [selectedCoachForPlans, setSelectedCoachForPlans] = useState<User | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [diplomaInput, setDiplomaInput] = useState('');

  const specialties = [
    'TOUS',
    'Hypertrophie',
    'Powerlifting',
    'Perte de Gras',
    'Hyrox',
    'Nutrition',
    'Mobilité',
  ];

  const filteredCoaches = coaches.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.coachProfile?.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpec =
      selectedSpecialty === 'TOUS' ||
      c.coachProfile?.specialties.some((s) => s.toLowerCase() === selectedSpecialty.toLowerCase());

    return matchesSearch && matchesSpec;
  });

  const handleApplyCoach = () => {
    if (!diplomaInput.trim()) return;
    submitCertificationApplication(diplomaInput.trim());
    setTimeout(() => {
      setShowApplyModal(false);
      setDiplomaInput('');
    }, 1500);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background, paddingTop: insets.top }}>
      {/* Header */}
      <View
        className="border-b px-4 py-3"
        style={{ backgroundColor: theme.background, borderColor: theme.border }}>
        <View className="mb-3 flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-black" style={{ color: theme.textPrimary }}>
              Marketplace Coachs
            </Text>
            <Text className="text-xs font-medium" style={{ color: theme.textSecondary }}>
              Trouvez un professionnel du sport diplômé et certifié
            </Text>
          </View>

          {/* Bouton Devenir Coach */}
          <TouchableOpacity
            onPress={() => setShowApplyModal(true)}
            className="flex-row items-center rounded-full border px-3 py-1.5"
            style={{
              backgroundColor: 'rgba(255, 209, 102, 0.15)',
              borderColor: 'rgba(255, 209, 102, 0.4)',
            }}
            activeOpacity={0.8}>
            <MaterialCommunityIcons name="shield-star-outline" size={14} color={theme.gold} />
            <Text className="ml-1 text-xs font-bold" style={{ color: theme.gold }}>
              Devenir Coach
            </Text>
          </TouchableOpacity>
        </View>

        {/* Barre de Recherche */}
        <View
          className="flex-row items-center rounded-xl border px-3.5 py-2.5"
          style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
          <Ionicons name="search" size={18} color={theme.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher un coach, discipline (Hyrox, Force...)"
            placeholderTextColor={theme.textMuted}
            className="ml-2.5 flex-1 text-sm"
            style={{ color: theme.textPrimary }}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filtres de Spécialités */}
      <View
        className="border-b py-2.5"
        style={{ backgroundColor: theme.background, borderColor: theme.border }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {specialties.map((spec) => (
            <TouchableOpacity
              key={spec}
              onPress={() => setSpecialty(spec)}
              className="rounded-full border px-3.5 py-1.5"
              style={{
                backgroundColor: selectedSpecialty === spec ? theme.accent : theme.surfaceAlt,
                borderColor: selectedSpecialty === spec ? theme.accent : theme.border,
              }}
              activeOpacity={0.8}>
              <Text
                className="text-xs font-bold"
                style={{
                  color: selectedSpecialty === spec ? '#0B0B0F' : theme.textSecondary,
                }}>
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Liste des Coachs */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Bannière de Garantie & Confiance */}
        <View
          className="mb-4 flex-row items-center rounded-card border p-3.5"
          style={{ backgroundColor: theme.surfaceAlt, borderColor: 'rgba(255, 209, 102, 0.3)' }}>
          <View
            className="mr-3 h-10 w-10 items-center justify-center rounded-full border"
            style={{
              backgroundColor: 'rgba(255, 209, 102, 0.2)',
              borderColor: 'rgba(255, 209, 102, 0.4)',
            }}>
            <MaterialCommunityIcons name="check-decagram" size={22} color={theme.gold} />
          </View>
          <View className="flex-1">
            <Text
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: theme.gold }}>
              100% DES COACHS VÉRIFIÉS
            </Text>
            <Text
              className="mt-0.5 text-[11px] leading-snug"
              style={{ color: theme.textSecondary }}>
              Diplômes d’État (BPJEPS, STAPS, CQP) & cartes professionnelles vérifiés par notre
              équipe.
            </Text>
          </View>
        </View>

        {filteredCoaches.map((coach) => (
          <CoachCard
            key={coach.id}
            coach={coach}
            onSelectPlans={(c) => setSelectedCoachForPlans(c)}
            onMessageCoach={(c) => {
              setActiveConversation('conv_1');
              router.push('/(tabs)/messages');
            }}
          />
        ))}
      </ScrollView>

      {/* Modal de Sélection & Paiement d'un Plan */}
      <PlanSelectorModal
        visible={!!selectedCoachForPlans}
        coach={selectedCoachForPlans}
        onClose={() => setSelectedCoachForPlans(null)}
        onSubscribe={(_plan: CoachingPlan) => {
          setSelectedCoachForPlans(null);
        }}
      />

      {/* Modal Déposer sa Candidature Coach */}
      <Modal visible={showApplyModal} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/85">
          <View
            className="rounded-t-3xl border-t p-5"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <View
              className="flex-row items-center justify-between border-b pb-3"
              style={{ borderColor: theme.border }}>
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="school-outline" size={22} color={theme.gold} />
                <Text className="ml-2 text-base font-bold" style={{ color: theme.textPrimary }}>
                  Candidature Coach
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowApplyModal(false)}>
                <Ionicons name="close" size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {applicationStatus === 'SUBMITTED' ? (
              <View className="items-center py-8">
                <View
                  className="mb-3 h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'rgba(198, 255, 61, 0.2)' }}>
                  <Ionicons name="checkmark" size={28} color={theme.accent} />
                </View>
                <Text className="text-base font-bold" style={{ color: theme.textPrimary }}>
                  Dossier Reçu !
                </Text>
                <Text className="mt-1 text-center text-xs" style={{ color: theme.textSecondary }}>
                  Nos administrateurs vérifient vos diplômes sous 24h ouvrées.
                </Text>
              </View>
            ) : (
              <View className="pt-3">
                <Text className="mb-3 text-xs" style={{ color: theme.textSecondary }}>
                  Renseignez vos diplômes et certifications sportives reconnues pour obtenir le
                  badge officiel doré.
                </Text>
                <TextInput
                  value={diplomaInput}
                  onChangeText={setDiplomaInput}
                  placeholder="Ex: BPJEPS AF Mention Haltérophilie / Licence STAPS"
                  placeholderTextColor={theme.textMuted}
                  className="mb-4 rounded-xl border p-3.5 text-xs"
                  style={{
                    backgroundColor: theme.surfaceAlt,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                />

                <TouchableOpacity
                  onPress={handleApplyCoach}
                  disabled={!diplomaInput.trim()}
                  className="items-center rounded-xl py-3.5"
                  style={{ backgroundColor: diplomaInput.trim() ? theme.gold : theme.surfaceAlt }}>
                  <Text className="text-xs font-bold uppercase tracking-wider text-background">
                    Soumettre mon dossier
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
