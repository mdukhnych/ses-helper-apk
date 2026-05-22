import { useCallback } from 'react';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';

type AuthToastAction = 'success' | 'error' | 'warning' | 'info' | 'muted';

type AuthToastParams = {
  title: string;
  description?: string;
  action?: AuthToastAction;
};

export function useAuthToast() {
  const toast = useToast();

  return useCallback(({ title, description, action = 'info' }: AuthToastParams) => {
    toast.show({
      placement: 'top',
      duration: 3500,
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action={action} variant="solid">
          <ToastTitle>{title}</ToastTitle>
          {description ? <ToastDescription>{description}</ToastDescription> : null}
        </Toast>
      ),
    });
  }, [toast]);
}
