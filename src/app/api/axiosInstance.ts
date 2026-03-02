import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const NEST_API_URL: string = (import.meta as any).env?.VITE_NEST_API_URL || 'http://localhost:3000';

// ─── Axios instance pointing directly at NestJS ───────────────────────────
const axiosInstance = axios.create({
    baseURL: NEST_API_URL,
    withCredentials: true, // sends the httpOnly refresh_token cookie automatically
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Request interceptor: attach access token to every request ────────────
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Token refresh state ──────────────────────────────────────────────────
let isRefreshing = false;
type QueueEntry = { resolve: (token: string) => void; reject: (err: unknown) => void };
let failedQueue: QueueEntry[] = [];

function processQueue(error: unknown, token: string | null) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token!);
    });
    failedQueue = [];
}

// ─── Response interceptor: auto-refresh access token on 401 ──────────────
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only retry once, and don't retry the refresh endpoint itself
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh')
        ) {
            if (isRefreshing) {
                // Queue this request until refresh completes
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call refresh — browser automatically sends the httpOnly cookie
                const { data } = await axiosInstance.post('/auth/refresh');
                const newToken: string = data.accessToken;

                localStorage.setItem('accessToken', newToken);
                axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                processQueue(null, newToken);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem('accessToken');
                // Redirect to login if refresh fails (session expired)
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
