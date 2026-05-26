import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import DocViewer from '@/components/DocViewer';
import { Text } from '@/components/ui/text';
import {
  InformationCollectionKey,
  useInformationStore,
} from '@/store/useInformationStore';

type ViewerDocument = {
  id: string;
  title: string;
  url: string;
};

const normalizeParam = (param: string | string[] | undefined) => {
  if (Array.isArray(param)) return param[0];
  return param;
};

export default function DocumentViewer() {
  const params = useLocalSearchParams<{
    id?: string;
    collectionKey?: InformationCollectionKey;
  }>();

  const id = normalizeParam(params.id);
  const collectionKey = normalizeParam(params.collectionKey) as
    | InformationCollectionKey
    | undefined;

  const documentsDataStore = useInformationStore(
    state => state.documentsDataStore
  );

  const document = useMemo(() => {
    if (!id || !collectionKey) return undefined;

    return documentsDataStore[collectionKey]?.find(
      item => item.id === id
    ) as ViewerDocument | undefined;
  }, [id, collectionKey, documentsDataStore]);

  if (!id || !collectionKey) {
    return (
      <View className="flex-1 items-center justify-center px-4 bg-white">
        <Stack.Screen
          options={{
            headerTitle: 'Перегляд документа',
            headerTitleAlign: 'center',
          }}
        />

        <Text className="text-center">
          Не передано id або collectionKey
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

  if (!document.url) {
    return (
      <View className="flex-1 items-center justify-center px-4 bg-white">
        <Stack.Screen
          options={{
            headerTitle: document.title || 'Перегляд документа',
            headerTitleAlign: 'center',
          }}
        />

        <Text className="text-center">
          У документа немає посилання на файл
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: document.title || 'Перегляд документа',
          headerTitleAlign: 'center',
        }}
      />

      <DocViewer url={document.url} />
    </View>
  );
}