import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MoonIcon, SunIcon, Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { onAuthStateChanged, User as FirebaseUser } from '@firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_AUTH_READY, FIREBASE_FIRESTORE } from '@/firebaseConfig';
import { useUserStore, User } from '@/store/useUserStore';
import { useAuthToast } from '@/hooks/useAuthToast';
import { View } from '@/components/Themed';
import { useThemeStore } from '@/store/useThemeStore';
import { SunMoon } from 'lucide-react-native';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  const isThemeHydrated = useThemeStore(state => state._hasHydrated);
  
  const updateUserStore = useUserStore(state => state.updateUser);
  const resetUserStore = useUserStore(state => state.resetUser);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const handleAuthState = useCallback(async (user: FirebaseUser | null) => {
    setAuthUser(user);
    if (user) {
      try {
        const userData = await getDoc(doc(FIREBASE_FIRESTORE, "users", user.uid));
        if (userData.exists()) {
          updateUserStore({ ...(userData.data() as User), id: user.uid });
        }
      } catch (error) {
        setAuthErrorMessage("Не вдалося відновити сесію користувача.");
        console.log("Auth restore error:", error);
      }
    } else {
      resetUserStore();
    }
    setIsAuthReady(true);
  }, [resetUserStore, updateUserStore]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    FIREBASE_AUTH_READY
      .then(() => FIREBASE_AUTH.authStateReady())
      .catch((error) => {
        setAuthErrorMessage("Не вдалося перевірити стан авторизації.");
        console.log("Auth state ready error:", error);
      })
      .finally(() => {
        if (!isMounted) return;
        unsubscribe = onAuthStateChanged(FIREBASE_AUTH, handleAuthState);
      });

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [handleAuthState]);

  useEffect(() => {
    if (!isAuthReady && FIREBASE_AUTH.currentUser) {
      handleAuthState(FIREBASE_AUTH.currentUser);
    }
  }, [handleAuthState, isAuthReady]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && isAuthReady && isThemeHydrated) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isAuthReady, isThemeHydrated]);

  if (!loaded || !isAuthReady || !isThemeHydrated) {
    return null;
  }

  return <RootLayoutNav authUser={authUser} authErrorMessage={authErrorMessage} />;
}

function AuthErrorToast({ message }: { message: string | null }) {
  const showAuthToast = useAuthToast();
  useEffect(() => {
    if (!message) return;
    showAuthToast({ action: "error", title: "Помилка авторизації", description: message });
  }, [message, showAuthToast]);
  return null;
}

function RootLayoutNav({
  authUser,
  authErrorMessage,
}: {
  authUser: FirebaseUser | null;
  authErrorMessage: string | null;
}) {
  const systemColorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const rootSegment = segments[0];

  const mode = useThemeStore(state => state.mode);
  const setMode = useThemeStore(state => state.setMode);

  const effectiveColorScheme = mode === 'system' ? (systemColorScheme ?? 'light') : mode;

  useEffect(() => {
    const isInTabs = rootSegment === '(tabs)';
    const isInServices = rootSegment === 'servicesScreens';
    const isInInformation = rootSegment === 'informationScreens';

    if (authUser && !isInTabs && !isInServices && !isInInformation) {
      router.replace('/(tabs)/ServicesScreen');
    }
    if (!authUser && (isInTabs || isInServices || isInInformation)) {
      router.replace('/');
    }
  }, [authUser, router, rootSegment]);

  const handleToggleTheme = () => {
    if (mode === 'system') setMode('light');
    else if (mode === 'light') setMode('dark');
    else setMode('system');
  };

  return (
    <GluestackUIProvider mode={effectiveColorScheme}>
      <AuthErrorToast message={authErrorMessage} />
      <ThemeProvider value={effectiveColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View
          style={{
            flex: 1,
            backgroundColor: effectiveColorScheme === "dark" ? "#000" : "#fff",
          }}
        >
          <StatusBar style={effectiveColorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack 
            screenOptions={{
              animation: "ios_from_right",
              contentStyle: {
                backgroundColor: effectiveColorScheme === "dark" ? "#000" : "#fff",
              },
              headerRight: () => (
                  <Pressable onPress={handleToggleTheme}>
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
            <Stack.Screen
              name="index"
              options={{
                title: "Вхід",
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </View>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}