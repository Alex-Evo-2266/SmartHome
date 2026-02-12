import { Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@src/shared/lib/hooks/redux";
import { LOGIN_URL } from "@src/const";

export const AuthGate = () => {
  const { isAuthenticated, isInitialized } = useAppSelector(
    (s) => s.auth
  );

  const location = useLocation();

  // ⏳ ждём инициализацию
  if (!isInitialized) return null;

  if (!isAuthenticated) {
    const next = encodeURIComponent(
      window.location.origin +
        location.pathname +
        location.search +
        location.hash
    );

    window.location.replace(`${LOGIN_URL}?next=${next}`);

    return null
  }

  return <Outlet />;
};
