// components/feed/PostCard.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Post, ReactionType } from '../../types/models';
import { Avatar } from '../ui/Avatar';
import { WorkoutSummaryCard } from './WorkoutSummaryCard';
import { useSocialStore } from '../../store/socialStore';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  post: Post;
  onOpenComments: (post: Post) => void;
  onPressAuthor?: (userId: string) => void;
}

export function PostCard({ post, onOpenComments, onPressAuthor }: Props) {
  const theme = useTheme();
  const toggleReaction = useSocialStore((s) => s.toggleReaction);
  const toggleSavePost = useSocialStore((s) => s.toggleSavePost);
  const isSaved = useSocialStore((s) => s.savedPostIds.includes(post.id));
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const getReactionIcon = (reaction?: ReactionType) => {
    switch (reaction) {
      case 'FIRE':
        return <Ionicons name="flame" size={20} color={theme.fire} />;
      case 'MUSCLE':
        return <MaterialCommunityIcons name="arm-flex" size={20} color={theme.accent} />;
      case 'ENERGY':
        return <Ionicons name="flash" size={20} color="#06B6D4" />;
      case 'FOCUS':
        return <MaterialCommunityIcons name="target" size={20} color={theme.gold} />;
      default:
        return <Ionicons name="flame-outline" size={20} color={theme.textSecondary} />;
    }
  };

  const getReactionLabel = (reaction?: ReactionType) => {
    switch (reaction) {
      case 'FIRE':
        return 'Intense';
      case 'MUSCLE':
        return 'Force';
      case 'ENERGY':
        return 'Énergie';
      case 'FOCUS':
        return 'Focus';
      default:
        return 'Réagir';
    }
  };

  return (
    <View
      className="mx-3.5 mb-4 overflow-hidden rounded-2xl border"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
      {/* En-tête de la publication */}
      <View className="flex-row items-center justify-between p-3.5">
        <TouchableOpacity
          className="flex-1 flex-row items-center"
          onPress={() => onPressAuthor?.(post.author.id)}
          activeOpacity={0.8}>
          <Avatar
            uri={post.author.avatarUrl}
            size={40}
            name={post.author.fullName}
            isVerified={post.author.isVerified}
          />
          <View className="ml-3">
            <View className="flex-row items-center">
              <Text className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                {post.author.username}
              </Text>
              {post.author.role === 'COACH' && (
                <View
                  className="ml-1.5 rounded border px-1.5 py-0.5"
                  style={{
                    backgroundColor: 'rgba(255, 209, 102, 0.15)',
                    borderColor: 'rgba(255, 209, 102, 0.4)',
                  }}>
                  <Text className="text-[10px] font-bold" style={{ color: theme.gold }}>
                    COACH
                  </Text>
                </View>
              )}
            </View>
            {post.location && (
              <View className="mt-0.5 flex-row items-center">
                <Ionicons name="location-sharp" size={11} color={theme.textMuted} />
                <Text className="ml-0.5 text-[11px]" style={{ color: theme.textMuted }}>
                  {post.location}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View className="flex-row items-center">
          <Text className="mr-2 text-xs" style={{ color: theme.textMuted }}>
            {post.createdAt}
          </Text>
          <TouchableOpacity className="p-1" activeOpacity={0.7}>
            <Feather name="more-horizontal" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenu Texte */}
      {post.content ? (
        <View className="px-3.5 pb-2.5">
          <Text className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}>
            {post.content}
          </Text>
        </View>
      ) : null}

      {/* Résumé de Séance (WorkoutSummaryCard) */}
      {post.postType === 'WORKOUT_SUMMARY' && post.workoutSummary && (
        <View className="px-3.5 pb-2">
          <WorkoutSummaryCard summary={post.workoutSummary} />
        </View>
      )}

      {/* Média Image */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <View className="relative aspect-[4/3] w-full bg-black">
          <Image source={{ uri: post.mediaUrls[0] }} className="h-full w-full" resizeMode="cover" />
          {post.postType === 'BEFORE_AFTER' && post.beforeAfter && (
            <View className="absolute bottom-3 left-3 flex-row items-center rounded-full border border-white/20 bg-black/80 px-3 py-1.5">
              <Ionicons name="swap-horizontal" size={14} color={theme.accent} />
              <Text className="ml-1.5 text-xs font-bold text-white">
                {post.beforeAfter.monthsInterval} mois ({post.beforeAfter.weightDiffKg})
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Barre d'Actions Sociales */}
      <View className="p-3.5">
        {/* Sélecteur de réactions rapides si ouvert */}
        {showReactionPicker && (
          <View
            className="mb-3 flex-row items-center justify-around rounded-full border p-2"
            style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
            {(['FIRE', 'MUSCLE', 'ENERGY', 'FOCUS'] as ReactionType[]).map((reaction) => (
              <TouchableOpacity
                key={reaction}
                onPress={() => {
                  toggleReaction(post.id, reaction);
                  setShowReactionPicker(false);
                }}
                className="flex-row items-center rounded-full px-3 py-1.5"
                style={{
                  backgroundColor: post.myReaction === reaction ? theme.surfaceAlt : 'transparent',
                }}
                activeOpacity={0.7}>
                {getReactionIcon(reaction)}
                <Text className="ml-1 text-xs font-semibold" style={{ color: theme.textPrimary }}>
                  {getReactionLabel(reaction)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            {/* Bouton Réaction */}
            <TouchableOpacity
              onPress={() => {
                if (post.myReaction) {
                  toggleReaction(post.id, post.myReaction);
                } else {
                  toggleReaction(post.id, 'FIRE');
                }
              }}
              onLongPress={() => setShowReactionPicker(true)}
              className="flex-row items-center"
              activeOpacity={0.7}>
              {getReactionIcon(post.myReaction)}
              <Text
                className="ml-1.5 text-xs font-bold"
                style={{ color: post.myReaction ? theme.textPrimary : theme.textSecondary }}>
                {post.reactionsCount}
              </Text>
            </TouchableOpacity>

            {/* Bouton Commentaires */}
            <TouchableOpacity
              onPress={() => onOpenComments(post)}
              className="flex-row items-center"
              activeOpacity={0.7}>
              <Feather name="message-circle" size={19} color={theme.textSecondary} />
              <Text className="ml-1.5 text-xs font-bold" style={{ color: theme.textSecondary }}>
                {post.commentsCount}
              </Text>
            </TouchableOpacity>

            {/* Bouton Partager */}
            <TouchableOpacity className="flex-row items-center" activeOpacity={0.7}>
              <Feather name="send" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Bouton Sauvegarder */}
          <TouchableOpacity onPress={() => toggleSavePost(post.id)} activeOpacity={0.7}>
            <Feather
              name="bookmark"
              size={19}
              color={isSaved ? theme.accent : theme.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Aperçu du commentaire */}
        {post.comments && post.comments.length > 0 && (
          <TouchableOpacity
            onPress={() => onOpenComments(post)}
            className="mt-3 border-t pt-2.5"
            style={{ borderColor: theme.border }}
            activeOpacity={0.8}>
            <Text className="text-xs" style={{ color: theme.textSecondary }} numberOfLines={1}>
              <Text className="font-bold" style={{ color: theme.textPrimary }}>
                {post.comments[0].author.username}{' '}
              </Text>
              {post.comments[0].content}
            </Text>
            {post.commentsCount > 1 && (
              <Text className="mt-1 text-[11px] font-semibold" style={{ color: theme.textMuted }}>
                Voir les {post.commentsCount} commentaires
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
