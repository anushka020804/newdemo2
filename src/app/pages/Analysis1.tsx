import { useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import {
    ArrowLeft,
    Building2,
    Calendar,
    Package,
    FileCode2,
    Sparkles,
    Loader2,
    Download
} from "lucide-react";
import { applyBidAnalysis, subscribeToAnalysisResult } from "../api/bids";

export function Analysis1() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id: tenderId } = useParams();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const cleanupRef = useRef<(() => void) | null>(null);

    const passedTender = location.state?.tender;
    const rawBid = passedTender?.rawBid || {};

    // Use the database ID from URL for API calls
    const tender = {
        id: tenderId || "1",
        title: rawBid.items || '',
        organization: rawBid.organization || passedTender?.organization || '',
        referenceId: rawBid.bidNumber || passedTender?.tenderNumber || `TND-${tenderId || "1"}`,
        ministry: rawBid.ministry || '',
        department: rawBid.department || '',
        items: rawBid.items || '',
        bidUrl: rawBid.bidUrl || '',
        bidStartDate: passedTender?.postedDate || '',
        bidEndDate: passedTender?.submissionDate || '',
        quantity: passedTender?.quantity || rawBid.quantity || '',
        hsnCode: rawBid.hsnCode || rawBid.hsn || ''
    }

    const handleStartAnalysis = async () => {
        setIsAnalyzing(true);
        setStatusText("Submitting tender for analysis...");
        try {
            // Step 1: Fire-and-forget POST to start the pipeline
            const response = await applyBidAnalysis(tender.id);
            const bidNumber = response.bidNumber;
            console.log('[Analysis1] Analysis queued:', response);

            if (!bidNumber) {
                throw new Error("No bidNumber returned from API");
            }

            // Step 2: Subscribe to SSE for real-time results
            setStatusText("AI is analyzing the tender document... This may take 1-3 minutes.");
            cleanupRef.current = subscribeToAnalysisResult(
                bidNumber,
                (result) => {
                    console.log('[Analysis1] SSE result received:', result);
                    cleanupRef.current = null;
                    setIsAnalyzing(false);
                    setStatusText("");

                    if (result.status === 'failed') {
                        setStatusText(`Analysis failed: ${result.error || 'Unknown error'}. Please try again.`);
                        setIsAnalyzing(false);
                        return;
                    }

                    navigate(`/tender/${tender.id}`, {
                        state: {
                            tender: passedTender,
                            analysisResult: result,
                        },
                    });
                },
                (err) => {
                    console.error('[Analysis1] SSE error:', err);
                    cleanupRef.current = null;
                    setStatusText("Connection lost. Please try again.");
                    setIsAnalyzing(false);
                },
            );
        } catch (error) {
            console.error("Failed to start analysis:", error);
            setStatusText("Failed to start analysis. Please try again.");
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
            {/* Header with Navigation */}
            <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={() => navigate('/tenders')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-lg font-semibold text-indigo-600 flex items-center gap-2">
                            Tender Details
                        </h1>
                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wide uppercase truncate">
                            REF: {tender.referenceId}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-2 sm:mt-4">
                {/* Responsive Grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 items-start">

                    {/* Left Column - Main Details (Span 3) */}
                    <div className="lg:col-span-3 space-y-4 sm:space-y-6">

                        {/* Header Plate */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5 mb-4 sm:mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5"
                        >
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div className="flex-1 min-w-0 w-full">
                                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 break-words">{rawBid.bidNumber || tender.referenceId}</h2>
                                {tender.items && (
                                    <div className="text-sm sm:text-[15px] font-bold text-emerald-800 line-clamp-2 mt-1 mb-2" title={tender.items}>
                                        Items: {tender.items}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="p-1 bg-indigo-50 text-blue-600 rounded flex-shrink-0">
                                        <Building2 className="w-3.5 h-3.5" />
                                    </span>
                                    <p className="text-xs sm:text-sm font-medium text-blue-600 truncate">Buyer: {tender.organization}</p>
                                </div>
                            </div>
                            {tender.bidUrl && (
                                <a
                                    href={tender.bidUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-colors shadow-sm font-semibold text-sm w-full sm:w-auto flex-shrink-0"
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="sm:inline">Bid Document</span>
                                </a>
                            )}
                        </motion.div>

                        {/* Info Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                            {tender.ministry && (
                                <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                    <p className="text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">Ministry</p>
                                    <p className="text-sm font-semibold text-gray-900">{tender.ministry}</p>
                                </div>
                            )}
                            {tender.department && (
                                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">Department</p>
                                    <p className="text-sm font-semibold text-gray-900">{tender.department}</p>
                                </div>
                            )}
                            {tender.hsnCode && (
                            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-1.5 text-gray-400 font-bold mb-1 text-[10px] tracking-wider uppercase">
                                    <div className="p-1 bg-gray-100 rounded-md text-gray-500">
                                        <FileCode2 className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    HSN Code
                                </div>
                                <div className="text-sm font-bold text-gray-900 mt-0.5">{tender.hsnCode?.toString().replace(/\.0$/, "")}</div>
                            </div>
                            )}
                            {tender.quantity && (
                            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-1.5 text-gray-400 font-bold mb-1 text-[10px] tracking-wider uppercase">
                                    <div className="p-1 bg-gray-100 rounded-md text-gray-500">
                                        <Package className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    Quantity
                                </div>
                                <div className="text-sm font-bold text-gray-900 mt-0.5">{tender.quantity}</div>
                            </div>
                            )}
                        </div>

                        {/* Quick Metrics Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
                        >
                            {/* Bid Start Date */}
                            {tender.bidStartDate && (
                            <div className="bg-indigo-50 rounded-xl p-3 sm:p-4 border border-transparent hover:border-blue-100 transition-colors">
                                <div className="flex items-center gap-2 text-blue-400 font-bold mb-1 text-[10px] tracking-wider uppercase">
                                    <div className="p-1 sm:p-1.5 bg-blue-100 rounded-full text-blue-500">
                                        <Calendar className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    Bid Start Date
                                </div>
                                <div className="text-base sm:text-[20px] font-bold text-indigo-600 tracking-tight">{tender.bidStartDate}</div>
                            </div>
                            )}

                            {/* Bid End Date */}
                            {tender.bidEndDate && (
                            <div className="bg-orange-50 rounded-xl p-3 sm:p-4 border border-transparent hover:border-orange-100 transition-colors">
                                <div className="flex items-center gap-2 text-orange-400 font-bold mb-1 text-[10px] tracking-wider uppercase">
                                    <div className="p-1 sm:p-1.5 bg-orange-100 rounded-full text-orange-500">
                                        <Calendar className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    Bid End Date
                                </div>
                                <div className="text-base sm:text-[20px] font-bold text-orange-500 tracking-tight">{tender.bidEndDate}</div>
                            </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Column - Actions (Span 1) */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 sticky top-20 sm:top-24"
                        >
                            <h3 className="text-sm sm:text-[16px] font-bold text-gray-900 mb-3 sm:mb-4 text-left">Quick Eligibility Check</h3>

                            <button
                                onClick={handleStartAnalysis}
                                disabled={isAnalyzing}
                                className={`w-full font-bold px-4 sm:px-6 py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-sm sm:text-[16px] mb-2 sm:mb-3 ${isAnalyzing
                                    ? "bg-blue-400 text-white cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                                    }`}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Start Analysis
                                    </>
                                )}
                            </button>

                            {statusText && (
                                <p className={`text-[11px] sm:text-[12px] text-center font-medium px-2 mb-2 ${
                                    statusText.includes('failed') || statusText.includes('Failed') || statusText.includes('lost')
                                        ? 'text-red-500' : 'text-blue-500'
                                }`}>
                                    {statusText}
                                </p>
                            )}

                            <p className="text-[10px] sm:text-[11px] text-gray-400 text-center font-medium px-1 sm:px-2">
                                Get detailed eligibility analysis based on your business profile.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
