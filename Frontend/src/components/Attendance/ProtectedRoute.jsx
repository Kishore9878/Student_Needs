import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/Attendance/AuthContext";

const getNormalizedRole = (user) => {
  const rawRole = user?.role || user?.accountType;
  return typeof rawRole === "string" ? rawRole.toLowerCase() : "";
};

const getStoredAuth = () => {
  try {
    const storedToken = localStorage.getItem("token") || localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user") || localStorage.getItem("auth_user");
    return {
      token: storedToken,
      user: storedUser ? JSON.parse(storedUser) : null,
    };
  } catch {
    return { token: null, user: null };
  }
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const storedAuth = getStoredAuth();
  const effectiveUser = user || storedAuth.user;
  const effectiveIsAuthenticated = isAuthenticated || !!(storedAuth.token && storedAuth.user);

  if (loading) {
    return (
      <div className="spinner-page">
        <span className="spinner spinner-lg" />
      </div>
    );
  }

  if (!effectiveIsAuthenticated) {
    return <Navigate to="/attendance/login" replace />;
  }

  const normalizedRole = getNormalizedRole(effectiveUser);
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());

  if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
