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
        title: rawBid.items || "Industrial Valves Supply - Karnataka PWD",
        organization: rawBid.organization || passedTender?.organization || "Bharat Heavy Electrical Limited (BHEL)",
        referenceId: rawBid.bidNumber || passedTender?.tenderNumber || `TND-${tenderId || "1"}`,
        ministry: rawBid.ministry || '',
        department: rawBid.department || '',
        items: rawBid.items || '',
        bidUrl: rawBid.bidUrl || '',
        bidStartDate: passedTender?.postedDate || "Jan 28, 2026",
        bidEndDate: passedTender?.submissionDate || "Feb 15, 2026",
        quantity: passedTender?.quantity || "500",
        hsnCode: rawBid.hsnCode || "85019000"
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
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header with Navigation */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate('/tenders')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-[#4F46E5] flex items-center gap-2">
                            Tender Details
                        </h1>
                        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                            REFERENCE ID: {tender.referenceId}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 mt-4">
                {/* Responsive Grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                    {/* Left Column - Main Details (Span 3) */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Header Plate */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-5 mb-5 flex items-center gap-5"
                        >
                            <div className="w-16 h-16 bg-[#3B82F6] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">{rawBid.bidNumber || tender.referenceId}</h2>
                                {tender.items && (
                                    <div className="text-[15px] font-extrabold text-emerald-800 line-clamp-2 mt-1 mb-2" title={tender.items}>
                                        Items: {tender.items}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="p-1 bg-[#EFF6FF] text-[#3B82F6] rounded">
                                        <Building2 className="w-3.5 h-3.5" />
                                    </span>
                                    <p className="text-sm font-medium text-[#3B82F6]">Buyer: {tender.organization}</p>
                                </div>
                            </div>
                            {tender.bidUrl && (
                                <a
                                    href={tender.bidUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-xl hover:bg-[#4338CA] transition-colors shadow-sm font-semibold text-sm flex-shrink-0"
                                >
                                    <Download className="w-4 h-4" />
                                    Bid Document
                                </a>
                            )}
                        </motion.div>

                        {/* Info Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            {tender.ministry && (
                                <div className="p-2.5 bg-[#FAFAFF] rounded-[12px] border border-[#EEF2FF]">
                                    <p className="text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">Ministry</p>
                                    <p className="text-sm font-semibold text-gray-900">{tender.ministry}</p>
                                </div>
                            )}
                            {tender.department && (
                                <div className="p-2.5 bg-[#F8FAFC] rounded-[12px] border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">Department</p>
                                    <p className="text-sm font-semibold text-gray-900">{tender.department}</p>
                                </div>
                            )}
                            <div className="p-2.5 bg-[#F8FAFC] rounded-[12px] border border-gray-100">
                                <div className="flex items-center gap-1.5 text-gray-400 font-bold mb-1 text-[10px] tracking-wider uppercase">
                                    <div className="p-1 bg-gray-100 rounded-[6px] text-gray-500">
                                        <FileCode2 className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    HSN Code
                                </div>
                                <div className="text-sm font-bold text-gray-900 mt-0.5">{tender.hsnCode?.toString().replace(/\.0$/, "")}</div>
                            </div>
                            <div className="p-2.5 bg-[#F8FAFC] rounded-[12px] border border-gray-100">
                                <div className="flex items-center gap-1.5 text-gray-400 font-bold mb-1 text-[10px] tracking-wider uppercase">
                                    <div className="p-1 bg-gray-100 rounded-[6px] text-gray-500">
                                        <Package className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    Quantity
                                </div>
                                <div className="text-sm font-bold text-gray-900 mt-0.5">{tender.quantity}</div>
                            </div>
                        </div>

                        {/* Quick Metrics Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        >
                            {/* Bid Start Date */}
                            <div className="bg-[#F4F7FF] rounded-[16px] p-4 border border-transparent hover:border-blue-100 transition-colors">
                                <div className="flex items-center gap-2 text-blue-400 font-bold mb-1 text-[10px] tracking-wider uppercase">
                                    <div className="p-1.5 bg-blue-100 rounded-full text-blue-500">
                                        <Calendar className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    Bid Start Date
                                </div>
                                <div className="text-[20px] font-bold text-[#4F46E5] tracking-tight">{tender.bidStartDate}</div>
                            </div>

                            {/* Bid End Date */}
                            <div className="bg-[#FFF4ED] rounded-[16px] p-4 border border-transparent hover:border-orange-100 transition-colors">
                                <div className="flex items-center gap-2 text-orange-400 font-bold mb-1 text-[10px] tracking-wider uppercase">
                                    <div className="p-1.5 bg-orange-100 rounded-full text-orange-500">
                                        <Calendar className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    Bid End Date
                                </div>
                                <div className="text-[20px] font-bold text-[#F97316] tracking-tight">{tender.bidEndDate}</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Actions (Span 1) */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 sticky top-24"
                        >
                            <h3 className="text-[16px] font-bold text-gray-900 mb-4 text-left">Quick Eligibility Check</h3>

                            <button
                                onClick={handleStartAnalysis}
                                disabled={isAnalyzing}
                                className={`w-full font-bold px-6 py-4 rounded-[16px] flex items-center justify-center gap-2 shadow-sm transition-all text-[16px] mb-3 ${isAnalyzing
                                    ? "bg-blue-400 text-white cursor-not-allowed"
                                    : "bg-[#2563EB] hover:bg-blue-700 text-white"
                                    }`}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Start Analysis
                                    </>
                                )}
                            </button>

                            {statusText && (
                                <p className={`text-[12px] text-center font-medium px-2 mb-2 ${
                                    statusText.includes('failed') || statusText.includes('Failed') || statusText.includes('lost')
                                        ? 'text-red-500' : 'text-blue-500'
                                }`}>
                                    {statusText}
                                </p>
                            )}

                            <p className="text-[11px] text-gray-400 text-center font-medium px-2">
                                Get detailed eligibility analysis based on your business profile.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
