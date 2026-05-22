import { getApp, getApps, initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
// @ts-ignore React Native persistence is provided by the Metro react-native condition.
import { getAuth, getReactNativePersistence, initializeAuth, setPersistence } from "@firebase/auth";
import type { Auth } from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const asyncStoragePersistence = getReactNativePersistence(AsyncStorage);
let authPersistenceReady: Promise<void> = Promise.resolve();

const createFirebaseAuth = (app: FirebaseApp): Auth => {
  try {
    return initializeAuth(app, {
      persistence: asyncStoragePersistence,
    });
  } catch (error) {
    if ((error as { code?: string }).code === "auth/already-initialized") {
      const auth = getAuth(app);

      authPersistenceReady = setPersistence(auth, asyncStoragePersistence).catch((persistenceError) => {
        console.log("Firebase auth persistence error:", persistenceError);
      });

      return auth;
    }

    throw error;
  }
};

export const FIREBASE_APP = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const FIREBASE_AUTH = createFirebaseAuth(FIREBASE_APP);
export const FIREBASE_AUTH_READY = authPersistenceReady;
export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
