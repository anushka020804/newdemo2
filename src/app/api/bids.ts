import axiosInstance from './axiosInstance';

export interface BidResult {
    id: number;
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

/** Trigger or fetch analysis for a specific bid */
export async function applyBidAnalysis(bidId: string) {
    const { data } = await axiosInstance.post(`/bid-data/apply/${encodeURIComponent(bidId)}`);
    return data;
}

/** 
 * Subscribe to SSE stream for analysis results.
 * Returns a cleanup function to abort the connection.
 */
export function subscribeToAnalysisResult(
    bidNumber: string,
    onResult: (data: any) => void,
    onError: (err: any) => void,
): () => void {
    const baseURL = axiosInstance.defaults.baseURL || 'http://localhost:3000';
    const url = `${baseURL}/tender-results/${encodeURIComponent(bidNumber)}/stream`;
    const eventSource = new EventSource(url);
    let received = false;

    const handleResult = (raw: string) => {
        if (received) return;
        received = true;
        try {
            const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
            onResult(data);
        } catch {
            onResult(raw);
        }
        eventSource.close();
    };

    // NestJS SSE sends type:'result' → event: result
    eventSource.addEventListener('result', (event: any) => {
        handleResult(event.data);
    });

    // Fallback: some NestJS versions send unnamed events
    eventSource.onmessage = (event: any) => {
        // Ignore heartbeat / connected events
        try {
            const parsed = JSON.parse(event.data);
            if (parsed?.type === 'connected' || parsed?.status === 'waiting') return;
            handleResult(event.data);
        } catch {
            // not JSON, ignore
        }
    };

    eventSource.onerror = (err) => {
        if (!received) {
            onError(err);
        }
        eventSource.close();
    };

    return () => eventSource.close();
}