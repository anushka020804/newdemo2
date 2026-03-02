import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import {
    ArrowLeft,
    Building2,
    Bot,
    Send,
    Paperclip,
    GripVertical,
    FileArchive,
    Trash2,
    Eye
} from "lucide-react";

interface SequencedDocument {
    id: string;
    order: number;
    name: string;
    size: string;
}

export function FinalBidSequence() {
    const navigate = useNavigate();
    const { tenderId } = useParams();

    // Mock Tender Data
    const tender = {
        id: tenderId || "1",
        title: "Industrial Valves Supply - Karnataka PWD",
        organization: "Karnataka Public Works Department",
    };

    const [viewingDoc, setViewingDoc] = useState<SequencedDocument | null>(null);

    const [documents, setDocuments] = useState<SequencedDocument[]>([
        { id: "1", order: 1, name: "Company Registration Certificate", size: "500kb" },
        { id: "2", order: 2, name: "GST Registration Certificate", size: "320kb" },
        { id: "3", order: 3, name: "Generated Application Bid Form", size: "850kb" },
    ]);

    // Simple swap function for demonstration (in a real app you'd use a DnD library like dnd-kit)
    const moveDocUp = (index: number) => {
        if (index === 0) return;
        const newDocs = [...documents];
        const temp = newDocs[index - 1];
        newDocs[index - 1] = newDocs[index];
        newDocs[index] = temp;
        // Update order numbers to visually reflect their new index
        setDocuments(newDocs.map((doc, i) => ({ ...doc, order: i + 1 })));
    };

    const moveDocDown = (index: number) => {
        if (index === documents.length - 1) return;
        const newDocs = [...documents];
        const temp = newDocs[index + 1];
        newDocs[index + 1] = newDocs[index];
        newDocs[index] = temp;
        // Update order numbers to visually reflect their new index
        setDocuments(newDocs.map((doc, i) => ({ ...doc, order: i + 1 })));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
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

                    {/* Left Column - Document Sequencer */}
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
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                    </span>
                                    <p className="text-sm font-medium text-gray-500">{tender.organization}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Sequencer Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex flex-col min-h-[500px]"
                        >
                            {/* List Header */}
                            <div className="flex justify-between items-end border-b border-transparent mb-6">
                                <h3 className="text-lg font-bold text-gray-900">
                                    Generated Bid Documents (Count: {documents.length})
                                </h3>
                                <p className="text-[12px] italic text-gray-500 font-medium pb-1">
                                    Arrange the Sequence of Documents (if needed)
                                </p>
                            </div>

                            {/* Reorderable List */}
                            <div className="flex-1 space-y-4">
                                {documents.map((doc, index) => (
                                    <div key={doc.id} className="flex items-center gap-3">

                                        {/* Drag Handle (Visual only for now, mapped to up/down clicks) */}
                                        <div className="flex flex-col text-gray-300">
                                            <button onClick={() => moveDocUp(index)} disabled={index === 0} className="hover:text-blue-500 focus:outline-none disabled:opacity-30 disabled:hover:text-gray-300 -mb-1">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                            </button>
                                            <button onClick={() => moveDocDown(index)} disabled={index === documents.length - 1} className="hover:text-blue-500 focus:outline-none disabled:opacity-30 disabled:hover:text-gray-300 -mt-1">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                            </button>
                                        </div>

                                        {/* Number Badge */}
                                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex flex-shrink-0 items-center justify-center text-[18px] shadow-sm">
                                            {doc.order}
                                        </div>

                                        {/* Document Card */}
                                        <div className="flex-1 border border-blue-400 rounded-full px-5 py-3 flex justify-between items-center group hover:bg-blue-50/50 transition-colors">
                                            <div className="font-semibold text-gray-800 text-sm">{doc.name}</div>

                                            <div className="flex items-center gap-5">
                                                <div className="text-[13px] font-bold text-gray-900">
                                                    File Size: <span className="font-medium text-gray-500">{doc.size}</span>
                                                </div>

                                                <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                                                    <button
                                                        onClick={() => setViewingDoc(doc)}
                                                        className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-blue-600 transition-colors tooltip-trigger"
                                                        title="View Document"
                                                    >
                                                        <Eye className="w-4 h-4" /> View
                                                    </button>
                                                    <button className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-blue-600 transition-colors tooltip-trigger" title="Compress File">
                                                        <FileArchive className="w-4 h-4 text-gray-600" /> Compress
                                                    </button>
                                                    <button className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors tooltip-trigger" title="Remove Document">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Submit Button */}
                            <div className="flex justify-center pt-8 mt-4 border-t border-gray-100">
                                <button className="px-10 py-3.5 rounded-[16px] bg-[#4F46E5] text-white font-bold text-[16px] hover:bg-[#4338ca] transition-colors shadow-sm">
                                    Prepare Final Bid Document
                                </button>
                            </div>

                        </motion.div>
                    </div>

                    {/* Right Column - Actions Sidebar */}
                    <div className="lg:col-span-1 space-y-4">

                        {/* 1. Go Back Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            onClick={() => navigate(-1)}
                            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold px-6 py-4 rounded-[24px] flex items-center justify-center gap-3 shadow-sm transition-colors text-[16px]"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
                            Go Back
                        </motion.button>

                        {/* 2. Opportunity X AI Chatbot */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[670px]"
                        >
                            {/* Header */}
                            <div className="bg-[#3B82F6] text-white p-4 font-bold text-center text-[16px]">
                                Opportunity X AI
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 p-5 bg-white overflow-y-auto">
                                <div className="flex gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-1">
                                        <Bot className="w-4 h-4 text-[#3B82F6]" />
                                    </div>
                                    <div className="bg-white border text-[13px] border-gray-200 shadow-sm rounded-2xl rounded-tl-none p-4 text-gray-800">
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
                                            className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                        />
                                    </div>
                                    <button className="p-2 text-gray-500 hover:text-[#3B82F6] transition-colors shrink-0">
                                        <Send className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-gray-500 hover:text-[#3B82F6] transition-colors shrink-0">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* View Document Modal Overlay */}
            {viewingDoc && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6 overflow-y-auto custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8 flex flex-col overflow-hidden"
                    >
                        {/* Modal Header */}
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{viewingDoc.name}</h3>
                                <p className="text-sm text-gray-500">Document #{viewingDoc.order} • {viewingDoc.size}</p>
                            </div>
                            <button
                                onClick={() => setViewingDoc(null)}
                                className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Close Preview
                            </button>
                        </div>

                        {/* Document Content Mock Canvas (A4 Aspect Ratio) */}
                        <div className="bg-gray-200 p-8 flex-1 overflow-y-auto">
                            <div className="bg-white max-w-[800px] min-h-[1000px] mx-auto shadow-md p-12 text-gray-800">
                                <div className="border-b-2 border-gray-800 pb-6 mb-8 text-center">
                                    <h1 className="text-3xl font-black uppercase tracking-wider mb-2">
                                        {viewingDoc.name}
                                    </h1>
                                    <h2 className="text-xl text-gray-600 font-medium">Karnataka Public Works Department</h2>
                                </div>

                                <div className="space-y-6 text-[15px] leading-relaxed">
                                    <p>
                                        <strong>Date:</strong> {new Date().toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>Reference ID:</strong> TND-{tender.id}
                                    </p>
                                    <div className="h-px bg-gray-200 my-6"></div>
                                    <p>
                                        To,<br />
                                        The Chief Engineer,<br />
                                        Karnataka Public Works Department
                                    </p>
                                    <p className="mt-6 text-justify">
                                        Dear Sir/Madam,
                                        <br /><br />
                                        We hereby submit our finalized documentation for the <strong>"{tender.title}"</strong> project as requested in the official tender notice.
                                        This document, classified as <em>"{viewingDoc.name}"</em>, conforms to all standard terms and conditions mandated by the statutory regulations.
                                        <br /><br />
                                        Please find the details associated with this stage of the bidding sequence. All attached declarations, stamps, and digital sign-offs are valid through the duration of the review period.
                                    </p>

                                    {/* Mock text generation to fill out the page */}
                                    <div className="space-y-4 text-gray-600 mt-8">
                                        {[...Array(4)].map((_, i) => (
                                            <p key={i} className="text-justify bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum...
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-20 pt-10 border-t border-gray-300 grid grid-cols-2 gap-8 text-sm">
                                    <div className="text-center">
                                        <div className="h-16 w-32 mx-auto border-b border-gray-400 mb-2"></div>
                                        <p className="font-bold">Authorized Signatory</p>
                                        <p className="text-gray-500">Applicant Company</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="h-16 w-32 mx-auto border-b border-gray-400 mb-2 items-center flex justify-center text-4xl text-blue-100 opacity-50"><Building2 /></div>
                                        <p className="font-bold">Company Stamp/Seal</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}

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
