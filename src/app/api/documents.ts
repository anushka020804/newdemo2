import axiosInstance from './axiosInstance';

export interface DocumentStatus {
    documentType: string;
    status: 'UPLOADED' | 'PENDING';
    id: string | null;
    fileName: string | null;
    uploadedAt: string | null;
}

export interface CategoryStatus {
    category: string;
    uploadedCount: number;
    totalCount: number;
    documents: DocumentStatus[];
}

export interface RepositoryStatus {
    overallProgress: number;
    uploaded: number;
    total: number;
    categories: CategoryStatus[];
}

/** Get document repository status for a company */
export async function getDocumentStatus(companyId: string): Promise<RepositoryStatus> {
    const { data } = await axiosInstance.get(`/companies/${companyId}/documents`);
    return data;
}

/** Upload a document for a company */
export async function uploadDocument(
    companyId: string,
    file: File,
    category: string,
    documentType: string
): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('documentType', documentType);

    const { data } = await axiosInstance.post(
        `/companies/${companyId}/documents`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
}

/** Delete a document */
export async function deleteDocument(companyId: string, documentId: string): Promise<void> {
    await axiosInstance.delete(`/companies/${companyId}/documents/${documentId}`);
}
