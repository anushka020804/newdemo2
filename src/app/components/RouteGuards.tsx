import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps private pages. Redirects to /login if the user is not authenticated.
 */
export function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

/**
 * Wraps public-only pages (login, signup).
 * Redirects to /dashboard if the user is already logged in,
 * so they don't see the login/signup screens again.
 */
export function PublicOnlyRoute() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
