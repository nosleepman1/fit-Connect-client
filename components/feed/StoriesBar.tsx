// components/feed/StoriesBar.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../ui/Avatar';
import { Story } from '../../types/models';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  onPressStory?: (story: Story) => void;
}

export function StoriesBar({ onPressStory }: Props) {
  const theme = useTheme();
  const { stories, markStorySeen } = useSocialStore();
  const { currentUser } = useAuthStore();

  return (
    <View
      className="border-b py-3"
      style={{ backgroundColor: theme.background, borderColor: theme.border }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}>
        {/* Ma Story / Ajouter */}
        <TouchableOpacity className="items-center" activeOpacity={0.8}>
          <View className="relative">
            <Avatar
              uri={currentUser.avatarUrl}
              size={58}
              name={currentUser.fullName}
              showBadge={false}
            />
            <View
              className="absolute bottom-0 right-0 items-center justify-center rounded-full border-2 p-1"
              style={{ backgroundColor: theme.accent, borderColor: theme.background }}>
              <Ionicons name="add" size={14} color="#0B0B0F" />
            </View>
          </View>
          <Text
            className="mt-1.5 text-xs font-medium"
            style={{ color: theme.textSecondary }}
            numberOfLines={1}>
            Votre Story
          </Text>
        </TouchableOpacity>

        {/* Stories des contacts */}
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            className="items-center"
            activeOpacity={0.8}
            onPress={() => {
              markStorySeen(story.id);
              onPressStory?.(story);
            }}>
            <View className="relative">
              <Avatar
                uri={story.avatarUrl}
                size={58}
                name={story.username}
                hasActiveStory={true}
                storySeen={story.hasSeen}
                showBadge={false}
              />
              {story.isLiveWorkout && (
                <View
                  className="absolute -bottom-1 left-2 right-2 flex-row items-center justify-center rounded-full px-1.5 py-0.5"
                  style={{ backgroundColor: theme.fire }}>
                  <Ionicons name="flash" size={10} color="#FFFFFF" />
                  <Text className="ml-0.5 text-[9px] font-bold text-white">LIVE</Text>
                </View>
              )}
            </View>
            <Text
              className="mt-1.5 max-w-[68px] text-xs font-medium"
              style={{ color: theme.textPrimary }}
              numberOfLines={1}>
              {story.username}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
