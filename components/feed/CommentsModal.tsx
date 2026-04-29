// components/feed/CommentsModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Post, Comment } from '../../types/models';
import { Avatar } from '../ui/Avatar';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore } from '../../store/socialStore';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  visible: boolean;
  post: Post | null;
  onClose: () => void;
}

export const CommentsModal: React.FC<Props> = ({ visible, post, onClose }) => {
  const theme = useTheme();
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const currentUser = useAuthStore((s) => s.currentUser);
  const addComment = useSocialStore((s) => s.addComment);

  if (!post) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    addComment(post.id, inputText.trim(), currentUser, replyingTo ? replyingTo.id : undefined);
    setInputText('');
    setReplyingTo(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end bg-black/75">
        <View
          className="h-[75%] flex-col rounded-t-3xl border-t"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          {/* Header */}
          <View
            className="flex-row items-center justify-between border-b p-4"
            style={{ borderColor: theme.border }}>
            <View className="w-8" />
            <Text className="text-base font-bold" style={{ color: theme.textPrimary }}>
              Commentaires ({post.commentsCount})
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1" activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Liste des commentaires */}
          <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
            {post.comments.length === 0 ? (
              <View className="items-center justify-center py-12">
                <Feather name="message-circle" size={40} color={theme.textMuted} />
                <Text className="mt-3 text-sm" style={{ color: theme.textSecondary }}>
                  Soyez le premier à commenter !
                </Text>
              </View>
            ) : (
              post.comments.map((comment) => (
                <View key={comment.id} className="mb-4">
                  <View className="flex-row items-start">
                    <Avatar
                      uri={comment.author.avatarUrl}
                      size={36}
                      name={comment.author.username}
                      isVerified={comment.author.isVerified}
                    />
                    <View
                      className="ml-3 flex-1 rounded-xl border p-3"
                      style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
                      <View className="mb-1 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Text className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                            {comment.author.username}
                          </Text>
                          {comment.author.role === 'COACH' && (
                            <View
                              className="ml-1.5 rounded border px-1.5"
                              style={{
                                backgroundColor: 'rgba(255, 209, 102, 0.15)',
                                borderColor: 'rgba(255, 209, 102, 0.3)',
                              }}>
                              <Text className="text-[9px] font-bold" style={{ color: theme.gold }}>
                                COACH
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-[11px]" style={{ color: theme.textMuted }}>
                          {comment.createdAt}
                        </Text>
                      </View>
                      <Text
                        className="text-xs leading-relaxed"
                        style={{ color: theme.textSecondary }}>
                        {comment.content}
                      </Text>
                    </View>
                  </View>

                  {/* Actions sous le commentaire */}
                  <View className="ml-12 mt-1.5 flex-row items-center gap-4">
                    <TouchableOpacity
                      onPress={() => setReplyingTo(comment)}
                      className="flex-row items-center"
                      activeOpacity={0.7}>
                      <Text className="text-[11px] font-semibold" style={{ color: theme.accent }}>
                        Répondre
                      </Text>
                    </TouchableOpacity>
                    <View className="flex-row items-center">
                      <Ionicons name="heart-outline" size={12} color={theme.textMuted} />
                      <Text className="ml-1 text-[11px]" style={{ color: theme.textMuted }}>
                        {comment.likesCount}
                      </Text>
                    </View>
                  </View>

                  {/* Réponses imbriquées (Threaded Replies) */}
                  {comment.replies && comment.replies.length > 0 && (
                    <View
                      className="ml-10 mt-3 gap-3 border-l-2 pl-3"
                      style={{ borderColor: theme.border }}>
                      {comment.replies.map((reply) => (
                        <View key={reply.id} className="flex-row items-start">
                          <Avatar
                            uri={reply.author.avatarUrl}
                            size={28}
                            name={reply.author.username}
                            isVerified={reply.author.isVerified}
                          />
                          <View
                            className="ml-2.5 flex-1 rounded-lg border p-2.5"
                            style={{
                              backgroundColor: theme.surfaceAlt,
                              borderColor: theme.border,
                            }}>
                            <View className="mb-0.5 flex-row items-center justify-between">
                              <Text
                                className="text-xs font-bold"
                                style={{ color: theme.textPrimary }}>
                                {reply.author.username}
                              </Text>
                              <Text className="text-[10px]" style={{ color: theme.textMuted }}>
                                {reply.createdAt}
                              </Text>
                            </View>
                            <Text className="text-xs" style={{ color: theme.textSecondary }}>
                              {reply.content}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            )}
          </ScrollView>

          {/* Barre de saisie */}
          <View
            className="border-t p-3"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            {replyingTo && (
              <View
                className="mb-2 flex-row items-center justify-between border-b pb-2"
                style={{ borderColor: theme.border }}>
                <Text className="text-xs" style={{ color: theme.accent }}>
                  Réponse à @{replyingTo.author.username}
                </Text>
                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                  <Ionicons name="close" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            )}

            <View className="flex-row items-center">
              <Avatar
                uri={currentUser.avatarUrl}
                size={34}
                name={currentUser.fullName}
                showBadge={false}
              />
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder={
                  replyingTo
                    ? `Répondre à @${replyingTo.author.username}...`
                    : 'Ajouter un commentaire...'
                }
                placeholderTextColor={theme.textMuted}
                className="mx-3 flex-1 rounded-full border px-3.5 py-2.5 text-xs"
                style={{
                  backgroundColor: theme.surfaceAlt,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                }}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!inputText.trim()}
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{
                  backgroundColor: inputText.trim() ? theme.accent : theme.surfaceAlt,
                }}
                activeOpacity={0.8}>
                <Ionicons
                  name="arrow-up"
                  size={18}
                  color={inputText.trim() ? '#0B0B0F' : theme.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
