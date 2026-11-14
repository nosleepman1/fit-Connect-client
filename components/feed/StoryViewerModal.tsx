// components/feed/StoryViewerModal.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Story } from '../../types/models';
import { Avatar } from '../ui/Avatar';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  story: Story | null;
  visible: boolean;
  onClose: () => void;
}

export function StoryViewerModal({ story, visible, onClose }: Props) {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    let interval: any;
    if (visible && story) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onClose();
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => {
      clearInterval(interval);
      setProgress(0);
    };
  }, [visible, story, onClose]);

  if (!story) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View className="relative flex-1 bg-black">
        {/* Image Story Fullscreen */}
        <Image source={{ uri: story.mediaUrl }} className="h-full w-full" resizeMode="cover" />

        {/* Overlay Dégradé Supérieur */}
        <View className="absolute left-0 right-0 top-0 bg-gradient-to-b from-black/80 to-transparent p-4 pt-12">
          {/* Barre de Progression */}
          <View className="mb-3 h-1 w-full flex-row overflow-hidden rounded-full bg-white/30">
            <View
              className="h-full rounded-full"
              style={{ width: `${progress}%`, backgroundColor: theme.accent }}
            />
          </View>

          {/* Header Auteur */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Avatar uri={story.avatarUrl} size={38} name={story.username} showBadge={false} />
              <View className="ml-2.5">
                <View className="flex-row items-center">
                  <Text className="text-sm font-bold text-white">{story.username}</Text>
                  {story.isLiveWorkout && (
                    <View
                      className="ml-2 flex-row items-center rounded-full px-2 py-0.5"
                      style={{ backgroundColor: theme.fire }}>
                      <Ionicons name="flash" size={10} color="#FFFFFF" />
                      <Text className="ml-1 text-[9px] font-extrabold text-white">LIVE GYM</Text>
                    </View>
                  )}
                </View>
                <Text className="text-[11px] text-white/70">{story.createdAt}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full bg-black/50"
              activeOpacity={0.7}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Interaction Rapide */}
        <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pb-8">
          <View className="flex-row items-center gap-2">
            <TextInput
              value={replyText}
              onChangeText={setReplyText}
              placeholder={`Répondre à ${story.username}...`}
              placeholderTextColor="rgba(255,255,255,0.6)"
              className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white"
            />

            <TouchableOpacity
              className="h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40"
              activeOpacity={0.8}>
              <Ionicons name="flame" size={20} color={theme.fire} />
            </TouchableOpacity>

            <TouchableOpacity
              className="h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40"
              activeOpacity={0.8}>
              <MaterialCommunityIcons name="arm-flex" size={20} color={theme.accent} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
