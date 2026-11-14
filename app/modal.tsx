// app/modal.tsx
import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SettingsModal } from '../components/settings/SettingsModal';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <SettingsModal visible={true} onClose={() => router.back()} />
    </View>
  );
}
