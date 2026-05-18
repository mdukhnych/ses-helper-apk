import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MoonIcon, SunIcon, SlashIcon, Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Fab, FabIcon } from '@/components/ui/fab';

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [styleLoaded, setStyleLoaded] = useState(false);
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<'system' | 'light' | 'dark'>('system');

  const effectiveColorScheme = mode === 'system'
    ? (systemColorScheme ?? 'light')
    : mode;

  const handleToggleTheme = () => {
    if (mode === 'system') {
      setMode('light');
    } else if (mode === 'light') {
      setMode('dark');
    } else {
      setMode('system');
    }
  };

  return (
    <GluestackUIProvider mode={mode}>
      <ThemeProvider value={effectiveColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar/>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Вхід",
              headerTitleAlign: "center",
              headerRight: () => (
                <Pressable onPress={handleToggleTheme}>
                  <Icon
                    as={
                      mode === "system"
                        ? SlashIcon
                        : effectiveColorScheme === "dark"
                        ? MoonIcon
                        : SunIcon
                    }
                    size="lg"
                  />
                </Pressable>
              ),
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>

        {/* <Fab onPress={handleToggleTheme} className="m-6" size="lg" > <FabIcon as={mode === 'system' ? SlashIcon : (effectiveColorScheme === 'dark' ? MoonIcon : SunIcon)} /> </Fab> */}
      </ThemeProvider>
    </GluestackUIProvider>
  );
}