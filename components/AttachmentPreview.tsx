import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  View,
} from 'react-native';
import * as XLSX from 'xlsx';

import { Text } from '@/components/ui/text';

type AttachmentPreviewProps = {
  url?: string | null;
};

type FileType = 'image' | 'excel' | 'unknown';

type TableData = Array<Array<string | number | boolean | null>>;

function getFileType(url: string): FileType {
  const lowerUrl = url.toLowerCase();

  if (
    lowerUrl.includes('.jpg') ||
    lowerUrl.includes('.jpeg') ||
    lowerUrl.includes('.png') ||
    lowerUrl.includes('.webp') ||
    lowerUrl.includes('.gif')
  ) {
    return 'image';
  }

  if (
    lowerUrl.includes('.xlsx') ||
    lowerUrl.includes('.xls') ||
    lowerUrl.includes('.csv')
  ) {
    return 'excel';
  }

  return 'unknown';
}

export default function AttachmentPreview({ url }: AttachmentPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<TableData>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileType = useMemo(() => {
    if (!url) return 'unknown';
    return getFileType(url);
  }, [url]);

  useEffect(() => {
    if (!url || fileType !== 'excel') return;

    const loadExcelFile = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        /**
         * Важливо:
         * Не робимо decodeURIComponent(url), бо Firebase Storage URL може зламатись.
         */
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Помилка завантаження файлу: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();

        const workbook = XLSX.read(arrayBuffer, {
          type: 'array',
        });

        const firstSheetName = workbook.SheetNames[0];
        const firstSheet = workbook.Sheets[firstSheetName];

        const rows = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
          defval: '',
        }) as TableData;

        setTableData(rows);
      } catch (error) {
        console.log('Excel preview error:', error);
        setErrorMessage('Не вдалося відкрити таблицю');
      } finally {
        setIsLoading(false);
      }
    };

    loadExcelFile();
  }, [url, fileType]);

  if (!url) {
    return null;
  }

  if (fileType === 'image') {
    return (
      <View className="mt-4 overflow-hidden rounded-xl border border-outline-200 bg-background-0">
        <Image
          source={{ uri: url }}
          resizeMode="contain"
          className="w-full h-72"
          onError={(error) => {
            console.log('Image preview error:', error.nativeEvent);
          }}
        />
      </View>
    );
  }

  if (fileType === 'excel') {
    return (
      <View className="mt-4 rounded-xl border border-outline-200 bg-background-0 p-2">
        {isLoading && (
          <View className="h-32 items-center justify-center">
            <ActivityIndicator />
            <Text className="mt-2">Завантаження таблиці...</Text>
          </View>
        )}

        {!isLoading && errorMessage && (
          <View className="h-32 items-center justify-center px-4">
            <Text className="text-center">{errorMessage}</Text>
          </View>
        )}

        {!isLoading && !errorMessage && tableData.length > 0 && (
          <ScrollView horizontal>
            <View>
              {tableData.map((row, rowIndex) => (
                <View key={rowIndex} className="flex-row">
                  {row.map((cell, cellIndex) => (
                    <View
                      key={`${rowIndex}-${cellIndex}`}
                      className="min-w-32 border border-outline-200 px-2 py-2"
                    >
                      <Text
                        size="sm"
                        className={rowIndex === 0 ? 'font-bold' : ''}
                      >
                        {String(cell ?? '')}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {!isLoading && !errorMessage && tableData.length === 0 && (
          <View className="h-32 items-center justify-center px-4">
            <Text className="text-center">Таблиця порожня</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="mt-4 rounded-xl border border-outline-200 p-4">
      <Text className="text-center">
        Цей тип файлу поки не підтримується для перегляду
      </Text>
    </View>
  );
}