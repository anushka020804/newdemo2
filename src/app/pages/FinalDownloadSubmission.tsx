import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import {
    ArrowLeft,
    Building2,
    Bot,
    Send,
    Paperclip,
    FileArchive,
    Trash2,
    CheckCircle2,
    Download
} from "lucide-react";

export function FinalDownloadSubmission() {
    const navigate = useNavigate();
    const { tenderId } = useParams();

    // Mock Tender Data
    const tender = {
        id: tenderId || "1",
        title: "Industrial Valves Supply - Karnataka PWD",
        organization: "Karnataka Public Works Department",
    };

    // State to handle document deletion visually
    const [docExists, setDocExists] = useState(true);

    const handleCompress = () => {
        // Create a dummy blob to simulate downloading a compressed zip
        const element = document.createElement("a");
        const file = new Blob(["PK\x03\x04Mock ZIP file content representing the compressed final bid documents. OpportunityX"], { type: 'application/zip' });
        element.href = URL.createObjectURL(file);
        element.download = "GEM_2025_8734834_Final_Bid_Document.zip";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to remove this document?")) {
            setDocExists(false);
        }
    };

    const handleDownload = () => {
        // Create a dummy blob to simulate downloading the final document as a PDF
        const element = document.createElement("a");
        // Using a basic string that starts with %PDF- to hint the browser/OS that this is a simulated PDF file
        const file = new Blob(["%PDF-1.4\nMock PDF file content for the final bid document. OpportunityX"], { type: 'application/pdf' });
        element.href = URL.createObjectURL(file);
        element.download = "GEM_2025_8734834_Final_Bid_Document.pdf";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(`/tender/${tenderId}/final-bid-sequence`)}
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

                    {/* Left Column - Download State */}
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

                        {/* Submission Successful Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-[24px] shadow-sm border border-[#4F46E5]/20 p-12 flex flex-col items-center justify-center min-h-[500px]"
                        >
                            <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">

                                <div className="border border-gray-300 rounded-md px-6 py-1 mb-8">
                                    <span className="text-sm font-bold text-gray-800">Final Bid Document</span>
                                </div>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                                    className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-md transform rotate-3 hover:rotate-0 transition-transform cursor-default"
                                >
                                    <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={3} />
                                </motion.div>

                                <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">
                                    Bid Document is Ready for Submission
                                </h2>

                                {/* Selected Document File Card */}
                                {docExists ? (
                                    <div className="w-full border border-blue-400 bg-blue-50/20 rounded-full px-6 py-3.5 flex justify-between items-center mb-10 group hover:border-[#4F46E5] transition-colors">
                                        <div className="font-semibold text-gray-800 text-[14px]">GEM/2025/8734834 - Final Bid Document</div>

                                        <div className="flex items-center gap-5">
                                            <div className="text-[13px] font-bold text-gray-900">
                                                File Size: <span className="font-medium text-gray-500">500kb</span>
                                            </div>

                                            <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                                                <button onClick={handleCompress} className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-blue-600 transition-colors tooltip-trigger" title="Compress File">
                                                    <FileArchive className="w-4 h-4 text-gray-600" /> Compress
                                                </button>
                                                <button onClick={handleDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors tooltip-trigger" title="Remove Document">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full border border-dashed border-gray-300 bg-gray-50 rounded-full px-6 py-5 flex justify-center items-center mb-10 text-gray-500 text-sm italic">
                                        Document has been removed.
                                    </div>
                                )}

                                <motion.button
                                    onClick={handleDownload}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-16 py-4 rounded-[20px] bg-[#4F46E5] text-white font-bold text-lg hover:bg-[#4338ca] transition-colors shadow-lg shadow-indigo-500/30 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!docExists}
                                >
                                    <Download className="w-6 h-6" strokeWidth={2.5} /> Download
                                </motion.button>
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
