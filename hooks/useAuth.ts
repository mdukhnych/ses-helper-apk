import { FIREBASE_AUTH, FIREBASE_AUTH_READY, FIREBASE_FIRESTORE } from '@/firebaseConfig';
import { useUserStore, User } from '@/store/useUserStore';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useState } from 'react';
import { useAuthToast } from './useAuthToast';

function getLoginErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return "Невірний формат email.";
      case "auth/missing-password":
        return "Введіть пароль.";
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Невірний email або пароль.";
      case "auth/user-disabled":
        return "Цей акаунт вимкнено.";
      case "auth/too-many-requests":
        return "Забагато спроб входу. Спробуйте пізніше.";
      case "auth/network-request-failed":
        return "Немає з'єднання з мережею.";
      default:
        return "Не вдалося авторизуватися. Спробуйте ще раз.";
    }
  }

  return "Не вдалося авторизуватися. Спробуйте ще раз.";
}

export default function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const updateUserStore = useUserStore(state => state.updateUser);
  const resetUserStore = useUserStore(state => state.resetUser);
  const showAuthToast = useAuthToast();

  const router = useRouter();

  const login = useCallback(async ({email, password}: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      await FIREBASE_AUTH_READY;
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;
      const userData = await getDoc(doc(FIREBASE_FIRESTORE, "users", user.uid));

      if (userData.exists()) {
        updateUserStore({
          ...(userData.data() as User),
          id: user.uid,
        });
        showAuthToast({
          action: "success",
          title: "Вхід виконано",
          description: "Авторизація пройшла успішно.",
        });
        router.replace("/(tabs)/ServicesScreen");
      } else {
        showAuthToast({
          action: "error",
          title: "Помилка входу",
          description: "Дані користувача не знайдено.",
        });
        console.log("No such document!");
      }
    } catch (error) {
      showAuthToast({
        action: "error",
        title: "Помилка входу",
        description: getLoginErrorMessage(error),
      });
      console.log("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router, showAuthToast, updateUserStore]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await FIREBASE_AUTH_READY;
      await signOut(FIREBASE_AUTH);
      showAuthToast({
        action: "success",
        title: "Вихід виконано",
        description: "Ви вийшли з акаунта.",
      });
      router.replace("/");
      resetUserStore();
    } catch (error) {
      showAuthToast({
        action: "error",
        title: "Помилка виходу",
        description: "Не вдалося вийти з акаунта. Спробуйте ще раз.",
      });
      console.log("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendChangePasswordEmail = async () => {
    setIsLoading(true);
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user?.email) {
        throw new Error("Користувач не авторизований або email відсутній");
      }

      await sendPasswordResetEmail(FIREBASE_AUTH, user.email);
      showAuthToast({
        action: "success",
        title: "Лист відпралено",
        description: "Вам надіслано лист на пошту. Перейдіть за посиланням для зміни пароля.",
      });
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  return {
    isLoading,
    login,
    logout,
    sendChangePasswordEmail
  }
}
