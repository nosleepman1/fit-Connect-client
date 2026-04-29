// app/(tabs)/index.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StoriesBar } from '../../components/feed/StoriesBar';
import { PostCard } from '../../components/feed/PostCard';
import { CommentsModal } from '../../components/feed/CommentsModal';
import { StoryViewerModal } from '../../components/feed/StoryViewerModal';
import { CreatePostModal } from '../../components/feed/CreatePostModal';
import { Post, Story } from '../../types/models';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const posts = useSocialStore((s) => s.posts);
  const currentUser = useAuthStore((s) => s.currentUser);
  const [activeFilter, setActiveFilter] = useState<'FOR_YOU' | 'FOLLOWING' | 'GYM'>('FOR_YOU');
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background, paddingTop: insets.top }}>
      {/* Top Header - Ultra Épuré & Ergonomique */}
      <View
        className="flex-row items-center justify-between border-b px-4 py-3"
        style={{ backgroundColor: theme.background, borderColor: theme.border }}>
        <View className="flex-row items-center">
          <View
            className="mr-2.5 h-8 w-8 items-center justify-center rounded-xl"
            style={{ backgroundColor: theme.accent }}>
            <MaterialCommunityIcons name="dumbbell" size={20} color="#0B0B0F" />
          </View>
          <Text className="text-xl font-black tracking-tight" style={{ color: theme.textPrimary }}>
            FIT<Text style={{ color: theme.accent }}>CONNECT</Text>
          </Text>
        </View>

        <View className="flex-row items-center gap-2.5">
          {/* Streak Indicator */}
          <View
            className="flex-row items-center rounded-full border px-3 py-1.5"
            style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
            <Ionicons name="flame" size={15} color={theme.fire} />
            <Text className="ml-1 text-xs font-bold" style={{ color: theme.textPrimary }}>
              {currentUser.currentStreakWeeks} sem.
            </Text>
          </View>

          {/* Bouton Publier Header */}
          <TouchableOpacity
            onPress={() => setShowCreatePostModal(true)}
            className="flex-row items-center rounded-full px-3 py-1.5"
            style={{ backgroundColor: theme.accent }}
            activeOpacity={0.85}>
            <Ionicons name="add" size={16} color="#0B0B0F" />
            <Text className="ml-1 text-xs font-bold uppercase text-background">Publier</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stories Bar */}
        <StoriesBar onPressStory={(s) => setSelectedStory(s)} />

        {/* Filtres de flux - Pilules ergonomiques */}
        <View
          className="flex-row gap-2 border-b px-4 py-2.5"
          style={{ backgroundColor: theme.background, borderColor: theme.border }}>
          <TouchableOpacity
            onPress={() => setActiveFilter('FOR_YOU')}
            className="rounded-full border px-4 py-1.5"
            style={{
              backgroundColor: activeFilter === 'FOR_YOU' ? theme.accent : theme.surfaceAlt,
              borderColor: activeFilter === 'FOR_YOU' ? theme.accent : theme.border,
            }}
            activeOpacity={0.8}>
            <Text
              className="text-xs font-bold"
              style={{
                color: activeFilter === 'FOR_YOU' ? '#0B0B0F' : theme.textSecondary,
              }}>
              Pour vous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFilter('FOLLOWING')}
            className="rounded-full border px-4 py-1.5"
            style={{
              backgroundColor: activeFilter === 'FOLLOWING' ? theme.accent : theme.surfaceAlt,
              borderColor: activeFilter === 'FOLLOWING' ? theme.accent : theme.border,
            }}
            activeOpacity={0.8}>
            <Text
              className="text-xs font-bold"
              style={{
                color: activeFilter === 'FOLLOWING' ? '#0B0B0F' : theme.textSecondary,
              }}>
              Abonnements
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFilter('GYM')}
            className="rounded-full border px-4 py-1.5"
            style={{
              backgroundColor: activeFilter === 'GYM' ? theme.accent : theme.surfaceAlt,
              borderColor: activeFilter === 'GYM' ? theme.accent : theme.border,
            }}
            activeOpacity={0.8}>
            <Text
              className="text-xs font-bold"
              style={{
                color: activeFilter === 'GYM' ? '#0B0B0F' : theme.textSecondary,
              }}>
              Ma Salle
            </Text>
          </TouchableOpacity>
        </View>

        {/* Feed Posts */}
        <View className="py-2 pb-16">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onOpenComments={(p) => setSelectedPostForComments(p)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Modal des commentaires imbriqués */}
      <CommentsModal
        visible={!!selectedPostForComments}
        post={selectedPostForComments}
        onClose={() => setSelectedPostForComments(null)}
      />

      {/* Modal Visualisateur de Story */}
      <StoryViewerModal
        visible={!!selectedStory}
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />

      {/* Modal Création de Publication */}
      <CreatePostModal
        visible={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
      />
    </View>
  );
}
