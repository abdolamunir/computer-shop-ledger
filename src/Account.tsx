import { useEffect, useRef, useState } from "react";
import { CaretDown, SignIn, SignOut } from "@phosphor-icons/react";
import { firstNameOf, useAuth } from "./useAuth";

export function Account() {
  const { user, ready, busy, error, enabled, signInGoogle, signOutGoogle } = useAuth();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [user?.uid]);

  if (!enabled || !ready) return null;

  if (user) {
    const label = firstNameOf(user) || "Signed in";
    return (
      <div className="account" ref={wrap}>
        <button
          className="account-menu"
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={label}
          disabled={busy}
          onClick={() => setOpen((next) => !next)}
        >
          {user.photoURL ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" /> : null}
          <span className="account-name">{label}</span>
          <CaretDown className="account-caret" size={12} weight="bold" aria-hidden />
        </button>
        {open ? (
          <div className="account-drop" role="menu">
            <button
              type="button"
              role="menuitem"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                void signOutGoogle();
              }}
            >
              <SignOut size={16} weight="bold" aria-hidden />
              Sign out
            </button>
          </div>
        ) : null}
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
