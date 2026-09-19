import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { firebaseReady, getFirebaseAuth, googleProvider } from "./firebase";
import { attachCloud } from "./useBooks";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!firebaseReady);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setReady(true);
      void attachCloud(next?.uid ?? null);
    });
  }, []);

  async function signInGoogle() {
    const auth = getFirebaseAuth();
    if (!auth) {
      setError("Cloud save is not set up yet.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function signOutGoogle() {
    const auth = getFirebaseAuth();
    if (!auth) return;
    setBusy(true);
    setError("");
    try {
      await signOut(auth);
    } finally {
      setBusy(false);
    }
  }

  return { user, ready, busy, error, enabled: firebaseReady, signInGoogle, signOutGoogle };
}

function authMessage(err: unknown) {
  const code = typeof err === "object" && err && "code" in err ? String((err as { code: string }).code) : "";
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return "Sign-in was cancelled.";
  }
  if (code === "auth/popup-blocked") return "Allow popups, then try Google again.";
  if (code === "auth/unauthorized-domain") return "This site is not allowed for Google sign-in yet.";
  return err instanceof Error ? err.message : "Google sign-in failed.";
}
