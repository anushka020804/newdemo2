import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { logout as logoutApi } from '../api/auth';

/**
 * Returns a handleLogout function that:
 * 1. Calls the NestJS logout API (invalidates refresh token server-side)
 * 2. Clears user + tokens from AuthContext + localStorage
 * 3. Redirects to /login
 *
 * Usage:
 *   const handleLogout = useLogout();
 *   <button onClick={handleLogout}>Logout</button>
 */
export function useLogout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return async function handleLogout() {
        try {
            await logoutApi(); // tell NestJS to invalidate the refresh token
        } catch {
            // Even if the API call fails, clear local state
        } finally {
            logout();                          // clear AuthContext + localStorage
            navigate('/login', { replace: true });
        }
    };
}
