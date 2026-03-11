import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Trash2,
  Calendar,
  Building2,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  X,
  Edit2,
  Share2,
  ChevronRight
} from "lucide-react";
import { FormalBidDocument } from "../components/FormalBidDocument";
import { generateFormalBidPDF } from "../utils/generateBidPDF";
import jsPDF from "jspdf";

interface Bid {
  id: string;
  tenderName: string;
  organization: string;
  value: string;
  generatedDate: string;
  submissionDate: string;
  status: "ready" | "submitted" | "pending-docs";
  eligibilityStatus: "eligible" | "partially-eligible" | "not-eligible";
  matchScore: number;
  documents: {
    name: string;
    status: "included" | "missing";
    size?: string;
  }[];
}

export function SavedBids() {
  const navigate = useNavigate();
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [showBidDocument, setShowBidDocument] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [editingBid, setEditingBid] = useState<string | null>(null);
  const [editedBidName, setEditedBidName] = useState("");
  const [bidToDelete, setBidToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingDocument, setIsEditingDocument] = useState(false);

  // State to track saved bids
  const [bids, setBids] = useState<Bid[]>([]);
  const [isoUploaded, setIsoUploaded] = useState(false);

  // Check if ISO was uploaded
  useEffect(() => {
    const isoStatus = localStorage.getItem('isoUploaded');
    setIsoUploaded(isoStatus === 'true');
  }, []);

  // Initialize bids from localStorage instead of dummy data
  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedTenders');
      if (saved) {
        const parsedTenders = JSON.parse(saved);

        // Transform standard Tenders into the Bid format expected by this page
        // or just map them to the same structure
        const transformedBids: Bid[] = parsedTenders.map((t: any) => ({
          id: t.id,
          tenderName: t.title || t.items || t.tenderNumber || "Saved Tender",
          organization: t.organization || "Unknown Organization",
          value: t.value || "Not Specified",
          generatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          submissionDate: t.submissionDate || t.submissionDeadline || "TBA",
          status: "ready",
          eligibilityStatus: "eligible",
          matchScore: Math.round(t.eligibility_score ?? t.matchScore ?? 90), // Use actual score or fallback
          documents: [
            { name: "Technical Bid Document", status: "included", size: "1.2 MB" },
            { name: "Financial Bid Document", status: "included", size: "0.8 MB" },
            { name: "Company Registration", status: "included", size: "0.5 MB" },
            { name: "GST Certificate", status: "included", size: "0.3 MB" },
            { name: "ISO Certification", status: isoUploaded ? "included" : "missing", size: isoUploaded ? "0.4 MB" : undefined },
          ]
        }));

        setBids(transformedBids);
      } else {
        setBids([]);
      }
    } catch (e) {
      console.error("Error parsing saved tenders:", e);
      setBids([]);
    }
  }, [isoUploaded]);

  const handlePrintBid = () => {
    window.print();
  };

  const handleDeleteClick = (bidId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBidToDelete(bidId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    // Actually delete the bid from the list
    setBids(prevBids => {
      const updated = prevBids.filter(bid => bid.id !== bidToDelete);

      // Keep localStorage in sync
      try {
        const saved = localStorage.getItem('savedTenders');
        if (saved) {
          const parsedTenders = JSON.parse(saved);
          const newSaved = parsedTenders.filter((t: any) => t.id !== bidToDelete);
          localStorage.setItem('savedTenders', JSON.stringify(newSaved));
        }
      } catch (e) {
        console.error("Failed to update localStorage on delete", e);
      }

      return updated;
    });

    setShowDeleteConfirm(false);
    setBidToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setBidToDelete(null);
  };

  const savedBids = bids;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ready":
        return { label: "Ready to Submit", bg: "bg-green-100", text: "text-green-700", border: "border-green-200" };
      case "submitted":
        return { label: "Submitted", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" };
      case "pending-docs":
        return { label: "Pending Documents", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" };
      default:
        return { label: "Draft", bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  const getEligibilityConfig = (status: string) => {
    switch (status) {
      case "eligible":
        return { label: "Eligible", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" };
      case "partially-eligible":
        return { label: "Partially Eligible", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" };
      case "not-eligible":
        return { label: "Not Eligible", icon: X, color: "text-red-600", bg: "bg-red-50" };
      default:
        return { label: "Unknown", icon: AlertCircle, color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  const handleViewDocument = (docName: string) => {
    setSelectedDocument(docName);
    setShowBidDocument(true);
  };

  const handleViewBidDocument = (bid: Bid) => {
    setSelectedBid(bid);
    setShowBidDocument(true);
  };

  const handleStartEdit = (bid: Bid) => {
    setEditingBid(bid.id);
    setEditedBidName(bid.tenderName);
    // Open the bid document in edit mode
    setSelectedBid(bid);
    setShowBidDocument(true);
    setIsEditingDocument(true);
  };

  const handleSaveEdit = (bidId: string) => {
    // In real app, save to backend
    setEditingBid(null);
  };

  const handleCancelEdit = () => {
    setEditingBid(null);
    setEditedBidName("");
  };

  const handleDownloadBid = (bid: Bid) => {
    // Create a simple text file for download
    const bidContent = `
==============================================
FORMAL BID DOCUMENT
==============================================

Tender: ${bid.tenderName}
Organization: ${bid.organization}
Bid Value: ${bid.value}
Generated Date: ${bid.generatedDate}
Submission Deadline: ${bid.submissionDate}
Match Score: ${bid.matchScore}%

==============================================
1. COMPANY PROFILE
==============================================
[Company details would appear here]

==============================================
2. TECHNICAL PROPOSAL
==============================================
[Technical specifications would appear here]

==============================================
3. FINANCIAL BREAKDOWN
==============================================
[Financial details would appear here]

==============================================
4. TERMS & CONDITIONS
==============================================
[Terms and conditions would appear here]

Generated by OpportunityX - Qistonpe
    `.trim();

    // Create blob and download
    const blob = new Blob([bidContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bid_${bid.tenderName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadPDFBid = (bid: Bid) => {
    generateFormalBidPDF(bid);
  };

  const handleDownloadPDFBid_OLD = (bid: Bid) => {
    const doc = new jsPDF();
    let currentPage = 1;

    // Helper function to add page numbers
    const addPageNumber = () => {
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${currentPage}`, 105, 285, { align: 'center' });
      currentPage++;
    };

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace: number, currentY: number) => {
      if (currentY + requiredSpace > 270) {
        addPageNumber();
        doc.addPage();
        return 20; // Reset to top of new page
      }
      return currentY;
    };

    // ==================== PAGE 1: COVER PAGE ====================

    // Cover page background
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 297, 'F');

    // Company Logo Area
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(30, 30, 150, 50, 5, 5, 'F');
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(36);
    doc.setFont(undefined, 'bold');
    doc.text('OpportunityX', 105, 55, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Powered by Qistonpe', 105, 65, { align: 'center' });

    // Document Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont(undefined, 'bold');
    doc.text('FORMAL BID', 105, 120, { align: 'center' });
    doc.text('DOCUMENT', 105, 135, { align: 'center' });

    // Tender name in box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(255, 255, 255);
    doc.roundedRect(20, 155, 170, 40, 5, 5, 'FD');
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    const tenderNameLines = doc.splitTextToSize(bid.tenderName, 150);
    const startY = 165 + (40 - tenderNameLines.length * 7) / 2;
    doc.text(tenderNameLines, 105, startY, { align: 'center' });

    // Organization
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont(undefined, 'normal');
    doc.text(bid.organization, 105, 215, { align: 'center' });

    // Match Score Badge
    doc.setFillColor(34, 197, 94);
    doc.circle(105, 240, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(`${bid.matchScore}%`, 105, 243, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Match Score', 105, 250, { align: 'center' });

    // Date
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated: ${bid.generatedDate}`, 105, 270, { align: 'center' });
    doc.text(`Submission Deadline: ${bid.submissionDate}`, 105, 278, { align: 'center' });

    addPageNumber();
    doc.addPage();

    // ==================== PAGE 2: TABLE OF CONTENTS ====================

    let yPos = 30;

    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('TABLE OF CONTENTS', 20, 10);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    const tocItems = [
      { title: '1. Executive Summary', page: 3 },
      { title: '2. Company Profile', page: 3 },
      { title: '3. Technical Proposal', page: 4 },
      { title: '4. Financial Proposal', page: 5 },
      { title: '5. Compliance & Certifications', page: 6 },
      { title: '6. Terms & Conditions', page: 6 },
      { title: '7. Declarations', page: 7 },
    ];

    tocItems.forEach((item, index) => {
      doc.setFont(undefined, 'normal');
      doc.text(item.title, 30, yPos);
      doc.setFont(undefined, 'bold');
      doc.text(item.page.toString(), 180, yPos, { align: 'right' });

      // Dotted line
      doc.setDrawColor(200, 200, 200);
      doc.setLineDash([1, 2]);
      doc.line(120, yPos - 2, 175, yPos - 2);
      doc.setLineDash([]);

      yPos += 12;
    });

    // Bid Details Box
    yPos += 20;
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(20, yPos, 170, 80, 5, 5, 'F');

    yPos += 15;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('BID DETAILS', 30, yPos);

    yPos += 12;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    const bidDetails = [
      { label: 'Tender Reference No:', value: `TND/${new Date().getFullYear()}/` + Math.floor(Math.random() * 10000) },
      { label: 'Tender Value:', value: bid.value },
      { label: 'Bid Validity:', value: '90 days from submission' },
      { label: 'EMD Amount:', value: '₹' + (parseInt(bid.value.replace(/[^0-9]/g, '')) * 0.02 / 100).toFixed(2) },
      { label: 'Contact Person:', value: 'Business Development Team' },
    ];

    bidDetails.forEach(detail => {
      doc.setFont(undefined, 'bold');
      doc.text(detail.label, 30, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(detail.value, 95, yPos);
      yPos += 10;
    });

    addPageNumber();
    doc.addPage();

    // ==================== PAGE 3: EXECUTIVE SUMMARY & COMPANY PROFILE ====================

    yPos = 30;

    // Page Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('OpportunityX - Formal Bid Document', 20, 10);
    doc.text(bid.tenderName, 190, 10, { align: 'right' });

    // Section 1: Executive Summary
    doc.setFillColor(79, 70, 229);
    doc.roundedRect(20, yPos - 5, 170, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('1. EXECUTIVE SUMMARY', 25, yPos + 2);
    yPos += 15;

    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    const execSummary = `We are pleased to submit our bid for ${bid.tenderName} issued by ${bid.organization}. Our company brings extensive experience and proven capabilities in delivering high-quality products and services that meet stringent industry standards.\n\nWith a match score of ${bid.matchScore}%, we are confident that our proposal aligns perfectly with your requirements. We have thoroughly reviewed the tender specifications and confirm our complete compliance with all technical and commercial terms.\n\nOur proposal demonstrates competitive pricing of ${bid.value} while maintaining the highest quality standards. We commit to delivering within the specified timelines and look forward to establishing a successful partnership.`;
    const execLines = doc.splitTextToSize(execSummary, 170);
    doc.text(execLines, 20, yPos);
    yPos += execLines.length * 5 + 15;

    yPos = checkNewPage(50, yPos);

    // Section 2: Company Profile
    doc.setFillColor(79, 70, 229);
    doc.roundedRect(20, yPos - 5, 170, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('2. COMPANY PROFILE', 25, yPos + 2);
    yPos += 15;

    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    const companyProfile = `Our organization is a leading provider in the industry with over a decade of operational excellence. We have successfully completed numerous projects for government and private sector clients, building a reputation for reliability, quality, and timely delivery.\n\nKey Highlights:\n• Established presence with modern infrastructure and skilled workforce\n• ISO 9001:2015 certified quality management systems\n• Strong financial standing with annual turnover exceeding ₹50 Crores\n• Proven track record in similar projects with 98% client satisfaction rate\n• State-of-the-art facilities equipped with advanced technology\n• Dedicated project management and quality assurance teams\n• Comprehensive insurance coverage for all operations`;
    const companyLines = doc.splitTextToSize(companyProfile, 170);
    doc.text(companyLines, 20, yPos);
    yPos += companyLines.length * 5 + 10;

    addPageNumber();
    doc.addPage();

    // ==================== PAGE 4: TECHNICAL PROPOSAL ====================

    yPos = 30;

    // Page Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('OpportunityX - Formal Bid Document', 20, 10);
    doc.text(bid.tenderName, 190, 10, { align: 'right' });

    // Section 3: Technical Proposal
    doc.setFillColor(79, 70, 229);
    doc.roundedRect(20, yPos - 5, 170, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('3. TECHNICAL PROPOSAL', 25, yPos + 2);
    yPos += 15;

    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('3.1 Scope of Work', 20, yPos);
    yPos += 10;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    const scopeText = `We propose to supply/execute the complete scope of work as specified in the tender document. Our approach includes comprehensive planning, quality assurance, and timely execution to ensure complete satisfaction of all requirements.`;
    const scopeLines = doc.splitTextToSize(scopeText, 170);
    doc.text(scopeLines, 20, yPos);
    yPos += scopeLines.length * 5 + 12;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('3.2 Technical Specifications Compliance', 20, yPos);
    yPos += 10;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.text('• Full compliance with technical specifications as per tender document', 25, yPos);
    yPos += 7;
    doc.text('• All materials/products will meet or exceed specified standards', 25, yPos);
    yPos += 7;
    doc.text('• Quality testing and certification will be provided as required', 25, yPos);
    yPos += 7;
    doc.text('• Adherence to relevant IS/BIS/ISO standards', 25, yPos);
    yPos += 15;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('3.3 Implementation Timeline', 20, yPos);
    yPos += 10;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);

    // Timeline table
    doc.setFillColor(245, 247, 250);
    doc.rect(20, yPos, 170, 50, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, yPos, 170, 50);

    const phases = [
      { phase: 'Phase 1: Planning & Mobilization', duration: '2 weeks' },
      { phase: 'Phase 2: Procurement & Setup', duration: '4 weeks' },
      { phase: 'Phase 3: Execution', duration: '8 weeks' },
      { phase: 'Phase 4: Testing & Handover', duration: '2 weeks' },
    ];

    let tableY = yPos + 8;
    doc.setFont(undefined, 'bold');
    doc.text('Phase', 25, tableY);
    doc.text('Duration', 150, tableY);
    tableY += 5;
    doc.line(20, tableY, 190, tableY);
    tableY += 8;

    doc.setFont(undefined, 'normal');
    phases.forEach(phase => {
      doc.text(phase.phase, 25, tableY);
      doc.text(phase.duration, 150, tableY);
      tableY += 8;
    });

    yPos += 60;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('3.4 Quality Assurance', 20, yPos);
    yPos += 10;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    const qaText = `Our quality management system ensures strict adherence to specifications. All deliverables will undergo rigorous testing and inspection before submission. We maintain comprehensive documentation and provide quality certificates as required.`;
    const qaLines = doc.splitTextToSize(qaText, 170);
    doc.text(qaLines, 20, yPos);
    yPos += qaLines.length * 5 + 10;

    addPageNumber();
    doc.addPage();

    // ==================== PAGE 5: FINANCIAL PROPOSAL ====================

    yPos = 30;

    // Page Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('OpportunityX - Formal Bid Document', 20, 10);
    doc.text(bid.tenderName, 190, 10, { align: 'right' });

    // Section 4: Financial Proposal
    doc.setFillColor(79, 70, 229);
    doc.roundedRect(20, yPos - 5, 170, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('4. FINANCIAL PROPOSAL', 25, yPos + 2);
    yPos += 15;

    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('4.1 Price Breakdown', 20, yPos);
    yPos += 12;

    // Financial Table
    const baseValue = parseInt(bid.value.replace(/[^0-9]/g, '')) / 100;
    const gstAmount = baseValue * 0.18;
    const totalValue = baseValue + gstAmount;
    const emdAmount = baseValue * 0.02;

    doc.setFillColor(245, 247, 250);
    doc.rect(20, yPos, 170, 70, 'F');
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.rect(20, yPos, 170, 70);

    let finY = yPos + 10;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.text('Description', 25, finY);
    doc.text('Amount (₹)', 150, finY, { align: 'right' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, finY + 3, 190, finY + 3);
    finY += 12;

    doc.setFont(undefined, 'normal');

    const financialItems = [
      { desc: 'Base Bid Value', amount: baseValue.toFixed(2) },
      { desc: 'GST @ 18%', amount: gstAmount.toFixed(2) },
      { desc: 'Total Bid Value (Inclusive of GST)', amount: totalValue.toFixed(2), bold: true },
      { desc: 'EMD Amount (2% of base value)', amount: emdAmount.toFixed(2) },
    ];

    financialItems.forEach((item, index) => {
      if (item.bold) {
        doc.setFont(undefined, 'bold');
        doc.setFillColor(79, 70, 229);
        doc.rect(20, finY - 7, 170, 10, 'F');
        doc.setTextColor(255, 255, 255);
      } else {
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
      }

      doc.text(item.desc, 25, finY);
      doc.text(item.amount, 185, finY, { align: 'right' });
      finY += 10;

      if (item.bold) {
        doc.setTextColor(0, 0, 0);
      }
    });

    yPos += 80;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('4.2 Payment Terms', 20, yPos);
    yPos += 10;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    const paymentTerms = [
      '• Payment will be processed as per the payment schedule mentioned in tender',
      '• All payments subject to TDS as applicable under Income Tax Act',
      '• Performance guarantee: 10% of contract value',
      '• Payment against milestones with proper documentation',
      '• Final payment after successful completion and acceptance',
    ];

    paymentTerms.forEach(term => {
      doc.text(term, 20, yPos);
      yPos += 8;
    });

    yPos += 10;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('4.3 Validity of Offer', 20, yPos);
    yPos += 10;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.text('This bid remains valid for 90 days from the date of submission.', 20, yPos);

    addPageNumber();
    doc.addPage();

    // ==================== PAGE 6: COMPLIANCE & TERMS ====================

    yPos = 30;

    // Page Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('OpportunityX - Formal Bid Document', 20, 10);
    doc.text(bid.tenderName, 190, 10, { align: 'right' });

    // Section 5: Compliance & Certifications
    doc.setFillColor(79, 70, 229);
    doc.roundedRect(20, yPos - 5, 170, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('5. COMPLIANCE & CERTIFICATIONS', 25, yPos + 2);
    yPos += 15;

    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);

    const certifications = [
      '✓ Company Registration Certificate - Attached',
      '✓ GST Registration Certificate - Attached',
      '✓ PAN Card - Attached',
      '✓ ISO 9001:2015 Certification - Attached',
      '✓ Financial Statements (Last 3 Years) - Attached',
      '✓ Income Tax Returns (Last 3 Years) - Attached',
      '✓ Bank Solvency Certificate - Attached',
      '✓ Experience Certificates - Attached',
      '✓ EMD/Bid Security - As per tender requirements',
    ];

    certifications.forEach(cert => {
      doc.text(cert, 20, yPos);
      yPos += 8;
    });

    yPos += 10;

    // Section 6: Terms & Conditions
    doc.setFillColor(79, 70, 229);
    doc.roundedRect(20, yPos - 5, 170, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('6. TERMS & CONDITIONS', 25, yPos + 2);
    yPos += 15;

    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);

    const terms = [
      '1. All terms and conditions of the tender document are accepted without deviation.',
      '2. Delivery/execution timeline as specified in the tender will be strictly adhered to.',
      '3. All applicable quality standards and certifications will be maintained.',
      '4. Any disputes shall be subject to jurisdiction of courts in the tender issuing location.',
      '5. Force majeure clause as per standard industry practice shall apply.',
      '6. All necessary insurance coverage will be maintained during contract period.',
      '7. We agree to abide by all statutory and regulatory requirements.',
      '8. Performance guarantee and warranty terms as specified will be provided.',
    ];

    terms.forEach(term => {
      const termLines = doc.splitTextToSize(term, 165);
      doc.text(termLines, 20, yPos);
      yPos += termLines.length * 6 + 2;
    });

    addPageNumber();
    doc.addPage();

    // ==================== PAGE 7: DECLARATIONS ====================

    yPos = 30;

    // Page Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('OpportunityX - Formal Bid Document', 20, 10);
    doc.text(bid.tenderName, 190, 10, { align: 'right' });

    // Section 7: Declarations
    doc.setFillColor(79, 70, 229);
    doc.roundedRect(20, yPos - 5, 170, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('7. DECLARATIONS', 25, yPos + 2);
    yPos += 15;

    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);

    const declarations = `We hereby declare that:\n\n• All information provided in this bid is true and accurate to the best of our knowledge.\n\n• We have not been blacklisted or debarred by any government organization.\n\n• We have carefully read and understood all terms and conditions of the tender.\n\n• We accept all terms and conditions without any deviation.\n\n• We have the technical and financial capability to execute this project.\n\n• We will provide all required documents and certifications if awarded the contract.\n\n• We understand that any false information may lead to disqualification and legal action.`;

    const declarationLines = doc.splitTextToSize(declarations, 170);
    doc.text(declarationLines, 20, yPos);
    yPos += declarationLines.length * 5 + 20;

    yPos = checkNewPage(80, yPos);

    // Signature Section
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 90, yPos);
    yPos += 7;
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Authorized Signatory', 20, yPos);
    yPos += 6;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text('Name: _________________________', 20, yPos);
    yPos += 8;
    doc.text('Designation: ____________________', 20, yPos);
    yPos += 8;
    doc.text('Date: ' + new Date().toLocaleDateString('en-GB'), 20, yPos);

    // Company Stamp Box
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.roundedRect(120, yPos - 30, 70, 40, 3, 3);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Company Seal/Stamp', 155, yPos - 5, { align: 'center' });

    yPos += 25;

    // Contact Information
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(20, yPos, 170, 35, 5, 5, 'F');
    yPos += 10;

    doc.setTextColor(79, 70, 229);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('CONTACT INFORMATION', 105, yPos, { align: 'center' });
    yPos += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text('Email: bids@opportunityx.com | Phone: +91-XXXX-XXXXXX', 105, yPos, { align: 'center' });
    yPos += 6;
    doc.text('Website: www.opportunityx.com', 105, yPos, { align: 'center' });

    // Footer
    yPos = 270;
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 6;
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.setFont(undefined, 'italic');
    doc.text('This document is generated by OpportunityX (Qistonpe) - AI-powered tender management platform', 105, yPos, { align: 'center' });
    yPos += 5;
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 105, yPos, { align: 'center' });

    addPageNumber();

    // Save the PDF
    doc.save(`Bid_${bid.tenderName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Saved Bids
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">{savedBids.length} saved bids</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="space-y-4">
          {savedBids.map((bid, index) => {
            const statusConfig = getStatusConfig(bid.status);
            const eligibilityConfig = getEligibilityConfig(bid.eligibilityStatus);
            const missingDocs = bid.documents.filter(doc => doc.status === "missing");
            const EligibilityIcon = eligibilityConfig.icon;

            return (
              <motion.div
                key={bid.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-5 border border-gray-100"
              >
                {/* Header Section - Stacks on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-2">{bid.tenderName}</h3>
                      <p className="text-xs sm:text-sm font-medium text-blue-600 truncate">{bid.organization}</p>
                    </div>
                  </div>

                  <div className={`self-start px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} text-xs sm:text-sm font-medium whitespace-nowrap`}>
                    {statusConfig.label}
                  </div>
                </div>

                {/* Info Grid - 2 cols on mobile, 4 on desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
                  <div className="p-2 sm:p-2.5 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100">
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">Tender Value</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{bid.value}</span>
                    </p>
                  </div>
                  <div className="p-2 sm:p-2.5 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100">
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">Generated On</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-1">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{bid.generatedDate}</span>
                    </p>
                  </div>
                  <div className="p-2 sm:p-2.5 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100">
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">Submission Date</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-1">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{bid.submissionDate}</span>
                    </p>
                  </div>
                  <div className="p-2 sm:p-2.5 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100">
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">Documents</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
                      {bid.documents.filter(d => d.status === "included").length}/{bid.documents.length} included
                    </p>
                  </div>
                </div>

                {/* Action Buttons - Stack on mobile, row on desktop */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadPDFBid(bid)}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white text-indigo-600 rounded-lg sm:rounded-xl hover:bg-indigo-50 transition-all border border-indigo-200 text-xs sm:text-sm font-semibold flex-1 sm:flex-none"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(bid.id, e)}
                      className="p-2 sm:p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-colors border border-blue-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => navigate(`/analysis1/${encodeURIComponent(bid.id)}`, { state: { tender: bids.find(b => b.id === bid.id) } })}
                    className="sm:ml-auto bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-colors font-semibold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2"
                  >
                    View Bid Detail
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bid Documentation Modal */}
      <AnimatePresence>
        {selectedBid && showBidDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 z-50"
            onClick={() => {
              setShowBidDocument(false);
              setIsEditingDocument(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 sm:p-6 text-white">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 pr-2">
                    <h2 className="text-lg sm:text-2xl mb-1">Formal Bid Document</h2>
                    <p className="text-indigo-100 text-xs sm:text-sm truncate">{selectedBid.tenderName}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowBidDocument(false);
                      setIsEditingDocument(false);
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Document Actions */}
                <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="bg-white/20 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2">
                    <p className="text-[10px] sm:text-xs text-indigo-100 mb-0.5 sm:mb-1">Match Score</p>
                    <p className="text-xs sm:text-sm font-medium">{selectedBid.matchScore}%</p>
                  </div>
                  {!isEditingDocument && (
                    <button
                      onClick={() => setIsEditingDocument(true)}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all text-xs sm:text-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Edit Document</span>
                    </button>
                  )}
                  {isEditingDocument && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditingDocument(false)}
                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-all text-xs sm:text-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Save Changes</span>
                        <span className="xs:hidden">Save</span>
                      </button>
                      <button
                        onClick={() => setIsEditingDocument(false)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {isEditingDocument ? (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 sm:p-6 mb-4">
                    <div className="flex items-start gap-2 sm:gap-3 mb-4">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs sm:text-sm text-yellow-900 mb-1">
                          <strong>Edit Mode Active</strong>
                        </p>
                        <p className="text-[10px] sm:text-xs text-yellow-700">
                          You can now edit the bid document. Click "Save Changes" when done.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className={`bg-white rounded-lg p-3 sm:p-6 ${isEditingDocument ? 'border-2 border-indigo-300' : ''}`}>
                  <FormalBidDocument
                    tenderName={selectedBid.tenderName}
                    organization={selectedBid.organization}
                    value={selectedBid.value}
                    submissionDate={selectedBid.submissionDate}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => handleDownloadPDFBid(selectedBid)}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => {
                      setShowBidDocument(false);
                      setIsEditingDocument(false);
                    }}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors border border-gray-300 text-sm sm:text-base"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 z-50"
            onClick={handleCancelDelete}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6"
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl text-gray-900 mb-1 sm:mb-2">Delete Bid?</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Are you sure you want to delete this bid? This action cannot be undone and all associated documents will be permanently removed.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 bg-white text-gray-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors border border-gray-300 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
