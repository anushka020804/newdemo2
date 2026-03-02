import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────

export interface AuthUser {
    id: string;
    fullName: string;
    email: string;
    mobile: string;
}

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
}

interface AuthContextValue extends AuthState {
    login: (user: AuthUser, accessToken: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

// ─── Storage helpers ──────────────────────────────────────────────────────

const STORAGE_KEY = 'auth';

function loadFromStorage(): AuthState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch { }
    // Return null when not logged in
    return {
        user: null,
        accessToken: null
    };
}

function saveToStorage(state: AuthState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('accessToken'); // legacy key cleanup
}

// ─── Context ──────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuth] = useState<AuthState>(loadFromStorage);

    const login = useCallback((user: AuthUser, accessToken: string) => {
        const next = { user, accessToken };
        setAuth(next);
        saveToStorage(next);
        // Keep the plain accessToken key too for the axios interceptor
        localStorage.setItem('accessToken', accessToken);
    }, []);

    const logout = useCallback(() => {
        setAuth({ user: null, accessToken: null });
        clearStorage();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...auth,
                isAuthenticated: !!auth.user && !!auth.accessToken,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
