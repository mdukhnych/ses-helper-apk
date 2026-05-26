import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export function useColorScheme(): ColorSchemeName {
  // Беремо поточне нативне значення системи в момент ініціалізації
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  useEffect(() => {
    // Підписуємося на будь-які зміни теми на рівні ОС
    const subscription = Appearance.addChangeListener((preferences) => {
      setColorScheme(preferences.colorScheme);
    });

    // На випадок, якщо додаток був у бекграунді, оновлюємо при монтуванні
    setColorScheme(Appearance.getColorScheme());

    return () => subscription.remove();
  }, []);

  // Завжди повертає свіжу тему: 'light' | 'dark'
  return colorScheme;
}