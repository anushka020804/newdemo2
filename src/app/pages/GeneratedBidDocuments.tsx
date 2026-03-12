import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import {
    ArrowLeft,
    Building2,
    Edit,
    CloudUpload,
    Eye,
    Edit2,
    Trash2,
    Download,
    ClipboardList
} from "lucide-react";
import { InlineChatbot } from "../components/InlineChatbot";

type DocumentStatus = "Missing" | "Available" | "Create";

interface GeneratedDocument {
    id: string;
    name: string;
    type: string;
    description: string;
    status: DocumentStatus;
    selected: boolean;
}

export function GeneratedBidDocuments() {
    const navigate = useNavigate();
    const { tenderId } = useParams();

    // Mock Tender Data
    const tender = {
        id: tenderId || "1",
        title: "Industrial Valves Supply - Karnataka PWD",
        organization: "Karnataka Public Works Department",
    };

    // Mock generated document list 
    const [documents, setDocuments] = useState<GeneratedDocument[]>([
        { id: "1", name: "Document Name", type: "Document Type", description: "-----Description-----", status: "Available", selected: false },
        { id: "2", name: "Company Registration Certificate", type: "Standard", description: "-----Description-----", status: "Available", selected: false },
        { id: "3", name: "GST Registration Certificate", type: "Standard", description: "-----Description-----", status: "Available", selected: false },
        { id: "4", name: "Pan Card Copy", type: "Standard", description: "-----Description-----", status: "Available", selected: false },
        { id: "5", name: "Undertaking Against Cartel Formation", type: "Custom", description: "-----Description-----", status: "Available", selected: false },
        { id: "6", name: "Undertaking Against Documents", type: "Custom", description: "-----Description-----", status: "Available", selected: false },
    ]);

    const allSelected = documents.length > 0 && documents.every(d => d.selected);

    const toggleSelectAll = () => {
        setDocuments(docs => docs.map(d => ({ ...d, selected: !allSelected })));
    };

    const toggleDocument = (id: string) => {
        setDocuments(docs => docs.map(d => d.id === id ? { ...d, selected: !d.selected } : d));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => navigate(`/bid-preparation/${tenderId}`)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <div>
                            <h1 className="text-base sm:text-lg font-semibold text-indigo-600">
                                Tender Details
                            </h1>
                            <p className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wide uppercase">
                                REFERENCE ID: TND-{tender.id}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-2 sm:mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">

                    {/* Left Column - Document Preparation */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Header Block */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 flex items-start sm:items-center gap-3 sm:gap-5"
                        >
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-base sm:text-[22px] font-bold text-gray-900 mb-1 line-clamp-2">{tender.title}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="p-1 bg-gray-100 rounded text-gray-500 flex-shrink-0">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                    </span>
                                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{tender.organization}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Documents List Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 flex flex-col min-h-[500px] sm:h-[700px]"
                        >
                            {/* List Header & Legend */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 pb-2 border-b border-transparent">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                    Generated Bid Documents <span className="text-gray-900">({documents.length})</span>
                                </h3>
                                <div className="flex items-center gap-6">
                                    <label className="relative flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleSelectAll}
                                            className="w-5 h-5 rounded border-2 border-blue-400 appearance-none checked:bg-blue-500 checked:border-blue-500 transition-colors cursor-pointer"
                                        />
                                        {allSelected && (
                                            <svg className="absolute top-1 left-1 w-3 h-3 text-white pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        )}
                                        <span className="text-xs sm:text-[13px] font-bold text-gray-900">Select All</span>
                                    </label>
                                </div>
                            </div>

                            {/* Scrollable Checklist */}
                            <div className="flex-1 overflow-y-auto sm:pr-4 space-y-3 custom-scrollbar">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className={`flex flex-col p-3 sm:p-4 bg-white rounded-xl border transition-colors ${doc.selected ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-blue-300'}`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm sm:text-[14px] font-bold text-gray-800">{doc.name}</h4>
                                                <p className="text-[11px] sm:text-[12px] text-gray-500 mt-1">{doc.description}</p>
                                            </div>
                                            <span className="self-start px-2.5 sm:px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] sm:text-[11px] font-semibold text-indigo-600 tracking-wider whitespace-nowrap">
                                                {doc.type}
                                            </span>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-0 mt-3 sm:mt-4">
                                            {/* Action Buttons */}
                                            <div className="flex gap-2 text-gray-400">
                                                <button className="p-1 hover:text-blue-600 tooltip-trigger" title="View Document">
                                                    <Eye className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
                                                </button>
                                                <button onClick={() => navigate(`/tender/${tenderId}/final-document-editor`)} className="p-1 hover:text-gray-700 tooltip-trigger" title="Edit Document">
                                                    <Edit2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-500" strokeWidth={2.5} />
                                                </button>
                                                <button className="p-1 hover:text-red-500 tooltip-trigger" title="Delete ">
                                                    <Trash2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-red-500" strokeWidth={2.5} />
                                                </button>
                                                <button className="p-1 hover:text-emerald-500 tooltip-trigger" title="Download Document">
                                                    <Download className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-emerald-500" strokeWidth={2.5} />
                                                </button>
                                            </div>

                                            {/* Add to Final Bid Checkbox */}
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <span className="text-[11px] sm:text-[12px] font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">Add to Final Bid</span>
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={doc.selected}
                                                        onChange={() => toggleDocument(doc.id)}
                                                        className="w-[18px] h-[18px] rounded border-2 border-gray-300 appearance-none checked:bg-indigo-600 checked:border-indigo-600 transition-colors cursor-pointer"
                                                    />
                                                    {doc.selected && (
                                                        <svg className="absolute top-[3px] left-[3px] w-3 h-3 text-white pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                    )}
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-5 mt-2 border-t border-gray-100">
                                <button className="flex-1 py-2.5 sm:py-3 rounded-xl border-2 border-indigo-600 text-indigo-600 font-bold text-sm sm:text-[15px] hover:bg-indigo-50 transition-colors">
                                    Generate More Documents
                                </button>
                                <button
                                    onClick={() => navigate(`/tender/${tenderId}/final-bid-sequence`)}
                                    className="flex-1 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm sm:text-[15px] hover:from-indigo-700 hover:to-blue-700 transition-colors shadow-sm"
                                >
                                    Prepare Final Bid
                                </button>
                            </div>

                        </motion.div>
                    </div>

                    {/* Right Column - Actions Sidebar */}
                    <div className="lg:col-span-1 space-y-4">

                        {/* 1. Check Saved Bids Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            onClick={() => navigate("/saved-bids")}
                            className="w-full bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 shadow-sm transition-all hover:shadow-md text-sm sm:text-[16px]"
                        >
                            <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-700" strokeWidth={2.5} />
                            Check all saved bids
                        </motion.button>

                        {/* 2. Opportunity X AI Chatbot */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <InlineChatbot />
                        </motion.div>

                    </div>
                </div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 14px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #EEF2FF;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #9CA3AF;
          border-radius: 10px;
          border: 3px solid #EEF2FF;
        }
      `}</style>
        </div>
    );
}
