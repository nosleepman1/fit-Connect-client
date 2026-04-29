// components/feed/CreatePostModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../ui/Avatar';
import { PostType } from '../../types/models';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const SAMPLE_MEDIA_OPTIONS = [
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
];

export function CreatePostModal({ visible, onClose }: Props) {
  const theme = useTheme();
  const currentUser = useAuthStore((s) => s.currentUser);
  const createPost = useSocialStore((s) => s.createPost);

  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<PostType>('STANDARD');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(SAMPLE_MEDIA_OPTIONS[0]);
  const [location, setLocation] = useState('Basic-Fit République, Paris');

  const handlePublish = () => {
    if (!content.trim() && !selectedMedia) return;

    createPost({
      author: currentUser,
      content: content.trim(),
      mediaUrls: selectedMedia ? [selectedMedia] : [],
      postType: selectedType,
      location: location || undefined,
      beforeAfter:
        selectedType === 'BEFORE_AFTER'
          ? {
              beforeUrl:
                'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
              afterUrl:
                selectedMedia ||
                'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
              monthsInterval: 6,
              weightDiffKg: '-7 kg & +4kg muscle',
            }
          : undefined,
    });

    setContent('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/80">
        <View
          className="h-[88%] flex-col rounded-t-3xl border-t p-4"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          {/* Header */}
          <View
            className="flex-row items-center justify-between border-b pb-3"
            style={{ borderColor: theme.border }}>
            <TouchableOpacity onPress={onClose} className="p-1" activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </TouchableOpacity>

            <Text className="text-base font-bold" style={{ color: theme.textPrimary }}>
              Nouvelle Publication
            </Text>

            <TouchableOpacity
              onPress={handlePublish}
              disabled={!content.trim() && !selectedMedia}
              className="rounded-full px-4 py-1.5"
              style={{
                backgroundColor: content.trim() || selectedMedia ? theme.accent : theme.surfaceAlt,
              }}
              activeOpacity={0.8}>
              <Text
                className="text-xs font-bold uppercase"
                style={{
                  color: content.trim() || selectedMedia ? '#0B0B0F' : theme.textMuted,
                }}>
                Publier
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="mt-3 flex-1" showsVerticalScrollIndicator={false}>
            {/* Profil Auteur */}
            <View className="flex-row items-center">
              <Avatar
                uri={currentUser.avatarUrl}
                size={44}
                name={currentUser.fullName}
                isVerified={currentUser.isVerified}
              />
              <View className="ml-3">
                <Text className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                  {currentUser.fullName}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="location-sharp" size={12} color={theme.accent} />
                  <Text className="ml-1 text-xs" style={{ color: theme.accent }}>
                    {location}
                  </Text>
                </View>
              </View>
            </View>

            {/* Type de Post */}
            <View className="my-3 flex-row gap-2">
              <TouchableOpacity
                onPress={() => setSelectedType('STANDARD')}
                className="rounded-full border px-3 py-1.5"
                style={{
                  backgroundColor: selectedType === 'STANDARD' ? theme.accent : theme.surfaceAlt,
                  borderColor: selectedType === 'STANDARD' ? theme.accent : theme.border,
                }}>
                <Text
                  className="text-xs font-bold"
                  style={{
                    color: selectedType === 'STANDARD' ? '#0B0B0F' : theme.textSecondary,
                  }}>
                  Général
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedType('BEFORE_AFTER')}
                className="rounded-full border px-3 py-1.5"
                style={{
                  backgroundColor:
                    selectedType === 'BEFORE_AFTER' ? theme.accent : theme.surfaceAlt,
                  borderColor: selectedType === 'BEFORE_AFTER' ? theme.accent : theme.border,
                }}>
                <Text
                  className="text-xs font-bold"
                  style={{
                    color: selectedType === 'BEFORE_AFTER' ? '#0B0B0F' : theme.textSecondary,
                  }}>
                  Avant / Après
                </Text>
              </TouchableOpacity>
            </View>

            {/* Zone de texte */}
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Partagez votre séance, vos perfs ou posez une question à la communauté..."
              placeholderTextColor={theme.textMuted}
              multiline
              className="min-h-[100px] text-sm leading-relaxed"
              style={{ color: theme.textPrimary }}
            />

            {/* Localisation / Salle */}
            <View
              className="mt-3 flex-row items-center rounded-xl border px-3 py-2"
              style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
              <Ionicons name="location-outline" size={16} color={theme.accent} />
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Lieu / Salle de sport (ex: Basic-Fit...)"
                placeholderTextColor={theme.textMuted}
                className="ml-2 flex-1 text-xs"
                style={{ color: theme.textPrimary }}
              />
            </View>

            {/* Sélection de Médias Photos */}
            <Text
              className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider"
              style={{ color: theme.textMuted }}>
              CHOISIR UNE PHOTO FITNESS
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              <View className="flex-row gap-3">
                {SAMPLE_MEDIA_OPTIONS.map((url, idx) => {
                  const isSelected = selectedMedia === url;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setSelectedMedia(isSelected ? null : url)}
                      className="relative h-28 w-28 overflow-hidden rounded-2xl border"
                      style={{ borderColor: isSelected ? theme.accent : theme.border }}
                      activeOpacity={0.8}>
                      <Image source={{ uri: url }} className="h-full w-full" resizeMode="cover" />
                      {isSelected && (
                        <View
                          className="absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full"
                          style={{ backgroundColor: theme.accent }}>
                          <Ionicons name="checkmark" size={16} color="#0B0B0F" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
