import { Navigate } from "react-router-dom";
import { hasHistoryAccess } from "../utils/authSession";

export default function ProtectedRoute({ children }) {
  if (!hasHistoryAccess()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
