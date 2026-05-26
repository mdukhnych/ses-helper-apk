import { ColorSchemeName } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { ThemeMode, useThemeStore } from '@/store/useThemeStore';

export type AppColorScheme = Exclude<ColorSchemeName, null | undefined>;

export function resolveAppColorScheme(
  mode: ThemeMode,
  systemColorScheme: ColorSchemeName
): AppColorScheme {
  if (mode === 'system') {
    return systemColorScheme ?? 'light';
  }

  return mode;
}

export function useAppColorScheme(): AppColorScheme {
  const mode = useThemeStore(state => state.mode);
  const systemColorScheme = useColorScheme();

  return resolveAppColorScheme(mode, systemColorScheme);
}
