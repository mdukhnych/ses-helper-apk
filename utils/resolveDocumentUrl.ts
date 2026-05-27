import { getDownloadURL, ref } from 'firebase/storage';

import { FIREBASE_STORAGE } from '@/firebaseConfig';

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

export const resolveDocumentUrl = async (rawUrl: string) => {
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
