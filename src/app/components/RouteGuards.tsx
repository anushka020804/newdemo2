import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { AppNavbar } from './AppNavbar';

/**
 * Wraps private pages. Redirects to /login if the user is not authenticated.
 * Renders a persistent top navigation bar above all protected pages (except Dashboard).
 */
export function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // Pages with their own sidebar and header, so don't show AppNavbar
    const pagesWithOwnLayout = ['/dashboard', '/saved-bids', '/profile', '/tenders'];
    const hasOwnLayout = pagesWithOwnLayout.includes(location.pathname);

    return (
        <>
            {!hasOwnLayout && <AppNavbar />}
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
