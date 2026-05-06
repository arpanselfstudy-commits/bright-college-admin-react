import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { RootState } from "../../../store/store";
import { clearSessionMessage } from "../../../store/auth.store";

export const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, sessionExpiredMessage } = useSelector(
    (state: RootState) => state.authSlice
  );

  useEffect(() => {
    if (!isLoggedIn && sessionExpiredMessage) {
      toast.error(sessionExpiredMessage);
      dispatch(clearSessionMessage());
    }
  }, [isLoggedIn, sessionExpiredMessage, dispatch]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Redirects already-authenticated users away from public pages like /login.
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useSelector((state: RootState) => state.authSlice.isLoggedIn);
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

export default ProtectedRoute;
