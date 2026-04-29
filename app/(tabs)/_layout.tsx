// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useWorkoutStore } from '../../store/workoutStore';
import { useTheme } from '../../hooks/useTheme';

export default function TabLayout() {
  const isActive = useWorkoutStore((state) => state.isActive);
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'flame' : 'flame-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Coachs',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'compass' : 'compass-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Séance',
          tabBarIcon: ({ color, focused }) => (
            <View className="relative">
              <View
                className="-mt-2 h-10 w-10 items-center justify-center rounded-full"
                style={{
                  backgroundColor: isActive
                    ? theme.accent
                    : focused
                      ? theme.surfaceAlt
                      : theme.surfaceAlt,
                  borderWidth: isActive ? 2 : 1,
                  borderColor: isActive ? theme.background : theme.border,
                }}>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={22}
                  color={isActive ? '#0B0B0F' : color}
                />
              </View>
              {isActive && (
                <View
                  className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2"
                  style={{ backgroundColor: theme.fire, borderColor: theme.background }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
