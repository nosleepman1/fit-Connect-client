// components/ui/VerificationBadge.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';

interface Props {
  size?: number;
  showText?: boolean;
}

export const VerificationBadge: React.FC<Props> = ({ size = 16, showText = false }) => {
  return (
    <View className="flex-row items-center">
      <View
        className="items-center justify-center rounded-full bg-gold/20"
        style={{ width: size + 4, height: size + 4 }}>
        <MaterialCommunityIcons name="check-decagram" size={size} color={THEME.colors.gold} />
      </View>
      {showText && <Text className="ml-1 text-xs font-semibold text-gold">Coach Certifié</Text>}
    </View>
  );
};
