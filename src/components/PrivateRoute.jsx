import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/sign/component/SignInPage" replace />;
  }
  if (adminOnly) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!payload?.roles?.includes("ROLE_ADMIN")) {
        return <Navigate to="/" replace />;
      }
    } catch {
      return <Navigate to="/" replace />;
    }
  }
  return children;
};

export default PrivateRoute;
