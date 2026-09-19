import { SignIn, SignOut } from "@phosphor-icons/react";
import { useAuth } from "./useAuth";

export function Account() {
  const { user, ready, busy, error, enabled, signInGoogle, signOutGoogle } = useAuth();
  if (!enabled || !ready) return null;

  if (user) {
    return (
      <div className="account">
        <span className="account-who">
          {user.photoURL ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" /> : null}
          <span>{user.displayName?.split(" ")[0] || user.email || "Signed in"}</span>
        </span>
        <button className="key round" type="button" onClick={() => void signOutGoogle()} disabled={busy}>
          <SignOut size={16} weight="bold" aria-hidden />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="account">
      <button className="key round" type="button" onClick={() => void signInGoogle()} disabled={busy}>
        <SignIn size={16} weight="bold" aria-hidden />
        {busy ? "Signing in…" : "Google"}
      </button>
      {error ? <p className="err account-err">{error}</p> : null}
    </div>
  );
}
