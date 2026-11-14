// components/coach/PlanSelectorModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { User, CoachingPlan } from '../../types/models';
import { Avatar } from '../ui/Avatar';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  visible: boolean;
  coach: User | null;
  onClose: () => void;
  onSubscribe: (plan: CoachingPlan) => void;
}

export const PlanSelectorModal: React.FC<Props> = ({ visible, coach, onClose, onSubscribe }) => {
  const theme = useTheme();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!coach || !coach.coachProfile) return null;
  const plans = coach.coachProfile.plans;

  const currentSelected = plans.find((p) => p.id === (selectedPlanId || plans[0]?.id));

  const handleCheckout = () => {
    if (currentSelected) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSubscribe(currentSelected);
        onClose();
      }, 1500);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/85">
        <View
          className="h-[88%] flex-col rounded-t-3xl border-t p-4"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          {/* Header */}
          <View
            className="flex-row items-center justify-between border-b pb-3"
            style={{ borderColor: theme.border }}>
            <View className="flex-row items-center">
              <Avatar uri={coach.avatarUrl} size={36} name={coach.fullName} isVerified={true} />
              <View className="ml-2.5">
                <Text className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                  {coach.fullName}
                </Text>
                <Text className="text-xs font-semibold" style={{ color: theme.gold }}>
                  Formules de Coaching Certifié
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1" activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {isSuccess ? (
            <View className="flex-1 items-center justify-center p-6">
              <View
                className="mb-4 h-16 w-16 items-center justify-center rounded-full border"
                style={{ backgroundColor: 'rgba(198, 255, 61, 0.2)', borderColor: theme.accent }}>
                <Ionicons name="checkmark-sharp" size={32} color={theme.accent} />
              </View>
              <Text className="text-center text-xl font-bold" style={{ color: theme.textPrimary }}>
                Abonnement Activé avec Succès !
              </Text>
              <Text
                className="mt-2 text-center text-xs leading-relaxed"
                style={{ color: theme.textSecondary }}>
                {"Votre espace d'échange avec " +
                  coach.fullName +
                  '. Vous pouvez dès maintenant envoyer vos Form Checks.'}
              </Text>
            </View>
          ) : (
            <>
              {/* Onglets de sélection des packs */}
              <ScrollView className="mt-3 flex-1" showsVerticalScrollIndicator={false}>
                <Text
                  className="mb-2 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: theme.textMuted }}>
                  CHOISISSEZ VOTRE FORMULE
                </Text>

                <View className="mb-4 gap-3">
                  {plans.map((plan) => {
                    const isSelected = (selectedPlanId || plans[0]?.id) === plan.id;
                    return (
                      <TouchableOpacity
                        key={plan.id}
                        onPress={() => setSelectedPlanId(plan.id)}
                        className="rounded-2xl border p-4"
                        style={{
                          backgroundColor: isSelected ? theme.surfaceAlt : theme.surfaceAlt,
                          borderColor: isSelected ? theme.accent : theme.border,
                          borderWidth: isSelected ? 2 : 1,
                        }}
                        activeOpacity={0.8}>
                        <View className="flex-row items-start justify-between">
                          <View className="flex-1 pr-2">
                            <View className="flex-row items-center">
                              <Text
                                className="text-sm font-extrabold"
                                style={{ color: theme.textPrimary }}>
                                {plan.title}
                              </Text>
                              {plan.isPopular && (
                                <View
                                  className="ml-2 rounded-full border px-2 py-0.5"
                                  style={{
                                    backgroundColor: 'rgba(198, 255, 61, 0.2)',
                                    borderColor: 'rgba(198, 255, 61, 0.4)',
                                  }}>
                                  <Text
                                    className="text-[10px] font-bold"
                                    style={{ color: theme.accent }}>
                                    RECOMMANDÉ
                                  </Text>
                                </View>
                              )}
                            </View>
                            <Text
                              className="mt-1 text-xs leading-relaxed"
                              style={{ color: theme.textSecondary }}>
                              {plan.description}
                            </Text>
                          </View>

                          <View className="items-end">
                            <Text className="text-lg font-black" style={{ color: theme.accent }}>
                              {plan.price} €
                            </Text>
                            <Text className="text-[11px]" style={{ color: theme.textMuted }}>
                              {plan.interval === 'MONTHLY' ? '/ mois' : 'unique'}
                            </Text>
                          </View>
                        </View>

                        {/* Caractéristiques */}
                        <View
                          className="mt-3 gap-1.5 border-t pt-3"
                          style={{ borderColor: theme.border }}>
                          {plan.features.map((feat, idx) => (
                            <View key={idx} className="flex-row items-center">
                              <Ionicons name="checkmark-circle" size={14} color={theme.accent} />
                              <Text className="ml-2 text-xs" style={{ color: theme.textPrimary }}>
                                {feat}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Garantie & Sécurité */}
                <View
                  className="mb-4 flex-row items-center rounded-xl border p-3"
                  style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
                  <MaterialCommunityIcons name="shield-check" size={20} color={theme.gold} />
                  <Text className="ml-2 flex-1 text-[11px]" style={{ color: theme.textSecondary }}>
                    Paiement 100% sécurisé Stripe Connect • Sans engagement, résiliation en 1 clic.
                  </Text>
                </View>
              </ScrollView>

              {/* Bouton de confirmation */}
              <View className="border-t pt-3" style={{ borderColor: theme.border }}>
                <TouchableOpacity
                  onPress={handleCheckout}
                  className="w-full flex-row items-center justify-center rounded-xl py-3.5 shadow-lg"
                  style={{ backgroundColor: theme.accent }}
                  activeOpacity={0.8}>
                  <Feather name="credit-card" size={18} color="#0B0B0F" />
                  <Text className="ml-2 text-sm font-black uppercase tracking-wider text-background">
                    Souscrire ({currentSelected?.price} €
                    {currentSelected?.interval === 'MONTHLY' ? ' / mois' : ''})
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};
