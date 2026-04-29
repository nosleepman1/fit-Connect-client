// components/ui/Avatar.tsx
import React from 'react';
import { View, Image, Text } from 'react-native';
import { VerificationBadge } from './VerificationBadge';

interface Props {
  uri?: string;
  size?: number;
  name?: string;
  isVerified?: boolean;
  hasActiveStory?: boolean;
  storySeen?: boolean;
  showBadge?: boolean;
}

export const Avatar: React.FC<Props> = ({
  uri,
  size = 44,
  name = 'User',
  isVerified = false,
  hasActiveStory = false,
  storySeen = false,
  showBadge = true,
}) => {
  const ringColor = hasActiveStory
    ? storySeen
      ? 'border-textMuted'
      : 'border-accent'
    : 'border-transparent';

  return (
    <View className="relative">
      <View
        className={`items-center justify-center rounded-full ${hasActiveStory ? `border-2 p-[2px] ${ringColor}` : ''}`}
        style={{ width: size + (hasActiveStory ? 6 : 0), height: size + (hasActiveStory ? 6 : 0) }}>
        {uri ? (
          <Image
            source={{ uri }}
            className="rounded-full bg-surfaceAlt"
            style={{ width: size, height: size }}
          />
        ) : (
          <View
            className="items-center justify-center rounded-full bg-surfaceAlt"
            style={{ width: size, height: size }}>
            <Text className="text-sm font-bold text-textPrimary">
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {isVerified && showBadge && (
        <View className="absolute -bottom-1 -right-1">
          <VerificationBadge size={14} />
        </View>
      )}
    </View>
  );
};
