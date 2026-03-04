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
