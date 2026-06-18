import { Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AuthSuccess from "./components/AuthSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import ReviewHistoryDashboard from "./components/ReviewHistoryDashboard";
import { hasHistoryAccess } from "./utils/authSession";
import RagTest from "./pages/RagTest"

function HistoryRedirect() {
  if (!hasHistoryAccess()) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to="/dashboard/history" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route
            path="history"
            element={
              <ProtectedRoute>
                <ReviewHistoryDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/history" element={<HistoryRedirect />} />

        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/rag-test" element={<RagTest />} />
      </Routes>
    </AuthProvider>
  );
}
