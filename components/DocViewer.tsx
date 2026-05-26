import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  View,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { Text } from '@/components/ui/text';

type DocViewerProps = {
  url: string;
};

type FileType = 'pdf' | 'image' | 'unknown';

export default function DocViewer({ url }: DocViewerProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileType = useMemo<FileType>(() => {
    if (!url) return 'unknown';

    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('.pdf')) return 'pdf';

    if (
      lowerUrl.includes('.jpg') ||
      lowerUrl.includes('.jpeg') ||
      lowerUrl.includes('.png') ||
      lowerUrl.includes('.webp') ||
      lowerUrl.includes('.gif')
    ) {
      return 'image';
    }

    return 'unknown';
  }, [url]);

  if (!url) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text>Файл не знайдено</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-center">{errorMessage}</Text>
      </View>
    );
  }

  if (fileType === 'image') {
    return (
      <View className="flex-1 bg-white">
        {isImageLoading && (
          <View className="absolute inset-0 items-center justify-center">
            <ActivityIndicator />
          </View>
        )}

        <Image
          source={{ uri: url }}
          resizeMode="contain"
          className="w-full h-full"
          onLoadStart={() => setIsImageLoading(true)}
          onLoadEnd={() => setIsImageLoading(false)}
          onError={(error) => {
            console.log('Image error:', error.nativeEvent);
            setIsImageLoading(false);
            setErrorMessage('Не вдалося відкрити зображення');
          }}
        />
      </View>
    );
  }

  if (fileType === 'pdf') {
    return (
      <View className="flex-1 bg-white">
        <Pdf
          source={{
            uri: url,
            cache: true,
          }}
          trustAllCerts={false}
          renderActivityIndicator={() => <ActivityIndicator />}
          onLoadComplete={(numberOfPages) => {
            console.log(`PDF loaded. Pages: ${numberOfPages}`);
          }}
          onError={(error) => {
            console.log('PDF error:', error);
            setErrorMessage('Не вдалося відкрити PDF-файл');
          }}
          style={{
            flex: 1,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center px-4">
      <Text className="text-center">Невідомий тип файлу</Text>
    </View>
  );
}