import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  Building2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldAlert,
  ListChecks,
  Award,
  Download,
  Eye,
  Bot,
  Send,
  Paperclip,
  CheckCircle2
} from "lucide-react";

export function TenderDetails() {
  const navigate = useNavigate();
  const { tenderId } = useParams();

  // Accordion state management
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    summary: true, // Default open
    risks: false,
    scope: false,
    evaluation: false,
    documents: false,
  });

  const handleDownloadReport = () => {
    // Basic standard PDF generation using jsPDF
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Blue
    doc.text("Tender Analysis Report", 20, 20);

    // Tender Basics
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tender Title: ${tender.title}`, 20, 40);
    doc.text(`Organization: ${tender.organization}`, 20, 50);
    doc.text(`Reference ID: ${tender.id}`, 20, 60);

    // Metrics
    doc.setFontSize(12);
    doc.text(`Tender Value: ${tender.tenderValue}`, 20, 80);
    doc.text(`Submission Deadline: ${tender.submissionDeadline}`, 20, 90);
    doc.text(`Quantity: ${tender.quantity}`, 20, 100);
    doc.text(`HSN Code: ${tender.hsnCode}`, 20, 110);

    // Eligibility Score
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94); // Green
    doc.text("Eligibility Score: 90% (Highly Eligible)", 20, 130);

    // Save the PDF
    doc.save(`Tender_Report_${tender.id}.pdf`);
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Mock Tender Data
  const getTenderData = (id: string | undefined) => {
    const defaultData = {
      id: "1",
      title: "Industrial Valves Supply - Karnataka PWD",
      organization: "Bharat Heavy Electrical Limited (BHEL)",
      tenderValue: "₹45,00,000",
      submissionDeadline: "Feb 15, 2026",
      publishDate: "Jan 28, 2026",
      openingDate: "Feb 16, 2026",
      quantity: "500",
      hsnCode: "85019000",
      matchScore: 90,
      summary: "This tender involves the supply and installation of over 500 industrial valves for Karnataka's water distribution infrastructure. The project requires IS 14846:2000 compliant valves with cast iron or ductile iron bodies, suitable for PN 10/16 working pressure. The scope includes delivery, on-site installation, quality testing, and a 1-year warranty period. Payment will be structured in four phases: 30% advance, 40% on delivery, 20% post-installation, and 10% after warranty completion. Suppliers must demonstrate minimum 3 years of experience, hold valid GST registration, and show a turnover of at least ₹1 Crore in the previous fiscal year. ISO 9001:2015 certification is preferred. The successful bidder will also provide operational training to PWD staff.",
      risks: [
        "Strict penalty clause for delayed delivery (1% per week).",
        "Requires specific IS 14846:2000 certification which takes time to procure if not already held.",
        "Price variation clause is not applicable; fixed price contract."
      ],
      scopeOfWork: [
        "Supply of 500+ industrial valves (various sizes: 2\", 4\", 6\", 8\")",
        "Installation and commissioning at designated sites",
        "Testing and quality certification",
        "1-year warranty and maintenance support",
        "Training for PWD staff on valve operation",
      ],
      evaluationCriteria: [
        "Technical Evaluation (Pass/Fail based on IS certification)",
        "Financial Evaluation (L1 Selection)",
        "Minimum 3 years past experience verification",
        "Financial turnover capacity (Min ₹1 Crore)"
      ],
      requiredDocuments: [
        { name: "Company Registration Certificate", type: "pdf" },
        { name: "GST Registration Certificate", type: "pdf" },
        { name: "PAN Card", type: "pdf" },
        { name: "ISO Certification (if available)", type: "pdf" },
        { name: "Financial Statements (Last 3 Years)", type: "pdf" },
      ]
    };

    const tenderDatabase: { [key: string]: typeof defaultData } = {
      "1": defaultData,
      // ... Add more if necessary, defaulting to 1 for this demo
    };

    return tenderDatabase[id || "1"] || defaultData;
  };

  const tender = getTenderData(tenderId);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/analysis1/${tenderId}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-[#4F46E5]">
                Tender Details
              </h1>
              <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                TENDER/BID ID: {tender.id.startsWith("GEM") ? tender.id : `TND-${tender.id}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Main Details & Accordions */}
          <div className="lg:col-span-2 space-y-6">

            {/* Top Grid Card (Copied from Analysis1 for consistency) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
            >
              {/* Tender Header */}
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 bg-[#3B82F6] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{tender.title}</h2>
                  <p className="text-sm font-medium text-[#3B82F6]">
                    {tender.organization}
                  </p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-[#FAFAFF] rounded-[20px] border border-[#EEF2FF]">
                  <p className="text-[11px] font-bold text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-serif text-[10px]">$</span>
                    TENDER VALUE
                  </p>
                  <p className="text-[28px] font-bold text-[#4F46E5]">{tender.tenderValue}</p>
                </div>

                <div className="p-6 bg-[#FFF9F5] rounded-[20px] border border-[#FFF0E5]">
                  <p className="text-[11px] font-bold text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    BID END DATE
                  </p>
                  <p className="text-[28px] font-bold text-[#F97316] mb-1">{tender.submissionDeadline}</p>
                  <p className="text-[11px] text-[#F97316] font-medium">18 days remaining</p>
                </div>

                <div className="p-6 bg-[#F8FAFC] rounded-[20px] border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    PUBLISHED DATE
                  </p>
                  <p className="text-[15px] font-bold text-gray-900">{tender.publishDate}</p>
                </div>

                <div className="p-6 bg-[#F8FAFC] rounded-[20px] border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    BID OPENING
                  </p>
                  <p className="text-[15px] font-bold text-gray-900">{tender.openingDate}</p>
                </div>

                <div className="p-6 bg-[#F8FAFC] rounded-[20px] border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    QUANTITY
                  </p>
                  <p className="text-[15px] font-bold text-gray-900">{tender.quantity}</p>
                </div>

                <div className="p-6 bg-[#F8FAFC] rounded-[20px] border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                    </svg>
                    HSN CODE
                  </p>
                  <p className="text-[15px] font-bold text-gray-900">{tender.hsnCode}</p>
                </div>
              </div>
            </motion.div>

            {/* Accordion List Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Accordion 1: Tender Summary */}
              <div className="border-b border-gray-100 last:border-0">
                <button
                  onClick={() => toggleSection("summary")}
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col items-start gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E8FF] text-[#9333EA] text-[11px] font-semibold border border-[#E9D5FF]">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Generated Summary
                    </span>
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                      <FileText className="w-5 h-5 text-gray-400" />
                      Tender Summary
                    </div>
                  </div>
                  {openSections.summary ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openSections.summary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-[15px] leading-relaxed text-gray-600">
                          {tender.summary}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 2: Risks */}
              <div className="border-b border-gray-100 last:border-0">
                <button
                  onClick={() => toggleSection("risks")}
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <ShieldAlert className="w-5 h-5 text-gray-400" />
                    Risks
                  </div>
                  {openSections.risks ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openSections.risks && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-gray-50"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <ul className="space-y-3">
                          {tender.risks.map((risk, i) => (
                            <li key={i} className="flex gap-3 text-[15px] text-gray-700">
                              <span className="text-red-500 font-bold">•</span>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 3: Scope of Work */}
              <div className="border-b border-gray-100 last:border-0">
                <button
                  onClick={() => toggleSection("scope")}
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <ListChecks className="w-5 h-5 text-gray-400" />
                    Scope of Work
                  </div>
                  {openSections.scope ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openSections.scope && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <ul className="space-y-3">
                          {tender.scopeOfWork.map((item, i) => (
                            <li key={i} className="flex gap-3 text-[15px] text-gray-700">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 4: Evaluation Criteria */}
              <div className="border-b border-gray-100 last:border-0">
                <button
                  onClick={() => toggleSection("evaluation")}
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <Award className="w-5 h-5 text-gray-400" />
                    Evaluation Criteria
                  </div>
                  {openSections.evaluation ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openSections.evaluation && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <ol className="list-decimal list-inside space-y-2 text-[15px] text-gray-700">
                          {tender.evaluationCriteria.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ol>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 5: Required Document */}
              <div className="border-b border-gray-100 last:border-0">
                <button
                  onClick={() => toggleSection("documents")}
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <FileText className="w-5 h-5 text-gray-400" />
                    Required Document
                  </div>
                  {openSections.documents ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openSections.documents && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <ul className="space-y-3">
                          {tender.requiredDocuments.map((doc, i) => (
                            <li key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                              <span className="text-[14px] text-gray-700 font-medium flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                {doc.name}
                              </span>
                              <span className="text-[11px] uppercase font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-200">
                                {doc.type}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Actions Sidebar */}
          <div className="lg:col-span-1 space-y-4">

            {/* 1. Analysis Results Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-wider">Analysis Successful</p>
                <button
                  onClick={() => navigate(`/eligibility/${tenderId}`)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-emerald-200"
                >
                  View Eligibility
                </button>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full border-[3px] border-emerald-500 flex items-center justify-center mb-1 bg-emerald-50">
                  <span className="text-emerald-700 font-bold text-base">{tender.matchScore}%</span>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Eligible
                </span>
              </div>
            </motion.div>

            {/* 2. Download Tender Report Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={handleDownloadReport}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors text-[14px]"
            >
              <Download className="w-4 h-4 text-[#3B82F6]" />
              Download Tender Report
            </motion.button>

            {/* 3. Bid Document Preparation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-100 p-4 text-center"
            >
              <p className="text-[11px] font-bold text-gray-400 mb-3 text-left uppercase tracking-wider">Bid Document Preparation</p>
              <button
                onClick={() => navigate(`/bid-preparation/${tenderId}`)}
                className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-[14px] mb-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                Generate Bid Document(s)
              </button>
              <p className="text-[10px] text-gray-400 font-medium">
                Start preparing bid documents for your bid submission
              </p>
            </motion.div>

            {/* 4. Download Bid Document(s) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="bg-[#EFF6FF] rounded-xl border border-blue-100 p-4"
            >
              <p className="text-[11px] font-bold text-blue-400 mb-3 uppercase tracking-wider">Download Bid Document(s)</p>
              <button
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold px-4 py-3 rounded-xl text-center shadow transition-all text-[14px] mb-4"
              >
                Download All
              </button>

              <div className="space-y-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3 text-blue-500" />
                      <span className="text-[13px] font-medium text-blue-900">Document {num}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 rounded-full bg-white text-blue-600 flex items-center justify-center hover:bg-blue-50 transition-colors shadow-sm">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-full bg-white text-blue-600 flex items-center justify-center hover:bg-blue-50 transition-colors shadow-sm">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 5. Opportunity X AI Chatbot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-[300px]"
            >
              {/* Header */}
              <div className="bg-[#4F46E5] text-white p-3 font-semibold text-center text-[14px]">
                Opportunity X AI
              </div>

              {/* Chat Area */}
              <div className="flex-1 p-4 bg-white overflow-y-auto">
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                    <Bot className="w-4 h-4 text-[#4F46E5]" />
                  </div>
                  <div className="bg-gray-50 border text-[13px] border-gray-200 rounded-2xl rounded-tl-none p-3 shadow-sm text-gray-800">
                    Hey! How can I help you?<br />
                    Ask me anything related to this tender.
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="w-full border border-blue-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors shrink-0">
                    <Send className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}