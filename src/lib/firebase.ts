import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Shortcut } from '@/types/shortcut';

const requireEnvVar = (name: string): string => {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`環境変数${name}が設定されていません。.envファイルを確認してください。`);
  }
  return value;
};

const firebaseConfig = {
  apiKey: requireEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: requireEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: requireEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: requireEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requireEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requireEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: requireEnvVar('VITE_FIREBASE_MEASUREMENT_ID'),
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// GoogleAuthProviderの設定
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google認証エラー:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('ログアウトエラー:', error);
    throw new Error('ログアウトに失敗しました。');
  }
};

export const addShortcut = async (shortcut: Omit<Shortcut, 'id'>) => {
  if (!auth.currentUser) throw new Error('ログインが必要です');

  try {
    const docRef = await addDoc(collection(db, 'shortcuts'), {
      ...shortcut,
      createdAt: new Date().toISOString(),
      isDeleted: false,
      userId: auth.currentUser.uid,
    });
    return docRef.id;
  } catch (error) {
    console.error('ショートカット追加エラー:', error);
    throw new Error('ショートカットの追加に失敗しました。');
  }
};

export const getShortcuts = async (): Promise<Shortcut[]> => {
  if (!auth.currentUser) throw new Error('ログインが必要です');

  try {
    const querySnapshot = await getDocs(collection(db, 'shortcuts'));
    return querySnapshot.docs
      .filter((doc) => doc.data().userId === auth.currentUser?.uid)
      .map((doc) => ({ id: doc.id, ...doc.data() } as Shortcut))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } catch (error) {
    console.error('ショートカット取得エラー:', error);
    throw new Error('ショートカットの取得に失敗しました。');
  }
};

export const updateShortcut = async (shortcut: Shortcut) => {
  if (!auth.currentUser) throw new Error('ログインが必要です');

  try {
    const shortcutRef = doc(db, 'shortcuts', shortcut.id);
    const { ...updateData } = shortcut;
    await updateDoc(shortcutRef, updateData);
    return true;
  } catch (error) {
    console.error('ショートカット更新エラー:', error);
    throw new Error('ショートカットの更新に失敗しました。');
  }
};

export const softDeleteShortcut = async (shortcutId: string) => {
  if (!auth.currentUser) throw new Error('ログインが必要です');

  try {
    const shortcutRef = doc(db, 'shortcuts', shortcutId);
    await updateDoc(shortcutRef, { isDeleted: true });
    return true;
  } catch (error) {
    console.error('ショートカット削除エラー:', error);
    throw new Error('ショートカットの削除に失敗しました。');
  }
};

export const undoDeleteShortcut = async (shortcutId: string) => {
  if (!auth.currentUser) throw new Error('ログインが必要です');

  try {
    const shortcutRef = doc(db, 'shortcuts', shortcutId);
    await updateDoc(shortcutRef, { isDeleted: false });
    return true;
  } catch (error) {
    console.error('削除取り消しエラー:', error);
    throw new Error('削除の取り消しに失敗しました。');
  }
};

const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/popup-closed-by-user':
      return 'ログインがキャンセルされました。';
    case 'auth/popup-blocked':
      return 'ポップアップがブロックされました。ポップアップを許可してください。';
    case 'auth/cancelled-popup-request':
      return 'ログインリクエストがキャンセルされました。';
    case 'auth/account-exists-with-different-credential':
      return '別の認証方法で既にアカウントが存在します。';
    case 'auth/invalid-api-key':
      return 'APIキーが無効です。環境変数を確認してください。';
    default:
      return '認証エラーが発生しました。';
  }
};

export { auth, db };
