import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from '@/components/ui/select';
import { ChevronDownIcon } from '@/components/ui/icon';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { ThemeMode, useThemeStore } from '@/store/useThemeStore';
import useAuth from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBackdrop,
} from '@/components/ui/alert-dialog';
import { Heading } from '@/components/ui/heading';
import { Item } from 'react-stately';
import { Stack, useLocalSearchParams } from 'expo-router';

const themeOptions: { label: string; value: ThemeMode }[] = [
  { label: 'Системна', value: 'system' },
  { label: 'Світла', value: 'light' },
  { label: 'Темна', value: 'dark' },
];

function isThemeMode(value: string): value is ThemeMode {
  return themeOptions.some(option => option.value === value);
}

type alertDialog = {
  show: boolean;
  item: "password" | "logout" | null;
}

export default function SettingsScreen() {
  const [alertDialog, setAlertDialog] = React.useState<alertDialog>({
    show: false,
    item: null
  });
  const mode = useThemeStore(state => state.mode);
  const setMode = useThemeStore(state => state.setMode);
  const selectedThemeLabel =
    themeOptions.find(option => option.value === mode)?.label ??
    themeOptions[0].label;

  const { logout, isLoading, sendChangePasswordEmail } = useAuth();

  const handleClose = () => setAlertDialog({show: false, item: null});
  const handleOpen = (item: "password" | "logout" | null) => setAlertDialog({show: true, item});
  const onConfirm = async () => {
    if (alertDialog.item === "logout") {
      await logout();
    }
    if (alertDialog.item === "password") {
      await sendChangePasswordEmail();
      handleClose();
    }
  }

  return (
    <Box 
      className="flex-1 gap-6 p-4"
      style={{ paddingBottom: 30 }}
    >
      <Stack.Screen options={{headerTitle: "Налаштування"}} />
      <Box className="gap-2">
        <Text className="text-lg font-medium">Тема додатку:</Text>

        <Select
          key={mode}
          selectedValue={mode}
          selectedLabel={selectedThemeLabel}
          onValueChange={(value) => {
            if (isThemeMode(value)) {
              setMode(value);
            }
          }}
        >
          <SelectTrigger
            variant="outline"
            size="md"
            className="flex-row justify-between"
          >
            <SelectInput
              placeholder="Виберіть тему..."
              value={selectedThemeLabel}
            />
            <SelectIcon className="mr-3" as={ChevronDownIcon} />
          </SelectTrigger>

          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>

              {/* Значення (value) точно відповідають типам 'system' | 'light' | 'dark' зі стору */}
              {themeOptions.map(option => (
                <SelectItem
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </Box>

      <Box className="gap-4 mt-auto">
        <Button variant="outline" onPress={() => handleOpen("password")}>
          <ButtonText>Змінити пароль</ButtonText>
        </Button>

        {/* action="negative" зробить кнопку червоною, що добре підходить для логауту (якщо ваша тема це підтримує) */}
        <Button action="negative" onPress={() => handleOpen("logout")}>
          <ButtonText>Вийти</ButtonText>
        </Button>

        <AlertDialog isOpen={alertDialog.show} onClose={handleClose} size="sm">
          <AlertDialogBackdrop />
          <AlertDialogContent className="gap-6">
            <AlertDialogHeader>
              <Heading className="text-typography-950 font-semibold" size="md">
                { alertDialog.item === "password" && "Ви бажаєте змінити пароль?" }
                { alertDialog.item === "logout" && "Ви бажаєте вийти?" }
              </Heading>
            </AlertDialogHeader>
            <AlertDialogFooter className="">
              <Button
                variant="outline"
                action="secondary"
                onPress={handleClose}
                size="sm"
              >
                <ButtonText>Ні</ButtonText>
              </Button>
              <Button size="sm" onPress={onConfirm}>
                { isLoading && <Spinner /> }
                <ButtonText>Так</ButtonText>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </Box>
    </Box>
  );
}
