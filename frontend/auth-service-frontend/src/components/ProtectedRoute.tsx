import { Navigate } from "react-router-dom";
import { useAuth, usePrivilege } from "../context/AuthContext";

export default function ProtectedRoute({ children, prev = undefined }: { children: React.ReactNode, prev?: string }) {
  const { user } = useAuth();
  const { valid_privilege } = usePrivilege(prev || "");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (prev !== undefined && !valid_privilege)
    return <Navigate to="/users" replace />;
  return children;
}
