import { View, Text } from 'react-native';
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useInformationStore } from '@/store/useInformationStore';
import MotivationsScreen from './MotivationsScreen';
import PromosScreen from './PromosScreen';
import InstructionsScreen from './InstructionsScreen';

export default function DynamicInformationRoute() {
  const { screenId } = useLocalSearchParams<{ screenId: string }>();

  const information = useInformationStore(state => state.information);

  const currentService = information?.[
    screenId as keyof typeof information
  ];

  return (
    <View>
      <Stack.Screen
        options={{
          headerTitle: currentService?.title || 'Інформація',
        }}
      />

      {
        screenId === 'motivations' ? (
          <MotivationsScreen />
        ) 
        : screenId === 'instructions' ? (
          <InstructionsScreen />
        ) 
        : screenId === 'promos' ? (
          <PromosScreen />
        ) : ( <Text>Екран {screenId} не знайдено</Text> )
      }
    </View>
  );
}