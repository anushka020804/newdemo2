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

/** Find matching bids for the authenticated customer */
export async function getMatchedBids(): Promise<BidResult[]> {
    const { data } = await axiosInstance.get('/bid-data/match/customer');
    return data;
}
