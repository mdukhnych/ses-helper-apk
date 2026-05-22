import React from 'react'
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable } from '@/components/ui/pressable';
import { Icon, MoonIcon, SlashIcon, SunIcon } from '@/components/ui/icon';
import { useThemeStore } from '@/store/useThemeStore';
import { useColorScheme } from '@/components/useColorScheme';
import { SunMoon } from 'lucide-react-native';

export default function _layout() {
  const { mode, setMode } = useThemeStore(state => state);

  const handleToggleTheme = () => {
    if (mode === 'system') setMode('light');
    else if (mode === 'light') setMode('dark');
    else setMode('system');
  };
  
  const systemColorScheme = useColorScheme();
  const effectiveColorScheme = mode === 'system'
    ? (systemColorScheme ?? 'light')
    : mode;
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: 'blue', 
      headerTitleAlign: "center", 
      headerRight: () => (
        <Pressable onPress={handleToggleTheme} className="mr-4">
          <Icon
            as={
              mode === "system"
                ? SunMoon
                : effectiveColorScheme === "dark"
                ? MoonIcon
                : SunIcon
            }
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