"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  getFirebaseAuth,
  signInWithApple,
  signInWithGoogle,
  signOut as firebaseSignOut,
} from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";

type FirebaseAuthContextValue = {
  enabled: boolean;
  user: User | null;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  signInApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

const FirebaseAuthContext = createContext<FirebaseAuthContextValue>({
  enabled: false,
  user: null,
  loading: false,
  signInGoogle: async () => {},
  signInApple: async () => {},
  signOut: async () => {},
});

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const enabled = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (typeof window !== "undefined") {
        const detail = nextUser
          ? {
              uid: nextUser.uid,
              email: nextUser.email,
              displayName: nextUser.displayName,
            }
          : null;

        window.dispatchEvent(
          new CustomEvent("gc:firebase-auth", { detail }),
        );

        window.AndroidBridge?.onAuthStateChanged?.(
          JSON.stringify(detail),
        );
      }
    });

    return unsubscribe;
  }, [enabled]);

  const signInGoogle = useCallback(async () => {
    await signInWithGoogle();
  }, []);

  const signInApple = useCallback(async () => {
    await signInWithApple();
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut();
  }, []);

  const value = useMemo(
    () => ({
      enabled,
      user,
      loading,
      signInGoogle,
      signInApple,
      signOut,
    }),
    [enabled, user, loading, signInGoogle, signInApple, signOut],
  );

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth(): FirebaseAuthContextValue {
  return useContext(FirebaseAuthContext);
}
