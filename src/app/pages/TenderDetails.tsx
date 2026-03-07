import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
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
  CheckCircle2
} from "lucide-react";

export function TenderDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: tenderId } = useParams();

  // Accordion state management
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    summary: true, // Default open
    risks: true,   // Default open
    scope: false,
    evaluation: false,
    documents: false,
  });
  const [eligibilityOpen, setEligibilityOpen] = useState(false);

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
    doc.text(`Bid Start Date: ${tender.bidStartDate}`, 20, 80);
    doc.text(`Bid End Date: ${tender.submissionDeadline}`, 20, 90);
    doc.text(`Quantity: ${tender.quantity}`, 20, 100);
    doc.text(`HSN Code: ${tender.hsnCode}`, 20, 110);

    // Eligibility Score
    doc.setFontSize(16);
    if (tender.matchScore >= 60) {
      doc.setTextColor(34, 197, 94); // Green
      doc.text(`Eligibility Score: ${tender.matchScore}% (Eligible)`, 20, 130);
    } else {
      doc.setTextColor(239, 68, 68); // Red
      doc.text(`Eligibility Score: ${tender.matchScore}% (Not Eligible)`, 20, 130);
    }

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
      tenderValue: "TBA",
      submissionDeadline: "Feb 15, 2026",
      bidStartDate: "Jan 28, 2026",
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

  const mockTender = getTenderData(tenderId);
  const passedTender = location.state?.tender;
  const analysisPayload = location.state?.analysisResult;

  // Handle multiple possible response shapes from the API
  const analysisData = analysisPayload?.analysis?.bid_analysis
    || analysisPayload?.bid_analysis
    || (analysisPayload?.eligibility_criteria ? analysisPayload : null);

  const vendorResults = analysisPayload?.analysis?.vendor_results
    || analysisPayload?.vendor_results
    || [];

  console.log('[TenderDetails] analysisPayload:', analysisPayload);
  console.log('[TenderDetails] analysisData:', analysisData);
  console.log('[TenderDetails] vendorResults:', vendorResults);

  const rawBid = passedTender?.rawBid || {};

  // Extract eligibility score from vendor results (first vendor)
  const eligibilityScore = vendorResults?.[0]?.eligibility_score
    ?? analysisPayload?.analysis?.eligibility_score
    ?? analysisPayload?.eligibility_score
    ?? null;

  let risks: { title: string; description: string; severity?: string }[] = mockTender.risks.map((r: string) => ({ title: '', description: r }));
  let scopeOfWork = mockTender.scopeOfWork;
  let evaluationCriteria = mockTender.evaluationCriteria;
  let summary = mockTender.summary;
  let requiredDocuments: string[] = mockTender.requiredDocuments.map((d: any) => d.name);

  if (analysisData) {
    // Merge bid-level risks + vendor-level risks
    const bidRisks = Array.isArray(analysisData.risks) ? analysisData.risks : [];
    const vendorRisks = Array.isArray(vendorResults?.[0]?.risks) ? vendorResults[0].risks : [];
    const allRisks = [...bidRisks, ...vendorRisks];
    if (allRisks.length > 0) {
      risks = allRisks.map((r: any) => ({
        title: r.title || '',
        description: r.recommendation || r.description || String(r),
        severity: r.severity || 'MEDIUM',
      }));
    }
    if (analysisData.scope_of_work) {
      const sow = analysisData.scope_of_work;
      const items: string[] = [];

      // Include delivery items
      if (sow.delivery_items?.length) {
        sow.delivery_items.forEach((i: any) => {
          const parts = [i.item_name || 'Item'];
          if (i.quantity) parts.push(`${i.quantity} ${i.unit || 'units'}`);
          if (i.consignee) parts.push(`→ ${i.consignee}`);
          if (i.delivery_days) parts.push(`(${i.delivery_days} days delivery)`);
          items.push(parts.join(' - '));
        });
      }

      // Include technical specs
      if (sow.technical_specs && typeof sow.technical_specs === 'object') {
        Object.entries(sow.technical_specs).forEach(([key, val]) => {
          items.push(`${key}: ${val}`);
        });
      }

      if (items.length) scopeOfWork = items;
    }
    if (analysisData.eligibility_criteria?.length) {
      evaluationCriteria = analysisData.eligibility_criteria.map((c: any) =>
        c.human_readable_requirement || c.detail || c.criterion
      );
    }
    // Build a better summary from metadata + scope
    const summaryParts: string[] = [];
    const title = analysisData.metadata?.title;
    const category = analysisData.metadata?.category;
    if (title) summaryParts.push(title);
    if (category && category !== title && !title?.includes(category) && !category?.includes(title)) {
      summaryParts.push(`Category: ${category}`);
    }
    if (analysisData.scope_of_work?.delivery_items?.[0]) {
      const item = analysisData.scope_of_work.delivery_items[0];
      if (item.quantity) summaryParts.push(`Quantity: ${item.quantity} ${item.unit || 'units'}`);
      if (item.delivery_days) summaryParts.push(`Delivery: ${item.delivery_days} days`);
      if (item.consignee) summaryParts.push(`Delivery to: ${item.consignee}`);
    }
    if (analysisData.emd) {
      if (analysisData.emd.exemption_available) {
        summaryParts.push('EMD: Exempted');
      } else if (analysisData.emd.amount) {
        summaryParts.push(`EMD: ${analysisData.emd.currency || 'INR'} ${analysisData.emd.amount}`);
      }
    }
    if (analysisData.scope_of_work?.timelines?.bid_offer_validity_days) {
      summaryParts.push(`Bid Offer Validity: ${analysisData.scope_of_work.timelines.bid_offer_validity_days} days`);
    }
    if (summaryParts.length) summary = summaryParts.join('. ');

    // Extract required documents from eligibility criteria + vendor data
    const docItems: string[] = [];
    if (analysisData.eligibility_criteria?.length) {
      analysisData.eligibility_criteria.forEach((c: any) => {
        const id = (c.criterion_id || '').toUpperCase();
        const name = (c.criterion || '').toUpperCase();
        const detail = (c.detail || '').toUpperCase();
        const text = `${id} ${name} ${detail}`;
        if (text.includes('VENDOR_CODE') || (text.includes('DOCUMENT') && (text.includes('SUBMIT') || text.includes('REQUIRED') || text.includes('CREATION')))) {
          const vals = (c.extracted_value || c.detail || '').split(',').map((v: string) => v.trim()).filter(Boolean);
          docItems.push(...vals);
        } else if (text.includes('ISO') || (text.includes('CERTIFIC') && !text.includes('LOCAL'))) {
          docItems.push(c.criterion || c.extracted_value);
        } else if (text.includes('WARRANTY')) {
          docItems.push('Warranty Certificate');
        } else if (text.includes('TURNOVER') || text.includes('FINANCIAL')) {
          docItems.push('Financial Statements / CA Certificate (Turnover)');
        } else if (text.includes('PAST') && (text.includes('EXPERIENCE') || text.includes('PERFORMANCE'))) {
          docItems.push('Past Experience / Performance Certificates');
        } else if (text.includes('LOCAL_CONTENT') || text.includes('LOCAL CONTENT') || text.includes('MAKE IN INDIA') || text.includes('MII')) {
          docItems.push('Local Content / Make in India Certificate');
        }
      });
    }
    // Also extract from vendor rejection reasons if available
    const vendorRejections = vendorResults?.[0]?.rejection_reasons || [];
    vendorRejections.forEach((reason: string) => {
      const upper = reason.toUpperCase();
      if (upper.includes('ISO 9001') && !docItems.some(d => d.toUpperCase().includes('ISO'))) {
        docItems.push('ISO 9001 Certification');
      }
      if (upper.includes('PAN CARD') && !docItems.some(d => d.toUpperCase().includes('PAN'))) {
        docItems.push('PAN Card');
      }
      if (upper.includes('CANCELLED CHEQUE') && !docItems.some(d => d.toUpperCase().includes('CHEQUE'))) {
        docItems.push('Cancelled Cheque');
      }
      if (upper.includes('EFT MANDATE') && !docItems.some(d => d.toUpperCase().includes('EFT'))) {
        docItems.push('EFT Mandate (Bank Certified)');
      }
      if (upper.includes('WARRANTY') && !docItems.some(d => d.toUpperCase().includes('WARRANTY'))) {
        docItems.push('Warranty Certificate');
      }
    });
    // Deduplicate
    const unique = [...new Set(docItems)];
    if (unique.length) requiredDocuments = unique;
  }

  const tender = {
    ...mockTender,
    id: tenderId || mockTender.id,
    bidNumber: rawBid.bidNumber || passedTender?.tenderNumber || analysisPayload?.bidNumber || '',
    title: rawBid.bidNumber || rawBid.items || analysisPayload?.bidNumber || mockTender.title,
    organization: rawBid.organization || passedTender?.organization || analysisData?.metadata?.ministry_department || mockTender.organization,
    ministry: rawBid.ministry || '',
    department: rawBid.department || '',
    items: rawBid.items || analysisData?.metadata?.category || '',
    bidUrl: rawBid.bidUrl || analysisPayload?.bidUrl || '',
    submissionDeadline: passedTender?.submissionDate || analysisData?.metadata?.closing_date || mockTender.submissionDeadline,
    bidStartDate: passedTender?.postedDate || analysisData?.metadata?.published_date || mockTender.bidStartDate,
    quantity: passedTender?.quantity || mockTender.quantity,
    hsnCode: (rawBid.hsnCode || mockTender.hsnCode)?.toString().replace(/\.0$/, ""),
    matchScore: eligibilityScore ?? mockTender.matchScore,
    risks,
    scopeOfWork,
    evaluationCriteria,
    requiredDocuments,
    summary,
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
                TENDER/BID ID: {tender.bidNumber || (tender.id.startsWith("GEM") ? tender.id : `TND-${tender.id}`)}
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
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5"
            >
              {/* Tender Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-[#3B82F6] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{tender.title}</h2>
                  {tender.items && (
                    <div className="text-[15px] font-extrabold text-emerald-800 line-clamp-2 mt-1 mb-2" title={tender.items}>
                      Items: {tender.items}
                    </div>
                  )}
                  <p className="text-sm font-medium text-[#3B82F6]">
                    Buyer: {tender.organization}
                  </p>
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
              </div>

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
                  <p className="text-[10px] font-bold text-gray-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                    </svg>
                    HSN CODE
                  </p>
                  <p className="text-sm font-bold text-gray-900">{tender.hsnCode}</p>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-[12px] border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3h12M6 8h12M6 3v5M14 8c0 5.523-4 8-8 8M8 21l8-8" />
                    </svg>
                    QUANTITY
                  </p>
                  <p className="text-sm font-bold text-gray-900">{tender.quantity}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAFAFF] rounded-[12px] border border-[#EEF2FF]">
                  <p className="text-[10px] font-bold text-gray-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    BID START DATE
                  </p>
                  <p className="text-[20px] font-bold text-[#4F46E5]">{tender.bidStartDate}</p>
                </div>

                <div className="p-3 bg-[#FFF9F5] rounded-[12px] border border-[#FFF0E5]">
                  <p className="text-[10px] font-bold text-gray-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    BID END DATE
                  </p>
                  <p className="text-[20px] font-bold text-[#F97316]">{tender.submissionDeadline}</p>
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
                        <ul className="space-y-4">
                          {tender.risks.map((risk, i) => (
                            <li key={i} className="flex gap-3 text-[14px] text-gray-700">
                              <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${risk.severity === 'CRITICAL' ? 'bg-red-500' : risk.severity === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                              <div>
                                {risk.title && (
                                  <p className="font-semibold text-gray-900 mb-1">{risk.title}</p>
                                )}
                                <p className="text-gray-600 leading-relaxed">{risk.description}</p>
                              </div>
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
                        <ul className="space-y-2">
                          {tender.requiredDocuments.map((doc: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-[14px] text-gray-700">
                              <span className="text-gray-400 mt-0.5">•</span>
                              <span>{doc}</span>
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
              className="bg-white rounded-xl border border-gray-100 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-wider">Analysis Successful</p>
                  <button
                    onClick={() => setEligibilityOpen(!eligibilityOpen)}
                    className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors border flex items-center gap-1.5 ${tender.matchScore >= 60 ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'}`}
                  >
                    View Eligibility
                    {eligibilityOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className={`w-12 h-12 rounded-full border-[3px] flex items-center justify-center mb-1 ${tender.matchScore >= 60 ? 'border-emerald-500 bg-emerald-50' : 'border-red-500 bg-red-50'}`}>
                    <span className={`font-bold text-base ${tender.matchScore >= 60 ? 'text-emerald-700' : 'text-red-700'}`}>{tender.matchScore}%</span>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${tender.matchScore >= 60 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {tender.matchScore >= 60 ? 'Eligible' : 'Not Eligible'}
                  </span>
                </div>
              </div>
              <AnimatePresence>
                {eligibilityOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className={`text-[11px] font-bold mb-2 uppercase tracking-wider ${tender.matchScore >= 60 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {tender.matchScore >= 60 ? 'Acceptance Reasons' : 'Rejection Reasons'}
                      </p>
                      <ul className="space-y-1.5 max-h-[300px] overflow-y-auto">
                        {(tender.matchScore >= 60
                          ? (vendorResults?.[0]?.acceptance_reasons || [])
                          : (vendorResults?.[0]?.rejection_reasons || [])
                        ).map((reason: string, i: number) => {
                          const display = reason.includes(':') ? reason.split(':').slice(1).join(':').trim() : reason;
                          return (
                            <li key={i} className="flex items-start gap-2 text-[12px] text-gray-700">
                              <span className={`mt-0.5 ${tender.matchScore >= 60 ? 'text-emerald-500' : 'text-red-500'}`}>•</span>
                              <span>{display}</span>
                            </li>
                          );
                        })}
                        {(tender.matchScore >= 60
                          ? (vendorResults?.[0]?.acceptance_reasons || [])
                          : (vendorResults?.[0]?.rejection_reasons || [])
                        ).length === 0 && (
                          <li className="text-[12px] text-gray-400 italic">No reasons available</li>
                        )}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                Coming Soon! Check Demo Here
              </button>
              <p className="text-[10px] text-gray-400 font-medium">
                Start preparing bid documents for your bid submission
              </p>
            </motion.div>



          </div>
        </div>
      </div>
    </div>
  );
}