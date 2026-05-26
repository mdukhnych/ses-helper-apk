import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { getDownloadURL, ref } from 'firebase/storage';

import DocViewer from '@/components/DocViewer';
import { Text } from '@/components/ui/text';
import { FIREBASE_STORAGE } from '@/firebaseConfig';
import { useServicesStore } from '@/store/useServicesStore';

const normalizeParam = (param: string | string[] | undefined) => {
  if (Array.isArray(param)) return param[0];
  return param;
};

const hasUrlScheme = (value: string) => /^[a-z][a-z\d+.-]*:/i.test(value);

const isFirebaseStorageUrl = (value: string) =>
  value.includes('firebasestorage.googleapis.com') ||
  value.includes('storage.googleapis.com') ||
  value.includes('firebasestorage.app');

const withMediaAlt = (value: string) => {
  try {
    const url = new URL(value);

    if (!url.searchParams.has('alt')) {
      url.searchParams.set('alt', 'media');
    }

    return url.toString();
  } catch {
    return value;
  }
};

const resolveDocumentUrl = async (rawUrl: string) => {
  const url = rawUrl.trim();

  if (!url) return '';

  if (url.startsWith('gs://')) {
    return getDownloadURL(ref(FIREBASE_STORAGE, url));
  }

  if (isFirebaseStorageUrl(url)) {
    try {
      return await getDownloadURL(ref(FIREBASE_STORAGE, url.split('?')[0]));
    } catch {
      return withMediaAlt(url);
    }
  }

  if (!hasUrlScheme(url)) {
    return getDownloadURL(ref(FIREBASE_STORAGE, url));
  }

  return url;
};

export default function EktaDocumentViewer() {
  const params = useLocalSearchParams<{
    groupId?: string;
    documentId?: string;
  }>();

  const groupId = normalizeParam(params.groupId);
  const documentId = normalizeParam(params.documentId);
  const ektaServicesData = useServicesStore(state => state.ektaServicesStore);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const document = useMemo(() => {
    if (!groupId || !documentId) return undefined;

    return ektaServicesData
      .find(group => group.id === groupId)
      ?.list.find(item => item.id === documentId);
  }, [documentId, ektaServicesData, groupId]);

  const title = document?.title || 'Перегляд документа';
  const sourceUrl = document?.description;

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
        console.log('EKTA document URL resolve error:', error);
        if (isMounted) {
          setErrorMessage('Не вдалося отримати посилання на файл');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [sourceUrl]);

  if (!groupId || !documentId) {
    return (
      <View className="flex-1 items-center justify-center px-4 bg-white">
        <Stack.Screen
          options={{
            headerTitle: 'Перегляд документа',
            headerTitleAlign: 'center',
          }}
        />

        <Text className="text-center">
          Не передано дані документа
        </Text>
      </View>
    );
  }

  if (!document) {
    return (
      <View className="flex-1 items-center justify-center px-4 bg-white">
        <Stack.Screen
          options={{
            headerTitle: 'Перегляд документа',
            headerTitleAlign: 'center',
          }}
        />

        <Text className="text-center">
          Документ не знайдено
        </Text>
      </View>
    );
  }

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
          У послуги немає посилання на файл
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
