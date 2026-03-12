import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { AppNavbar } from './AppNavbar';

/**
 * Wraps private pages. Redirects to /login if the user is not authenticated.
 * Renders a persistent top navigation bar above all protected pages.
 */
export function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return (
        <>
            <AppNavbar />
            <Outlet />
        </>
    );
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
