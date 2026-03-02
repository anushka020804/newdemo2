import axiosInstance from './axiosInstance';

// ─── Types ────────────────────────────────────────────────────────────────

export interface SignupStep1Payload {
    fullName: string;
    email: string;
    phoneNumber: string;
}

export interface SignupStep2Payload {
    email: string;
    pan: string;
    legalName: string;
    gstin?: string;
    address?: string;
}

export interface SendOtpPayload {
    email: string;
}

export interface VerifyOtpPayload {
    email: string;
    otp: string;
}

// ─── Auth API Functions ───────────────────────────────────────────────────

/** Step 1: save personal details to onboarding draft */
export async function signupStep1(payload: SignupStep1Payload) {
    const { data } = await axiosInstance.post('/auth/signup/step1', payload);
    return data;
}

/** Step 2: create User + Company from draft */
export async function signupStep2(payload: SignupStep2Payload) {
    const { data } = await axiosInstance.post('/auth/signup/step2', payload);
    return data;
}

/** Get onboarding draft status by email */
export async function getDraftStatus(email: string) {
    const { data } = await axiosInstance.get('/auth/signup/status', {
        params: { email },
    });
    return data;
}

/** Login Step 1: send 6-digit OTP to registered email */
export async function sendOtp(payload: SendOtpPayload) {
    const { data } = await axiosInstance.post('/auth/login/send-otp', payload);
    return data;
}

/** Login Step 2: verify OTP, receive accessToken + set refresh cookie */
export async function verifyOtp(payload: VerifyOtpPayload) {
    const { data } = await axiosInstance.post('/auth/login/verify-otp', payload);
    if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
    }
    return data;
}

/** Refresh access token using the httpOnly refresh_token cookie */
export async function refreshAccessToken() {
    const { data } = await axiosInstance.post('/auth/refresh');
    if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
    }
    return data;
}

/** Logout: clears refresh token server-side + removes local access token */
export async function logout() {
    const { data } = await axiosInstance.post('/auth/logout');
    localStorage.removeItem('accessToken');
    return data;
}

/** Get authenticated user profile (requires valid access token) */
export async function getProfile() {
    const { data } = await axiosInstance.get('/auth/profile');
    return data;
}
