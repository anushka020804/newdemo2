import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import {
    ArrowLeft,
    Building2,
    Bot,
    Send,
    Paperclip,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Highlighter,
    Type
} from "lucide-react";

export function FinalDocumentEditor() {
    const navigate = useNavigate();
    const { tenderId } = useParams();

    // Mock Tender Data
    const tender = {
        id: tenderId || "1",
        title: "Industrial Valves Supply - Karnataka PWD",
        organization: "Karnataka Public Works Department",
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

                    {/* Left Column - Document Editor */}
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

                        {/* Editor Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col overflow-hidden h-[700px]"
                        >
                            <div className="bg-gray-50 border-b border-gray-100 p-4 text-center font-bold text-gray-800 text-[16px]">
                                Document Editor
                            </div>

                            {/* Toolbar Layout */}
                            <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-wrap items-center gap-2 text-gray-600">
                                {/* Font controls */}
                                <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
                                    <select className="bg-gray-50 border border-gray-200 rounded-md text-sm px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer text-gray-700 font-medium">
                                        <option>Aptos (Body)</option>
                                        <option>Arial</option>
                                        <option>Times New Roman</option>
                                        <option>Inter</option>
                                    </select>
                                    <select className="bg-gray-50 border border-gray-200 rounded-md text-sm px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer text-gray-700 font-medium">
                                        <option>12</option>
                                        <option>14</option>
                                        <option>16</option>
                                        <option>18</option>
                                    </select>
                                </div>

                                {/* Text Formatting */}
                                <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors tooltip-trigger" title="Bold">
                                        <Bold className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors tooltip-trigger" title="Italic">
                                        <Italic className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors tooltip-trigger" title="Underline">
                                        <Underline className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors tooltip-trigger" title="Strikethrough">
                                        <Strikethrough className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Text Colors */}
                                <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
                                    <button className="p-1.5 hover:bg-gray-100 rounded flex flex-col items-center gap-[2px] tooltip-trigger" title="Text Color">
                                        <Type className="w-[14px] h-[14px] text-gray-700" strokeWidth={3} />
                                        <div className="w-3 h-0.5 bg-red-500 rounded-full"></div>
                                    </button>
                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors tooltip-trigger" title="Highlight">
                                        <Highlighter className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Lists */}
                                <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors tooltip-trigger" title="Bulleted List">
                                        <List className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors tooltip-trigger" title="Numbered List">
                                        <ListOrdered className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Alignment */}
                                <div className="flex items-center gap-1">
                                    <button className="p-1.5 bg-blue-50 text-blue-600 rounded transition-colors tooltip-trigger" title="Align Left">
                                        <AlignLeft className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors tooltip-trigger" title="Align Center">
                                        <AlignCenter className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors tooltip-trigger" title="Align Right">
                                        <AlignRight className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors tooltip-trigger" title="Justify">
                                        <AlignJustify className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Actual Editor Canvas */}
                            <div className="flex-1 bg-gray-50/50 p-6 overflow-y-auto custom-scrollbar">
                                <div
                                    className="bg-white border border-gray-200 shadow-sm min-h-full rounded-lg p-8 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-shadow"
                                    contentEditable
                                    suppressContentEditableWarning
                                >
                                    {/* Default content to show it's working */}
                                    <h1 className="text-2xl font-bold mb-4">Final Bid Application</h1>
                                    <p className="text-gray-700 mb-4">
                                        To: Karnataka Public Works Department<br />
                                        Subject: Submission of Bid for Industrial Valves Supply
                                    </p>
                                    <p className="text-gray-700">
                                        We hereby submit our finalized bid documentation conforming to all standard terms and conditions...
                                    </p>
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="p-5 border-t border-gray-100 bg-white flex gap-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-8 py-3 rounded-[16px] border border-gray-300 text-gray-700 font-bold text-[15px] hover:bg-gray-50 transition-colors w-1/2"
                                >
                                    Back
                                </button>
                                <button className="px-8 py-3 rounded-[16px] bg-[#4F46E5] text-white font-bold text-[15px] hover:bg-[#4338ca] transition-colors shadow-sm w-1/2">
                                    Save
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
