import React from 'react'
import { Tabs, useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { Settings } from 'lucide-react-native';

export default function _layout() {
  const router = useRouter();

  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: 'blue', 
      headerTitleAlign: "center", 
      headerRight: () => (
        <Pressable onPress={() => router.push('/SettingsScreen')} className="mr-6">
          <Icon
            as={Settings}
            size="xl"
          />
        </Pressable>
      ),
    }}>
      <Tabs.Screen
        name="ServicesScreen"
        options={{
          title: 'Сервіси SES',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="apps" color={color} />,
        }}
      />
      <Tabs.Screen
        name="InformationScreen"
        options={{
          title: 'Інформація',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="information-variant-circle" color={color} />,
        }}
      />
    </Tabs>
  )
}
