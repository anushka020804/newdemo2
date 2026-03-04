import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
    ArrowLeft,
    Building2,
    Calendar,
    IndianRupee,
    Clock,
    Package,
    FileCode2,
    Sparkles,
    Loader2
} from "lucide-react";

export function Analysis1() {
    const navigate = useNavigate();
    const { id: tenderId } = useParams();
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Use the ID from URL if available, otherwise fallback to "1"
    const tender = {
        id: tenderId || "1",
        title: "Industrial Valves Supply - Karnataka PWD",
        organization: "Bharat Heavy Electrical Limited (BHEL)",
        referenceId: `TND-${tenderId || "1"}`,
        tenderValue: "₹45,00,000",
        bidEndDate: "Feb 15, 2026",
        daysRemaining: 18,
        publishedDate: "Jan 28, 2026",
        bidOpening: "Feb 16, 2026",
        quantity: "500",
        hsnCode: "85019000"
    };

    const handleStartAnalysis = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            navigate(`/tender/${tender.id}`);
        }, 2000); // 2-second buffer
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
                            className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 flex items-center gap-6"
                        >
                            <div className="w-16 h-16 bg-[#3B82F6] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">{tender.title}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="p-1 bg-[#EFF6FF] text-[#3B82F6] rounded">
                                        <Building2 className="w-3.5 h-3.5" />
                                    </span>
                                    <p className="text-sm font-medium text-[#3B82F6]">{tender.organization}</p>
                                </div>
                                <p className="text-xs text-gray-400 font-medium mt-1.5 tracking-wide">Tender ID: {tender.referenceId}</p>
                            </div>
                        </motion.div>

                        {/* Quick Metrics Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                        >
                            {/* Tender Value */}
                            <div className="bg-[#F4F7FF] rounded-[24px] p-6 border border-transparent hover:border-blue-100 transition-colors">
                                <div className="flex items-center gap-2 text-blue-400 font-bold mb-3 text-[11px] tracking-wider uppercase">
                                    <div className="p-1.5 bg-blue-100 rounded-full text-blue-500">
                                        <IndianRupee className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    Tender Value
                                </div>
                                <div className="text-[26px] font-bold text-[#4F46E5] tracking-tight">{tender.tenderValue}</div>
                            </div>

                            {/* Bid End Date */}
                            <div className="bg-[#FFF4ED] rounded-[24px] p-6 border border-transparent hover:border-orange-100 transition-colors">
                                <div className="flex items-center gap-2 text-orange-400 font-bold mb-3 text-[11px] tracking-wider uppercase">
                                    <div className="p-1.5 bg-orange-100 rounded-full text-orange-500">
                                        <Calendar className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    Bid End Date
                                </div>
                                <div className="text-[26px] font-bold text-[#F97316] tracking-tight">{tender.bidEndDate}</div>
                                <div className="text-orange-500 text-[11px] font-bold mt-1 ">{tender.daysRemaining} days remaining</div>
                            </div>

                            {/* Published Date */}
                            <div className="bg-[#F8FAFC] rounded-[24px] p-6 border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-400 font-bold mb-3 text-[11px] tracking-wider uppercase">
                                    <div className="p-1.5 bg-gray-100 rounded-[8px] text-gray-500">
                                        <Calendar className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    Published Date
                                </div>
                                <div className="text-[17px] font-bold text-gray-900 mt-5">{tender.publishedDate}</div>
                            </div>

                            {/* Bid Opening */}
                            <div className="bg-[#F8FAFC] rounded-[24px] p-6 border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-400 font-bold mb-3 text-[11px] tracking-wider uppercase">
                                    <div className="p-1.5 bg-gray-100 rounded-[8px] text-gray-500">
                                        <Clock className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    Bid Opening
                                </div>
                                <div className="text-[17px] font-bold text-gray-900 mt-5">{tender.bidOpening}</div>
                            </div>

                            {/* Quantity */}
                            <div className="bg-[#F8FAFC] rounded-[24px] p-6 border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-400 font-bold mb-3 text-[11px] tracking-wider uppercase">
                                    <div className="p-1.5 bg-gray-100 rounded-[8px] text-gray-500">
                                        <Package className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    Quantity
                                </div>
                                <div className="text-[17px] font-bold text-gray-900 mt-5">{tender.quantity}</div>
                            </div>

                            {/* HSN Code */}
                            <div className="bg-[#F8FAFC] rounded-[24px] p-6 border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-400 font-bold mb-3 text-[11px] tracking-wider uppercase">
                                    <div className="p-1.5 bg-gray-100 rounded-[8px] text-gray-500">
                                        <FileCode2 className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    HSN Code
                                </div>
                                <div className="text-[17px] font-bold text-gray-900 mt-5">{tender.hsnCode}</div>
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
                                        Analyzing Data...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Start Analysis
                                    </>
                                )}
                            </button>

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
