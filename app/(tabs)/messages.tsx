// app/(tabs)/messages.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar } from '../../components/ui/Avatar';
import { VoiceMessagePlayer } from '../../components/chat/VoiceMessagePlayer';
import { FormCheckCard } from '../../components/chat/FormCheckCard';
import { VideoViewerModal } from '../../components/chat/VideoViewerModal';
import { Conversation, FormCheckData } from '../../types/models';
import { useChatStore } from '../../store/chatStore';
import { useTheme } from '../../hooks/useTheme';

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const conversations = useChatStore((s) => s.conversations);
  const activeMessages = useChatStore((s) => s.activeMessages);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormCheckVideo, setSelectedFormCheckVideo] = useState<FormCheckData | null>(null);

  const messages = selectedConversation ? activeMessages[selectedConversation.id] || [] : [];

  const handleSendText = () => {
    if (!selectedConversation || !inputText.trim()) return;
    sendMessage(selectedConversation.id, inputText.trim());
    setInputText('');
  };

  const handleSendVoice = () => {
    if (!selectedConversation) return;
    sendMessage(selectedConversation.id, 'Note vocale (0:24)', true);
  };

  const handleSendFormCheck = () => {
    if (!selectedConversation) return;
    sendMessage(
      selectedConversation.id,
      'Demande de validation vidéo sur le Squat 180kg x 3 reps.',
      false,
      true,
      'Squat Arrière 180kg'
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background, paddingTop: insets.top }}>
      {selectedConversation ? (
        // ÉCRAN DE DISCUSSION ACTIVE (CHAT 1-TO-1)
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 flex-col">
          {/* Header de discussion */}
          <View
            className="flex-row items-center justify-between border-b px-3 py-2.5"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <View className="flex-1 flex-row items-center">
              <TouchableOpacity
                onPress={() => setSelectedConversation(null)}
                className="mr-1 p-1.5"
                activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={22} color={theme.textPrimary} />
              </TouchableOpacity>

              <Avatar
                uri={selectedConversation.participant.avatarUrl}
                size={38}
                name={selectedConversation.participant.fullName}
                isVerified={selectedConversation.participant.isVerified}
              />

              <View className="ml-2.5 flex-1">
                <View className="flex-row items-center">
                  <Text
                    className="text-sm font-bold"
                    style={{ color: theme.textPrimary }}
                    numberOfLines={1}>
                    {selectedConversation.participant.fullName}
                  </Text>
                </View>
                <Text className="text-[11px] font-semibold" style={{ color: theme.accent }}>
                  En ligne • Coach Vérifié
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3">
              <TouchableOpacity className="p-1" activeOpacity={0.7}>
                <Ionicons name="call-outline" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity className="p-1" activeOpacity={0.7}>
                <Ionicons name="videocam-outline" size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Liste des Messages */}
          <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
            {/* Info cryptage & Coaching */}
            <View className="my-3 items-center">
              <View
                className="flex-row items-center rounded-full border px-3 py-1.5"
                style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
                <MaterialCommunityIcons name="shield-lock-outline" size={12} color={theme.gold} />
                <Text className="ml-1 text-[10px] font-medium" style={{ color: theme.textMuted }}>
                  Canal Privé & Certifié • Réponses VIP sous 24h
                </Text>
              </View>
            </View>

            {messages.map((msg) => {
              const isMe = msg.senderId === 'user_me';
              return (
                <View
                  key={msg.id}
                  className={`mb-3 max-w-[85%] ${isMe ? 'self-end' : 'self-start'}`}>
                  <View
                    className={`rounded-2xl p-3.5 ${isMe ? 'rounded-br-xs' : 'rounded-bl-xs border'}`}
                    style={{
                      backgroundColor: isMe ? theme.accent : theme.surface,
                      borderColor: isMe ? 'transparent' : theme.border,
                    }}>
                    {/* Message Vocal */}
                    {msg.isAudio ? (
                      <VoiceMessagePlayer
                        durationSeconds={msg.audioDurationSeconds || 30}
                        isSenderMe={isMe}
                      />
                    ) : (
                      <Text
                        className="text-xs leading-relaxed"
                        style={{
                          color: isMe ? '#0B0B0F' : theme.textPrimary,
                          fontWeight: isMe ? '600' : '400',
                        }}>
                        {msg.content}
                      </Text>
                    )}

                    {/* Widget Form Check */}
                    {msg.isFormCheck && msg.formCheckData && (
                      <FormCheckCard
                        exerciseName={msg.formCheckData.exerciseName}
                        status={msg.formCheckData.status}
                        coachNote={msg.formCheckData.coachNote}
                        rating={msg.formCheckData.rating}
                        onOpenVideo={() => setSelectedFormCheckVideo(msg.formCheckData!)}
                      />
                    )}

                    {/* Heure & Statut de lecture */}
                    <View className="mt-1 flex-row items-center justify-end gap-1">
                      <Text
                        className="text-[10px]"
                        style={{ color: isMe ? 'rgba(11,11,15,0.7)' : theme.textMuted }}>
                        {msg.createdAt}
                      </Text>
                      {isMe && (
                        <MaterialCommunityIcons
                          name="check-all"
                          size={13}
                          color={msg.status === 'READ' ? '#0B0B0F' : 'rgba(11,11,15,0.6)'}
                        />
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Barre de saisie en bas */}
          <View
            className="flex-col border-t p-3"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            {/* Raccourci Form Check */}
            <View className="mb-1 flex-row items-center justify-between pb-2">
              <TouchableOpacity
                onPress={handleSendFormCheck}
                className="flex-row items-center rounded-full border px-3 py-1"
                style={{
                  backgroundColor: 'rgba(255, 209, 102, 0.15)',
                  borderColor: 'rgba(255, 209, 102, 0.4)',
                }}
                activeOpacity={0.7}>
                <MaterialCommunityIcons name="video-plus-outline" size={14} color={theme.gold} />
                <Text className="ml-1 text-[11px] font-bold" style={{ color: theme.gold }}>
                  Demander un Form Check
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity className="mr-1 p-2" activeOpacity={0.7}>
                <Ionicons name="camera-outline" size={22} color={theme.textSecondary} />
              </TouchableOpacity>

              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Écrire un message..."
                placeholderTextColor={theme.textMuted}
                className="mr-2 flex-1 rounded-full border px-4 py-2.5 text-xs"
                style={{
                  backgroundColor: theme.surfaceAlt,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                }}
              />

              {inputText.trim() ? (
                <TouchableOpacity
                  onPress={handleSendText}
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.accent }}
                  activeOpacity={0.8}>
                  <Ionicons name="arrow-up" size={20} color="#0B0B0F" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleSendVoice}
                  className="h-10 w-10 items-center justify-center rounded-full border"
                  style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}
                  activeOpacity={0.7}>
                  <Ionicons name="mic-outline" size={20} color={theme.accent} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      ) : (
        // LISTE DES DISCUSSIONS (CONVERSATIONS LIST)
        <View className="flex-1">
          {/* Header */}
          <View
            className="border-b px-4 py-3"
            style={{ backgroundColor: theme.background, borderColor: theme.border }}>
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-xl font-black" style={{ color: theme.textPrimary }}>
                Messagerie
              </Text>
              <TouchableOpacity
                className="h-9 w-9 items-center justify-center rounded-full border"
                style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}
                activeOpacity={0.7}>
                <Feather name="edit" size={16} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Barre de Recherche */}
            <View
              className="flex-row items-center rounded-xl border px-3.5 py-2"
              style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
              <Ionicons name="search" size={16} color={theme.textMuted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Rechercher une discussion..."
                placeholderTextColor={theme.textMuted}
                className="ml-2 flex-1 text-xs"
                style={{ color: theme.textPrimary }}
              />
            </View>
          </View>

          {/* Liste */}
          <ScrollView className="flex-1 p-3" showsVerticalScrollIndicator={false}>
            {conversations.map((conv) => (
              <TouchableOpacity
                key={conv.id}
                onPress={() => setSelectedConversation(conv)}
                className="mb-2.5 flex-row items-center rounded-2xl border p-3"
                style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                activeOpacity={0.7}>
                <Avatar
                  uri={conv.participant.avatarUrl}
                  size={50}
                  name={conv.participant.fullName}
                  isVerified={conv.participant.isVerified}
                />

                <View className="ml-3 flex-1 pr-2">
                  <View className="mb-1 flex-row items-center justify-between">
                    <Text
                      className="text-sm font-bold"
                      style={{ color: theme.textPrimary }}
                      numberOfLines={1}>
                      {conv.participant.fullName}
                    </Text>
                    <Text className="text-[11px]" style={{ color: theme.textMuted }}>
                      {conv.updatedAt}
                    </Text>
                  </View>

                  <Text
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                    numberOfLines={1}>
                    {conv.lastMessage?.content || 'Nouvelle conversation'}
                  </Text>
                </View>

                {conv.unreadCount > 0 && (
                  <View
                    className="h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.accent }}>
                    <Text className="text-[10px] font-black text-background">
                      {conv.unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Modal Analyse Vidéo Form Check */}
      <VideoViewerModal
        visible={!!selectedFormCheckVideo}
        exerciseName={selectedFormCheckVideo?.exerciseName || ''}
        coachNote={selectedFormCheckVideo?.coachNote}
        rating={selectedFormCheckVideo?.rating}
        onClose={() => setSelectedFormCheckVideo(null)}
      />
    </View>
  );
}
