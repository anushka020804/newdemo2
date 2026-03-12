import axiosInstance from './axiosInstance';

export interface BidResult {
    bidNumber: string;
    ministry: string;
    organization: string;
    items: string;
    bestMatchingSegment: string;
    hsnCode: string;
    bidUrl: string;
    quantity?: number;
    department?: string;
    startDate?: string;
    endDate?: string;
    matchedHSN: string;
    matchedKeyword: string;
    hsnScore: number;
    tokenScore: number;
    fuzzyScore: number;
    semanticScore: number;
    finalScore: number;
    isFallback: boolean;
    matchingDigits?: number;
}

/** Shape returned by GET /bid-data/tenders (all tenders, paginated) */
export interface TenderResult {
    id: number;
    bidNumber: string;
    bidUrl: string;
    items: string;
    ministryName: string;
    organisationName: string;
    departmentName: string;
    startDate: string;
    endDate: string;
    quantity: number;
    hsn: string;
    isActive: boolean;
}

export interface PaginatedTenders {
    data: TenderResult[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/** Get all tenders with pagination */
export async function getAllTenders(page = 1, limit = 10): Promise<PaginatedTenders> {
    const { data } = await axiosInstance.get<PaginatedTenders>('/bid-data/tenders', {
        params: { page, limit },
    });
    return data;
}

/** Find matching bids for the authenticated customer */
export async function getMatchedBids(): Promise<BidResult[]> {
    const { data } = await axiosInstance.get('/bid-data/match/customer');
    return data;
}
