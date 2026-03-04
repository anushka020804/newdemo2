import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import {
    ArrowLeft,
    Building2,
    Edit,
    CloudUpload,
    Bot,
    Send,
    Paperclip,
    ClipboardList
} from "lucide-react";

type DocumentStatus = "Missing" | "Available" | "Create";

interface RequiredDocument {
    id: string;
    name: string;
    type: string;
    status: DocumentStatus;
    selected: boolean;
}

export function BidDocumentPreparation() {
    const navigate = useNavigate();
    const { tenderId } = useParams();

    // Mock Tender Data (Using the same base info as TenderDetails)
    const tender = {
        id: tenderId || "1",
        title: "Industrial Valves Supply - Karnataka PWD",
        organization: "Karnataka Public Works Department",
    };

    // Mock document list with statuses based on the screenshot
    const [documents, setDocuments] = useState<RequiredDocument[]>([
        { id: "1", name: "Document Name", type: "Document Type", status: "Available", selected: false },
        { id: "2", name: "Company Registration Certificate", type: "Standard", status: "Available", selected: false },
        { id: "3", name: "GST Registration Certificate", type: "Standard", status: "Available", selected: false },
        { id: "4", name: "PAN Card", type: "Standard", status: "Available", selected: false },
        { id: "5", name: "ISO Certification", type: "Standard", status: "Missing", selected: false },
        { id: "6", name: "Financial Statements (Last 3 Years)", type: "Standard", status: "Missing", selected: false },
        { id: "7", name: "Previous Work Experience Certificates", type: "Standard", status: "Missing", selected: false },
        { id: "8", name: "Undertaking Against Cartel Formation", type: "Custom", status: "Create", selected: false },
        { id: "9", name: "Undertaking of Non-Blacklisting", type: "Custom", status: "Create", selected: false },
        { id: "10", name: "Certificate Confirming Acceptance of T&C and ATC", type: "Custom", status: "Create", selected: false },
        { id: "11", name: "Custom Document 5", type: "Custom", status: "Create", selected: false },
        { id: "12", name: "Standard Document 5", type: "Standard", status: "Create", selected: false },
    ]);

    const allSelected = documents.every(d => d.selected);

    const toggleSelectAll = () => {
        setDocuments(docs => docs.map(d => ({ ...d, selected: !allSelected })));
    };

    const toggleDocument = (id: string) => {
        setDocuments(docs => docs.map(d => d.id === id ? { ...d, selected: !d.selected } : d));
    };

    const statusBadges = {
        Missing: "bg-red-50 text-red-600 border-red-200",
        Available: "bg-green-50 text-green-600 border-green-200",
        Create: "bg-yellow-50 text-yellow-600 border-yellow-200"
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(`/tender/${tenderId}`)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <div>
                            <h1 className="text-lg font-semibold text-[#4F46E5]">
                                Tender Details
                            </h1>
                            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                                REFERENCE ID: TND-{tender.id}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Document Preparation */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Header Block */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex items-center gap-5"
                        >
                            <div className="w-16 h-16 bg-[#3B82F6] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-[22px] font-bold text-gray-900 mb-1">{tender.title}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="p-1 bg-gray-100 rounded text-gray-500">
                                        {/* Placeholder for small paper icon */}
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                    </span>
                                    <p className="text-sm font-medium text-gray-500">{tender.organization}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Documents List Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex flex-col h-[700px]"
                        >
                            {/* List Header & Legend */}
                            <div className="flex items-center justify-between mb-6 pb-2 border-b border-transparent">
                                <h3 className="text-lg font-bold text-gray-900">
                                    Required Documents <span className="text-gray-900">({documents.length})</span>
                                </h3>
                                <div className="flex items-center gap-6">
                                    <label className="relative flex items-center gap-2 cursor-pointer mt-1">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleSelectAll}
                                            className="w-5 h-5 rounded border-2 border-blue-400 appearance-none checked:bg-blue-500 checked:border-blue-500 transition-colors cursor-pointer"
                                        />
                                        {allSelected && (
                                            <svg className="absolute top-1 left-1 w-3 h-3 text-white pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        )}
                                        <span className="text-[13px] font-bold text-gray-900">Select All</span>
                                    </label>
                                </div>
                            </div>

                            {/* Scrollable Checklist */}
                            <div className="flex-1 overflow-y-auto pr-4 space-y-3 custom-scrollbar">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className={`flex items-center justify-between p-4 bg-white rounded-[16px] border transition-colors ${doc.selected ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-blue-300'}`}
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* 1. Checkbox on the Left */}
                                            <label className="relative cursor-pointer mt-1 shrink-0">
                                                <input
                                                    type="checkbox"
                                                    checked={doc.selected}
                                                    onChange={() => toggleDocument(doc.id)}
                                                    className="w-5 h-5 rounded border-2 border-gray-300 appearance-none checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                                                />
                                                {doc.selected && (
                                                    <svg className="absolute top-1 left-1 w-3 h-3 text-white pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                )}
                                            </label>

                                            {/* 2. Document Info */}
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-[15px] font-bold text-gray-900">{doc.name}</h4>
                                                    <span className="px-2.5 py-0.5 bg-gray-100 rounded text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                                                        {doc.type}
                                                    </span>
                                                </div>
                                                <p className="text-[13px] text-gray-500 mt-1 line-clamp-1">Brief description about this required document...</p>
                                            </div>
                                        </div>

                                        {/* 3. Status and Actions on the Right */}
                                        <div className="flex items-center gap-4 shrink-0 pl-4">
                                            {/* Text-based Status Badge */}
                                            <div className={`px-3 py-1 rounded-full border text-[12px] font-bold flex items-center justify-center min-w-[80px] ${statusBadges[doc.status]}`}>
                                                {doc.status}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1 border-l border-gray-100 pl-4">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip-trigger" title="Edit template">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip-trigger" title="Upload custom file">
                                                    <CloudUpload className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Button */}
                            <div className="pt-6 mt-2">
                                <button
                                    onClick={() => navigate(`/tender/${tenderId}/generated-documents`)}
                                    className="w-full py-4 rounded-[16px] border-2 border-blue-500 text-blue-500 font-bold text-[16px] hover:bg-blue-50 transition-colors"
                                >
                                    Generate Bid Document(s)
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
                            className="w-full bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-6 py-4 rounded-[24px] flex items-center justify-center gap-3 shadow-sm transition-all hover:shadow-md text-[16px]"
                        >
                            <ClipboardList className="w-5 h-5 text-indigo-700" strokeWidth={2.5} />
                            Check all saved bids
                        </motion.button>

                        {/* 2. Opportunity X AI Chatbot */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[670px]"
                        >
                            {/* Header */}
                            <div className="bg-[#4F46E5] text-white p-4 font-bold text-center text-[16px]">
                                Opportunity X AI
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 p-5 bg-white overflow-y-auto">
                                <div className="flex gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-[#4F46E5]" />
                                    </div>
                                    <div className="bg-gray-50 border text-[13px] border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-sm text-gray-800">
                                        Hey! How can I help you?<br />
                                        Ask me anything related to this tender.
                                    </div>
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                                        />
                                    </div>
                                    <button className="p-2 text-gray-500 hover:text-[#4F46E5] transition-colors shrink-0">
                                        <Send className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-gray-500 hover:text-[#4F46E5] transition-colors shrink-0">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div >
            </div >

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
        </div >
    );
}
