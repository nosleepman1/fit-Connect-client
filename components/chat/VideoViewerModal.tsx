// components/chat/VideoViewerModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  visible: boolean;
  exerciseName: string;
  coachNote?: string;
  rating?: number;
  onClose: () => void;
}

export function VideoViewerModal({ visible, exerciseName, coachNote, rating, onClose }: Props) {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(true);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View className="flex-1 bg-black">
        {/* Header */}
        <View className="absolute left-0 right-0 top-0 z-20 flex-row items-center justify-between bg-gradient-to-b from-black/90 to-transparent p-4 pt-12">
          <View className="flex-row items-center">
            <View
              className="mr-2.5 h-9 w-9 items-center justify-center rounded-full border"
              style={{ backgroundColor: 'rgba(255, 209, 102, 0.2)', borderColor: theme.gold }}>
              <MaterialCommunityIcons name="video-check" size={20} color={theme.gold} />
            </View>
            <View>
              <Text
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: theme.gold }}>
                ANALYSE FORM CHECK
              </Text>
              <Text className="text-sm font-bold text-white">{exerciseName}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="h-9 w-9 items-center justify-center rounded-full bg-white/20"
            activeOpacity={0.7}>
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Video simulation with high quality fitness frame */}
        <View className="relative flex-1 items-center justify-center">
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&auto=format&fit=crop&q=80',
            }}
            className="h-full w-full opacity-80"
            resizeMode="cover"
          />

          {/* Central Play/Pause button */}
          <TouchableOpacity
            onPress={() => setIsPlaying(!isPlaying)}
            className="h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-black/60 shadow-2xl"
            activeOpacity={0.8}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color={theme.accent} />
          </TouchableOpacity>

          {/* Trajectory overlay line illustration */}
          <View className="absolute bottom-28 left-6 right-6 rounded-xl border border-white/20 bg-black/70 p-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-bold text-white">
                Trajectoire & Posture (Angle 88°)
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="shield-checkmark" size={14} color={theme.accent} />
                <Text className="ml-1 text-[11px] font-bold" style={{ color: theme.accent }}>
                  Validé
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Coach Feedback Sheet at the bottom */}
        {coachNote && (
          <View
            className="border-t p-4 pb-8"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <View className="mb-2 flex-row items-center justify-between">
              <Text
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: theme.gold }}>
                DÉBRIEF DU COACH
              </Text>
              {rating && (
                <View className="flex-row items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < rating ? 'star' : 'star-outline'}
                      size={14}
                      color={theme.gold}
                    />
                  ))}
                </View>
              )}
            </View>
            <Text className="text-xs leading-relaxed" style={{ color: theme.textPrimary }}>
              {coachNote}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}
