import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { OrbitProgress } from "react-loading-indicators";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-white">
        <OrbitProgress
          variant="disc"
          dense
          color="#00D3F3"
          size="large"
          text=""
          textColor=""
        />
      </div>
    );
  }

  if (!user) return <Navigate to="/signin" replace />;

  return children;
}
