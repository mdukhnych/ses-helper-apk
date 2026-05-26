import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import * as XLSX from 'xlsx';

import { Text } from '@/components/ui/text';
import { useInformationStore } from '@/store/useInformationStore';

type FileType = 'image' | 'excel' | 'unknown';
type TableData = Array<Array<string | number | boolean | null>>;

const normalizeParam = (param: string | string[] | undefined) => {
  if (Array.isArray(param)) return param[0];
  return param;
};

const getFileType = (url: string): FileType => {
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
};

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildImageHtml = (url: string) => `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=0.5, maximum-scale=8, user-scalable=yes" />
      <style>
        html,
        body {
          margin: 0;
          padding: 0;
          min-width: 100%;
          min-height: 100%;
          background: #ffffff;
        }

        body {
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }

        .stage {
          min-width: 100vw;
          min-height: 100vh;
          padding: 12px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        img {
          display: block;
          width: 100%;
          height: auto;
          max-width: none;
        }
      </style>
    </head>
    <body>
      <main class="stage">
        <img src="${escapeHtml(url)}" />
      </main>
    </body>
  </html>
`;

const buildExcelHtml = (rows: TableData) => `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=0.5, maximum-scale=8, user-scalable=yes" />
      <style>
        html,
        body {
          margin: 0;
          padding: 0;
          background: #ffffff;
          color: #111827;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        body {
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }

        .sheet {
          padding: 12px;
          width: max-content;
          min-width: 100vw;
        }

        table {
          border-collapse: collapse;
          table-layout: auto;
          background: #ffffff;
        }

        td {
          min-width: 128px;
          max-width: 360px;
          padding: 8px 10px;
          border: 1px solid #e5e7eb;
          vertical-align: top;
          font-size: 14px;
          line-height: 1.35;
          white-space: pre-wrap;
          word-break: break-word;
        }

        tr:first-child td {
          background: #f3f4f6;
          font-weight: 700;
        }
      </style>
    </head>
    <body>
      <main class="sheet">
        <table>
          <tbody>
            ${rows
              .map(
                row => `
                  <tr>
                    ${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>
      </main>
    </body>
  </html>
`;

export default function PromoAttachmentViewer() {
  const params = useLocalSearchParams<{
    id?: string;
  }>();
  const id = normalizeParam(params.id);
  const promos = useInformationStore(state => state.documentsDataStore.promos);
  const [tableData, setTableData] = useState<TableData>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const promo = useMemo(() => {
    if (!id) return undefined;
    return promos?.find(item => item.id === id);
  }, [id, promos]);

  const fileType = useMemo(() => {
    if (!promo?.sku) return 'unknown';
    return getFileType(promo.sku);
  }, [promo?.sku]);

  useEffect(() => {
    if (!promo?.sku || fileType !== 'excel') return;

    const loadExcelFile = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(promo.sku);

        if (!response.ok) {
          throw new Error(`File loading error: ${response.status}`);
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
        console.log('Promo attachment Excel viewer error:', error);
        setErrorMessage('Не вдалося відкрити таблицю');
      } finally {
        setIsLoading(false);
      }
    };

    loadExcelFile();
  }, [fileType, promo?.sku]);

  const headerTitle = promo?.title || 'Перегляд вкладення';

  if (!id) {
    return (
      <View className="flex-1 items-center justify-center px-4 bg-white">
        <Stack.Screen
          options={{
            headerTitle: 'Перегляд вкладення',
            headerTitleAlign: 'center',
          }}
        />

        <Text className="text-center">Не передано вкладення</Text>
      </View>
    );
  }

  if (!promo) {
    return (
      <View className="flex-1 items-center justify-center px-4 bg-white">
        <Stack.Screen
          options={{
            headerTitle: 'Перегляд вкладення',
            headerTitleAlign: 'center',
          }}
        />

        <Text className="text-center">Вкладення не знайдено</Text>
      </View>
    );
  }

  if (!promo.sku) {
    return (
      <View className="flex-1 items-center justify-center px-4 bg-white">
        <Stack.Screen
          options={{
            headerTitle,
            headerTitleAlign: 'center',
          }}
        />

        <Text className="text-center">У акції немає вкладення</Text>
      </View>
    );
  }

  if (fileType === 'unknown') {
    return (
      <View className="flex-1 items-center justify-center px-4 bg-white">
        <Stack.Screen
          options={{
            headerTitle,
            headerTitleAlign: 'center',
          }}
        />

        <Text className="text-center">
          Цей тип файлу поки не підтримується для перегляду
        </Text>
      </View>
    );
  }

  if (fileType === 'excel' && (isLoading || errorMessage || tableData.length === 0)) {
    return (
      <View className="flex-1 items-center justify-center px-4 bg-white">
        <Stack.Screen
          options={{
            headerTitle,
            headerTitleAlign: 'center',
          }}
        />

        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text className="text-center">
            {errorMessage || 'Таблиця порожня'}
          </Text>
        )}
      </View>
    );
  }

  const html =
    fileType === 'image'
      ? buildImageHtml(promo.sku)
      : buildExcelHtml(tableData);

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle,
          headerTitleAlign: 'center',
        }}
      />

      <WebView
        source={{ html }}
        originWhitelist={['*']}
        startInLoadingState
        scalesPageToFit
        setBuiltInZoomControls
        setDisplayZoomControls={false}
        nestedScrollEnabled
        showsHorizontalScrollIndicator
        showsVerticalScrollIndicator
        renderLoading={() => (
          <View className="absolute inset-0 items-center justify-center bg-white">
            <ActivityIndicator />
          </View>
        )}
        style={{ flex: 1, backgroundColor: '#ffffff' }}
      />
    </View>
  );
}
