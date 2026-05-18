import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Member } from "../../lib/types/member";

const AUTH_STORAGE_KEY = "memberData";

interface GlobalsValue {
  authMember: Member | null;
  setAuthMember: (member: Member | null) => void;
}

const GlobalsContext = createContext<GlobalsValue | undefined>(undefined);

const readStoredMember = (): Member | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Member) : null;
  } catch {
    return null;
  }
};

export function GlobalProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [authMember, setAuthMemberState] = useState<Member | null>(
    readStoredMember,
  );

  /** Wrap the setter so every update keeps localStorage in sync. */
  const setAuthMember = useCallback((member: Member | null) => {
    if (member) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(member));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setAuthMemberState(member);
  }, []);

  /** Cross-tab sync: react to other tabs logging in/out. */
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== AUTH_STORAGE_KEY) return;
      setAuthMemberState(readStoredMember());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo<GlobalsValue>(
    () => ({ authMember, setAuthMember }),
    [authMember, setAuthMember],
  );

  return (
    <GlobalsContext.Provider value={value}>{children}</GlobalsContext.Provider>
  );
}

export function useGlobals(): GlobalsValue {
  const ctx = useContext(GlobalsContext);
  if (!ctx) {
    throw new Error("useGlobals must be used inside <GlobalProvider>");
  }
  return ctx;
}
