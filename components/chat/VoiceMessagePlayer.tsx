// components/chat/VoiceMessagePlayer.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  durationSeconds?: number;
  isSenderMe?: boolean;
}

export const VoiceMessagePlayer: React.FC<Props> = ({
  durationSeconds = 30,
  isSenderMe = false,
}) => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);

  // Simulation de waveform audio
  const waveHeights = [8, 14, 20, 24, 16, 10, 22, 28, 18, 12, 16, 24, 14, 8, 18, 22, 12];

  return (
    <View className="flex-row items-center py-1">
      <TouchableOpacity
        onPress={() => setIsPlaying(!isPlaying)}
        className="mr-3 h-9 w-9 items-center justify-center rounded-full"
        style={{
          backgroundColor: isSenderMe ? '#0B0B0F' : theme.accent,
        }}
        activeOpacity={0.8}>
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={18}
          color={isSenderMe ? '#FFFFFF' : '#0B0B0F'}
        />
      </TouchableOpacity>

      <View className="mr-3 h-8 flex-1 flex-row items-center gap-[3px]">
        {waveHeights.map((h, i) => (
          <View
            key={i}
            className="w-[3px] rounded-full"
            style={{
              height: h,
              backgroundColor:
                isPlaying && i < 8
                  ? isSenderMe
                    ? '#0B0B0F'
                    : theme.accent
                  : isSenderMe
                    ? 'rgba(0,0,0,0.35)'
                    : theme.border,
            }}
          />
        ))}
      </View>

      <Text
        className="text-xs font-semibold"
        style={{ color: isSenderMe ? '#0B0B0F' : theme.textSecondary }}>
        0:{durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds}
      </Text>
    </View>
  );
};
