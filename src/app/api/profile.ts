import axiosInstance from './axiosInstance';

export interface HsnDetailPayload {
    hsnCode: string;
    keywords: string[];
}

export interface SaveHsnSetupPayload {
    hsns: HsnDetailPayload[];
    emailAlerts?: boolean;
    whatsappAlerts?: boolean;
}

export interface CompanyInfo {
    id: string;
    legalName: string;
    pan: string;
    gstin: string;
    address: string;
    establishmentYear: string;
    userId: string;
    status: string;
    createdAt: string;
}

export interface HsnCode {
    id: string;
    hsnCode: string;
    keywords: string[];
    customerId: string;
    createdAt: string;
}

export interface CustomerProfile {
    id: string;
    fullName: string;
    email: string;
    mobile: string;
    emailAlerts: boolean;
    whatsappAlerts: boolean;
    companies: CompanyInfo[];
    hsnCodes: HsnCode[];
    createdAt: string;
    updatedAt: string;
}

/** Save multiple HSN keywords and Notification Preferences */
export async function saveHsnSetup(payload: SaveHsnSetupPayload) {
    const { data } = await axiosInstance.post(`/profile/hsn-setup`, payload);
    return data;
}

/** Get the full customer profile including companies and HSN codes */
export async function getCustomerProfile(): Promise<CustomerProfile> {
    const { data } = await axiosInstance.get('/profile/customer');
    return data;
}

export interface UpdateProfilePayload {
    fullName?: string;
    mobile?: string;
    companyLegalName?: string;
    companyAddress?: string;
    establishmentYear?: string;
}

/** Update customer profile and company info */
export async function updateCustomerProfile(payload: UpdateProfilePayload): Promise<CustomerProfile> {
    const { data } = await axiosInstance.patch('/profile/customer', payload);
    return data;
}

/** Append new HSN codes without deleting existing ones */
export async function appendHsn(payload: SaveHsnSetupPayload) {
    const { data } = await axiosInstance.post('/profile/hsn-append', payload);
    return data;
}

/** Delete a single HSN row */
export async function deleteHsn(hsnId: string) {
    const { data } = await axiosInstance.delete(`/profile/hsn/${hsnId}`);
    return data;
}
