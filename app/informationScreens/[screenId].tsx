import { View, Text } from 'react-native';
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useInformationStore } from '@/store/useInformationStore';
import MotivationsScreen from './MotivationsScreen';
import InformationScreen from '../(tabs)/InformationScreen';
import PromosScreen from './PromosScreen';
import InstructionsScreen from './InstructionsScreen';

export default function DynamicInformationRoute() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();

  const information = useInformationStore(state => state.information);

  const currentService = information?.[
    serviceId as keyof typeof information
  ];

  return (
    <View>
      <Stack.Screen
        options={{
          headerTitle: currentService?.title || 'Інформація',
        }}
      />

      {
        serviceId === 'motivations' ? (
          <MotivationsScreen />
        ) 
        : serviceId === 'instructions' ? (
          <InstructionsScreen />
        ) 
        : serviceId === 'promos' ? (
          <PromosScreen />
        ) : ( <Text>Сервіс із ID {serviceId} не знайдено</Text> )
      }
    </View>
  );
}