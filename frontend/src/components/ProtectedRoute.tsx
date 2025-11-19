import { Navigate } from "react-router-dom";
import { useAuth } from "@/store/auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isLogin = useAuth((s) => s.isLogin);

  // ❌ NOT logged in → send to home page
  if (!isLogin) {
    return <Navigate to="/" replace />;
  }

  // ✔ Logged in → allow access
  return children;
}
