import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function _layout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerTitleAlign: "center" }}>
      <Tabs.Screen
        name="WarrantyScreen"
        options={{
          title: 'Гарантійний захист SES',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="th" color={color} />,
        }}
      />
      <Tabs.Screen
        name="InformationScreen"
        options={{
          title: 'Інформація',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="info-circle" color={color} />,
        }}
      />
    </Tabs>
  )
}