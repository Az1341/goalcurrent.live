export {
  getFirebaseWebConfig,
  isFirebaseConfigured,
  isFirebaseMessagingConfigured,
  type FirebaseWebConfig,
} from "@/lib/firebase/config";
export {
  getFirebaseApp,
  getFirebaseAuth,
  getFirebaseMessaging,
  signInWithGoogle,
  signInWithApple,
  signOut,
  registerFcmServiceWorker,
  requestFcmToken,
  listenForForegroundMessages,
} from "@/lib/firebase/client";
