import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import DocViewer from '@/components/DocViewer';
import { Text } from '@/components/ui/text';
import { resolveDocumentUrl } from '@/utils/resolveDocumentUrl';

const normalizeParam = (param: string | string[] | undefined) => {
  if (Array.isArray(param)) return param[0];
  return param;
};

export default function WarrantiesDocumentViewer() {
  const params = useLocalSearchParams<{
    title?: string;
    url?: string;
  }>();

  const title = normalizeParam(params.title) || 'Перегляд документа';
  const sourceUrl = normalizeParam(params.url);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setResolvedUrl(null);
    setErrorMessage(null);

    if (!sourceUrl) return;

    resolveDocumentUrl(sourceUrl)
      .then(url => {
        if (isMounted) setResolvedUrl(url);
      })
      .catch(error => {
        console.log('Warranty document URL resolve error:', error);
        if (isMounted) {
          setErrorMessage('Не вдалося отримати посилання на файл');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [sourceUrl]);

  if (!sourceUrl) {
    return (
      <View className="flex-1 items-center justify-center px-4 bg-white">
        <Stack.Screen
          options={{
            headerTitle: title,
            headerTitleAlign: 'center',
          }}
        />

        <Text className="text-center">
          У пам'ятки немає посилання на файл
        </Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View className="flex-1 items-center justify-center px-4 bg-white">
        <Stack.Screen
          options={{
            headerTitle: title,
            headerTitleAlign: 'center',
          }}
        />

        <Text className="text-center">{errorMessage}</Text>
      </View>
    );
  }

  if (!resolvedUrl) {
    return (
      <View className="flex-1 items-center justify-center px-4 bg-white">
        <Stack.Screen
          options={{
            headerTitle: title,
            headerTitleAlign: 'center',
          }}
        />

        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: title,
          headerTitleAlign: 'center',
        }}
      />

      <DocViewer url={resolvedUrl} fileType="pdf" />
    </View>
  );
}
