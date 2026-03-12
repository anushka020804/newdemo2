import jsPDF from "jspdf";

interface Bid {
  tenderName?: string;
  organization?: string;
  value?: string;
  generatedDate?: string;
  submissionDate?: string;
  matchScore?: number;
  tenderRef?: string;
  tenderTitle?: string;
  location?: string;
  deadline?: string;
}

export function generateFormalBidPDF(bid: Bid, returnBlob = false): Blob | void {
  const doc = new jsPDF();
  let currentPage = 1;
  
  // Normalize bid data - handle both tenderName and tenderTitle
  const tenderName = bid.tenderName || bid.tenderTitle || 'N/A';
  const organization = bid.organization || 'N/A';
  const value = bid.value || 'N/A';
  const generatedDate = bid.generatedDate || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const submissionDate = bid.submissionDate || bid.deadline || 'N/A';
  
  // Helper function to add page numbers and footer
  const addPageFooter = () => {
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.text(`Page ${currentPage} of 7`, 105, 285, { align: 'center' });
    doc.line(20, 280, 190, 280);
    currentPage++;
  };
  
  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number, currentY: number) => {
    if (currentY + requiredSpace > 270) {
      addPageFooter();
      doc.addPage();
      return 30; // Reset to top of new page with header space
    }
    return currentY;
  };
  
  // ==================== PAGE 1: COVER PAGE ====================
  
  // Top border
  doc.setLineWidth(2);
  doc.setDrawColor(0, 0, 0);
  doc.line(20, 20, 190, 20);
  doc.line(20, 22, 190, 22);
  
  let yPos = 50;
  
  // Company Name
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('OpportunityX', 105, yPos, { align: 'center' });
  yPos += 8;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('A Qistonpe Initiative', 105, yPos, { align: 'center' });
  
  yPos += 30;
  
  // Document Type
  doc.setLineWidth(0.5);
  doc.rect(40, yPos - 5, 130, 20);
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('TECHNICAL & FINANCIAL BID', 105, yPos + 5, { align: 'center' });
  
  yPos += 40;
  
  // Tender Details Box
  doc.setLineWidth(0.5);
  doc.rect(20, yPos, 170, 80);
  yPos += 10;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('TENDER DETAILS', 105, yPos, { align: 'center' });
  yPos += 15;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  const tenderRef = bid.tenderRef || `TND/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`;
  
  doc.setFont(undefined, 'bold');
  doc.text('Tender Reference:', 30, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(tenderRef, 180, yPos, { align: 'right' });
  yPos += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('Tender Name:', 30, yPos);
  doc.setFont(undefined, 'normal');
  const tenderNameLines = doc.splitTextToSize(tenderName, 100);
  doc.text(tenderNameLines, 30, yPos + 7);
  yPos += tenderNameLines.length * 5 + 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('Issuing Authority:', 30, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(organization, 180, yPos, { align: 'right' });
  yPos += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('Bid Value:', 30, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(value, 180, yPos, { align: 'right' });
  
  yPos += 25;
  
  // Submission Details
  doc.rect(20, yPos, 170, 40);
  yPos += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('SUBMISSION DETAILS', 105, yPos, { align: 'center' });
  yPos += 12;
  
  doc.setFont(undefined, 'normal');
  doc.text('Date of Bid Preparation:', 30, yPos);
  doc.text(generatedDate, 180, yPos, { align: 'right' });
  yPos += 10;
  
  doc.text('Last Date of Submission:', 30, yPos);
  doc.text(submissionDate, 180, yPos, { align: 'right' });
  
  yPos += 30;
  
  // Disclaimer
  doc.setFontSize(9);
  doc.setFont(undefined, 'italic');
  const disclaimer = 'This bid document has been prepared in response to the tender notification. All information provided herein is true and correct to the best of our knowledge.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, 170);
  doc.text(disclaimerLines, 105, yPos, { align: 'center' });
  
  // Bottom border
  doc.setLineWidth(2);
  doc.line(20, 275, 190, 275);
  doc.line(20, 277, 190, 277);
  
  addPageFooter();
  doc.addPage();
  
  // ==================== PAGE 2: INDEX & DOCUMENT CHECKLIST ====================
  
  yPos = 30;
  
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('INDEX', 20, yPos);
  doc.setLineWidth(0.5);
  doc.line(20, yPos + 2, 40, yPos + 2);
  yPos += 15;
  
  doc.setFontSize(11);
  
  const indexItems = [
    { section: 'Section I', title: 'Covering Letter', page: '3' },
    { section: 'Section II', title: 'Company Profile & Credentials', page: '3' },
    { section: 'Section III', title: 'Technical Bid', page: '4' },
    { section: 'Section IV', title: 'Financial Bid', page: '5' },
    { section: 'Section V', title: 'Compliance Statement', page: '6' },
    { section: 'Section VI', title: 'Terms & Conditions', page: '6' },
    { section: 'Section VII', title: 'Declarations & Undertakings', page: '7' },
  ];
  
  doc.rect(20, yPos - 5, 170, 95);
  
  indexItems.forEach((item, index) => {
    if (index === 0) {
      doc.setFont(undefined, 'bold');
      doc.setFontSize(10);
      doc.text('SECTION', 25, yPos);
      doc.text('PARTICULARS', 60, yPos);
      doc.text('PAGE', 175, yPos, { align: 'right' });
      doc.line(20, yPos + 2, 190, yPos + 2);
      yPos += 10;
    }
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(item.section, 25, yPos);
    doc.text(item.title, 60, yPos);
    doc.text(item.page, 175, yPos, { align: 'right' });
    yPos += 12;
  });
  
  yPos += 10;
  
  // Document Checklist
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('DOCUMENT CHECKLIST', 20, yPos);
  doc.line(20, yPos + 2, 85, yPos + 2);
  yPos += 15;
  
  doc.setFontSize(10);
  
  const checklistItems = [
    'Company Registration Certificate',
    'GST Registration Certificate',
    'PAN Card',
    'ISO 9001:2015 Certification',
    'Audited Financial Statements (Last 3 Years)',
    'Income Tax Returns (Last 3 Years)',
    'Bank Solvency Certificate',
    'Experience Certificates / Work Orders',
    'Undertaking on Company Letterhead',
    'Earnest Money Deposit (EMD) Details',
  ];
  
  doc.rect(20, yPos - 5, 170, 135);
  
  doc.setFont(undefined, 'bold');
  doc.text('S.No.', 25, yPos);
  doc.text('Document Name', 45, yPos);
  doc.text('Status', 165, yPos, { align: 'right' });
  doc.line(20, yPos + 2, 190, yPos + 2);
  yPos += 10;
  
  doc.setFont(undefined, 'normal');
  checklistItems.forEach((item, index) => {
    doc.text((index + 1).toString(), 25, yPos);
    doc.text(item, 45, yPos);
    doc.text('Enclosed', 165, yPos, { align: 'right' });
    yPos += 12;
  });
  
  addPageFooter();
  doc.addPage();
  
  // ==================== PAGE 3: COVERING LETTER & COMPANY PROFILE ====================
  
  yPos = 30;
  
  // Section I: Covering Letter
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('SECTION I: COVERING LETTER', 20, yPos);
  doc.setLineWidth(0.5);
  doc.line(20, yPos + 2, 95, yPos + 2);
  yPos += 15;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  doc.text('Date: ' + new Date().toLocaleDateString('en-GB'), 20, yPos);
  yPos += 10;
  
  doc.text('To,', 20, yPos);
  yPos += 7;
  doc.setFont(undefined, 'bold');
  doc.text(organization, 20, yPos);
  yPos += 15;
  
  doc.setFont(undefined, 'bold');
  const subjectText = 'Subject: Submission of Bid for ' + tenderRef;
  const subjectLines = doc.splitTextToSize(subjectText, 170);
  doc.text(subjectLines, 20, yPos);
  yPos += subjectLines.length * 5 + 7;
  
  doc.setFont(undefined, 'normal');
  doc.text('Dear Sir/Madam,', 20, yPos);
  yPos += 12;
  
  const coveringLetter = `With reference to your tender notification for "${tenderName}", we are pleased to submit our technical and financial bid for your kind consideration.\n\nWe have carefully examined all tender documents, including specifications, terms and conditions, and confirm that we have no objection to any of the stated requirements. We hereby confirm our acceptance of all terms and conditions without any deviation.\n\nWe declare that we possess the necessary technical expertise, financial capability, and infrastructure to execute this project as per the specified timelines and quality standards. Our team has thoroughly reviewed all requirements and we are confident of delivering the project to your complete satisfaction.\n\nThe bid validity period is 90 days from the date of submission. We understand that you reserve the right to accept or reject any bid without assigning any reason thereof.\n\nWe look forward to your favorable consideration of our proposal.`;
  
  const letterLines = doc.splitTextToSize(coveringLetter, 170);
  doc.text(letterLines, 20, yPos);
  yPos += letterLines.length * 5 + 12;
  
  doc.text('Yours faithfully,', 20, yPos);
  yPos += 20;
  
  doc.text('_______________________________', 20, yPos);
  yPos += 7;
  doc.setFont(undefined, 'bold');
  doc.text('Authorized Signatory', 20, yPos);
  yPos += 6;
  doc.setFont(undefined, 'normal');
  doc.text('(Company Seal)', 20, yPos);
  
  yPos += 20;
  
  yPos = checkNewPage(60, yPos);
  
  // Section II: Company Profile
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('SECTION II: COMPANY PROFILE & CREDENTIALS', 20, yPos);
  doc.line(20, yPos + 2, 125, yPos + 2);
  yPos += 15;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('2.1 Organization Overview', 20, yPos);
  yPos += 10;
  
  doc.setFont(undefined, 'normal');
  const companyOverview = `Our organization is a well-established entity with a proven track record in the industry. We have been operational for over a decade, serving both government and private sector clients across the country. Our commitment to quality, timely delivery, and customer satisfaction has earned us a reputation as a reliable and trustworthy partner.\n\nWe maintain state-of-the-art facilities equipped with modern machinery and technology. Our team comprises highly qualified and experienced professionals who bring deep domain expertise to every project. We follow stringent quality control processes and are certified under ISO 9001:2015 quality management standards.`;
  
  const overviewLines = doc.splitTextToSize(companyOverview, 170);
  doc.text(overviewLines, 20, yPos);
  yPos += overviewLines.length * 5 + 12;
  
  addPageFooter();
  doc.addPage();
  
  // ==================== PAGE 4: TECHNICAL BID ====================
  
  yPos = 30;
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('SECTION III: TECHNICAL BID', 20, yPos);
  doc.line(20, yPos + 2, 85, yPos + 2);
  yPos += 15;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('3.1 Understanding of Scope', 20, yPos);
  yPos += 10;
  
  doc.setFont(undefined, 'normal');
  const scopeUnderstanding = `We have thoroughly studied the tender document and understand that the scope of work includes all activities as specified in the technical specifications. We confirm that we have visited the site (if applicable) and have taken into account all factors that may affect the execution of work.\n\nOur approach to this project is methodical and comprehensive. We will ensure that all deliverables meet or exceed the specified standards and that work is completed within the stipulated timeframe.`;
  
  const scopeLines = doc.splitTextToSize(scopeUnderstanding, 170);
  doc.text(scopeLines, 20, yPos);
  yPos += scopeLines.length * 5 + 12;
  
  doc.setFont(undefined, 'bold');
  doc.text('3.2 Technical Specifications Compliance', 20, yPos);
  yPos += 10;
  
  doc.setFont(undefined, 'normal');
  const techCompliance = `All materials, equipment, and workmanship shall conform to the specifications mentioned in the tender document. We confirm compliance with the following:\n\n• All products/materials will be as per IS/BIS/ISO standards\n• Quality testing will be conducted at certified laboratories\n• All necessary certifications and test reports will be provided\n• Work will be executed as per approved drawings and specifications\n• Any deviations, if required, will be taken up with prior approval`;
  
  const complianceLines = doc.splitTextToSize(techCompliance, 170);
  doc.text(complianceLines, 20, yPos);
  yPos += complianceLines.length * 5 + 12;
  
  doc.setFont(undefined, 'bold');
  doc.text('3.3 Project Execution Plan', 20, yPos);
  yPos += 10;
  
  doc.setFont(undefined, 'normal');
  
  // Timeline Table
  doc.setLineWidth(0.5);
  doc.rect(20, yPos, 170, 75);
  
  yPos += 8;
  doc.setFont(undefined, 'bold');
  doc.text('Phase', 25, yPos);
  doc.text('Activities', 70, yPos);
  doc.text('Timeline', 160, yPos, { align: 'right' });
  doc.line(20, yPos + 2, 190, yPos + 2);
  yPos += 10;
  
  doc.setFont(undefined, 'normal');
  const phases = [
    { phase: 'Phase 1', activity: 'Planning, Mobilization & Documentation', timeline: '2 weeks' },
    { phase: 'Phase 2', activity: 'Procurement & Site Setup', timeline: '4 weeks' },
    { phase: 'Phase 3', activity: 'Main Execution Work', timeline: '8 weeks' },
    { phase: 'Phase 4', activity: 'Testing, Commissioning & Handover', timeline: '2 weeks' },
  ];
  
  phases.forEach(p => {
    const activityLines = doc.splitTextToSize(p.activity, 80);
    doc.text(p.phase, 25, yPos);
    doc.text(activityLines, 70, yPos);
    doc.text(p.timeline, 160, yPos, { align: 'right' });
    yPos += Math.max(activityLines.length * 5, 7) + 5;
  });
  
  doc.setFont(undefined, 'bold');
  yPos += 5;
  doc.text('Total Duration: 16 weeks', 25, yPos);
  
  yPos += 15;
  
  doc.setFont(undefined, 'bold');
  doc.text('3.4 Quality Assurance & Control', 20, yPos);
  yPos += 10;
  
  doc.setFont(undefined, 'normal');
  const qaText = `We maintain a comprehensive quality management system certified under ISO 9001:2015. All work will be subject to multi-level quality checks. We will maintain detailed quality documentation and provide all required test certificates. Any non-conformance will be rectified immediately at no additional cost.`;
  
  const qaLines = doc.splitTextToSize(qaText, 170);
  doc.text(qaLines, 20, yPos);
  yPos += qaLines.length * 5 + 10;
  
  addPageFooter();
  doc.addPage();
  
  // ==================== PAGE 5: FINANCIAL BID ====================
  
  yPos = 30;
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('SECTION IV: FINANCIAL BID', 20, yPos);
  doc.line(20, yPos + 2, 80, yPos + 2);
  yPos += 15;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('4.1 Price Schedule', 20, yPos);
  yPos += 12;
  
  // Calculate values
  const baseValue = parseInt(value.replace(/[^0-9]/g, '')) / 100;
  const gstAmount = baseValue * 0.18;
  const totalValue = baseValue + gstAmount;
  const emdAmount = baseValue * 0.02;
  const performanceGuarantee = baseValue * 0.10;
  
  // Financial Table
  doc.setLineWidth(0.5);
  const tableHeight = 85;
  doc.rect(20, yPos, 170, tableHeight);
  
  // Header
  yPos += 8;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.text('S.No.', 25, yPos);
  doc.text('Description', 50, yPos);
  doc.text('Amount (INR)', 165, yPos, { align: 'right' });
  doc.line(20, yPos + 2, 190, yPos + 2);
  yPos += 10;
  
  // Items
  doc.setFont(undefined, 'normal');
  const financialItems = [
    { sno: '1', desc: 'Basic Bid Amount (Excluding Taxes)', amount: baseValue.toFixed(2) },
    { sno: '2', desc: 'Goods & Services Tax (GST) @ 18%', amount: gstAmount.toFixed(2) },
    { sno: '3', desc: 'Total Bid Amount (Inclusive of all taxes)', amount: totalValue.toFixed(2), bold: true },
    { sno: '', desc: '', amount: '' },
    { sno: '4', desc: 'Earnest Money Deposit (EMD) @ 2%', amount: emdAmount.toFixed(2) },
    { sno: '5', desc: 'Performance Guarantee @ 10%', amount: performanceGuarantee.toFixed(2) },
  ];
  
  financialItems.forEach(item => {
    if (item.bold) {
      doc.setFont(undefined, 'bold');
      doc.line(20, yPos - 3, 190, yPos - 3);
    }
    
    if (item.sno) {
      doc.text(item.sno, 25, yPos);
      doc.text(item.desc, 50, yPos);
      doc.text(item.amount, 185, yPos, { align: 'right' });
    }
    
    if (item.bold) {
      doc.line(20, yPos + 2, 190, yPos + 2);
      doc.setFont(undefined, 'normal');
    }
    
    yPos += 10;
  });
  
  yPos += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('Amount in Words:', 20, yPos);
  yPos += 7;
  doc.setFont(undefined, 'normal');
  doc.text('Rupees ' + value + ' Only', 20, yPos);
  
  yPos += 20;
  
  doc.setFont(undefined, 'bold');
  doc.text('4.2 Payment Terms', 20, yPos);
  yPos += 10;
  
  doc.setFont(undefined, 'normal');
  const paymentTermsText = `Payment shall be made as per the following schedule:\n\n1. Advance Payment: Not applicable (or as per tender terms)\n2. Milestone Payments: As per completion of work milestones\n3. Retention Money: 10% to be retained till warranty period\n4. Final Payment: Within 30 days of satisfactory completion\n5. All payments subject to TDS as per Income Tax Act, 1961\n6. Payment will be released against submission of tax invoice and required documents`;
  
  const paymentLines = doc.splitTextToSize(paymentTermsText, 170);
  doc.text(paymentLines, 20, yPos);
  yPos += paymentLines.length * 5 + 12;
  
  doc.setFont(undefined, 'bold');
  doc.text('4.3 Bid Validity', 20, yPos);
  yPos += 10;
  
  doc.setFont(undefined, 'normal');
  doc.text('This bid shall remain valid for a period of 90 (Ninety) days from the date of', 20, yPos);
  yPos += 6;
  doc.text('bid submission.', 20, yPos);
  
  yPos += 15;
  
  doc.setFont(undefined, 'bold');
  doc.text('4.4 Price Variation', 20, yPos);
  yPos += 10;
  
  doc.setFont(undefined, 'normal');
  doc.text('The prices quoted are firm and fixed. No price escalation shall be claimed during', 20, yPos);
  yPos += 6;
  doc.text('the execution period.', 20, yPos);
  
  addPageFooter();
  doc.addPage();
  
  // ==================== PAGE 6: COMPLIANCE & TERMS ====================
  
  yPos = 30;
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('SECTION V: COMPLIANCE STATEMENT', 20, yPos);
  doc.line(20, yPos + 2, 95, yPos + 2);
  yPos += 15;
  
  doc.setFontSize(11);
  const complianceStatement = `We hereby confirm our complete compliance with all technical and commercial terms & conditions mentioned in the tender document. We have not taken any deviation from the tender requirements.\n\nAll required documents and certificates are enclosed as per the document checklist. We understand that any false or misleading information provided in this bid may lead to rejection of our bid and/or termination of contract.`;
  
  const complianceStatementLines = doc.splitTextToSize(complianceStatement, 170);
  doc.text(complianceStatementLines, 20, yPos);
  yPos += complianceStatementLines.length * 5 + 15;
  
  // Section VI: Terms & Conditions
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('SECTION VI: TERMS & CONDITIONS', 20, yPos);
  doc.line(20, yPos + 2, 95, yPos + 2);
  yPos += 15;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  const termsConditions = [
    '1. Acceptance of Terms: We unconditionally accept all terms and conditions mentioned in the tender document without any deviation.',
    
    '2. Delivery/Completion: We shall complete the work/supply within the specified timeline. Any delay on our part shall attract liquidated damages as per tender terms.',
    
    '3. Quality Standards: All materials/workmanship shall conform to IS/BIS/ISO standards. We shall provide all required test certificates and quality documentation.',
    
    '4. Warranty: We shall provide warranty/guarantee as specified in the tender document. Any defects during warranty period shall be rectified free of cost.',
    
    '5. Insurance: We shall maintain comprehensive insurance coverage for the work/materials during the execution period.',
    
    '6. Statutory Compliance: We shall comply with all applicable labor laws, safety regulations, environmental norms, and other statutory requirements.',
    
    '7. Jurisdiction: Any disputes arising out of this contract shall be subject to the jurisdiction of courts at the location specified in tender.',
    
    '8. Force Majeure: Neither party shall be liable for failure to perform obligations due to force majeure events beyond reasonable control.',
    
    '9. Confidentiality: We shall maintain confidentiality of all information shared during tender process and contract execution.',
    
    '10. Subcontracting: No subcontracting shall be done without prior written approval of the tendering authority.',
  ];
  
  termsConditions.forEach(term => {
    yPos = checkNewPage(15, yPos);
    const termLines = doc.splitTextToSize(term, 165);
    doc.text(termLines, 20, yPos);
    yPos += termLines.length * 5 + 8;
  });
  
  addPageFooter();
  doc.addPage();
  
  // ==================== PAGE 7: DECLARATIONS ====================
  
  yPos = 30;
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('SECTION VII: DECLARATIONS & UNDERTAKINGS', 20, yPos);
  doc.line(20, yPos + 2, 120, yPos + 2);
  yPos += 15;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  doc.text('We hereby solemnly declare and undertake that:', 20, yPos);
  yPos += 12;
  
  const declarations = [
    '1. All information provided in this bid document is true, correct, and complete to the best of our knowledge and belief.',
    
    '2. We have not been blacklisted, debarred, or banned by any Central/State Government department, PSU, or autonomous body.',
    
    '3. No criminal proceedings are pending against our company or any of its directors/partners.',
    
    '4. We have carefully read and fully understood all the terms, conditions, and specifications mentioned in the tender document.',
    
    '5. We possess the requisite technical expertise, qualified manpower, infrastructure, and financial capability to execute this project.',
    
    '6. We shall execute the work as per approved specifications, drawings, and within the stipulated timeline.',
    
    '7. We shall provide performance bank guarantee and fulfill all contractual obligations if our bid is accepted.',
    
    '8. We understand that the tendering authority reserves the right to accept or reject any or all bids without assigning any reason.',
    
    '9. We shall not make any claim for increase in rates due to any reason whatsoever during the execution period.',
    
    '10. We understand that submission of false information or suppression of material facts may lead to termination of contract and forfeiture of EMD/security deposit.',
  ];
  
  declarations.forEach(declaration => {
    const declLines = doc.splitTextToSize(declaration, 165);
    doc.text(declLines, 20, yPos);
    yPos += declLines.length * 5 + 7;
  });
  
  yPos += 15;
  
  // Signature Block
  doc.setLineWidth(0.5);
  doc.rect(20, yPos, 170, 70);
  yPos += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('FOR AND ON BEHALF OF THE BIDDER', 25, yPos);
  yPos += 20;
  
  doc.setFont(undefined, 'normal');
  doc.text('Name & Signature: _______________________________________', 25, yPos);
  yPos += 12;
  
  doc.text('Designation: _______________________________________', 25, yPos);
  yPos += 12;
  
  doc.text('Company/Firm Name: _______________________________________', 25, yPos);
  yPos += 12;
  
  doc.text('Date: ' + new Date().toLocaleDateString('en-GB'), 25, yPos);
  yPos += 12;
  
  doc.setFont(undefined, 'italic');
  doc.setFontSize(9);
  doc.text('(Affix Company Seal/Rubber Stamp)', 25, yPos);
  
  // Final Note
  yPos = 265;
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  yPos += 5;
  
  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.text('Generated by OpportunityX (Qistonpe) - AI-powered Tender Management Platform', 105, yPos, { align: 'center' });
  yPos += 4;
  doc.text('Document Generated on: ' + new Date().toLocaleString('en-IN'), 105, yPos, { align: 'center' });
  yPos += 4;
  doc.text('This is a system generated document. Please review all details before submission.', 105, yPos, { align: 'center' });
  
  addPageFooter();
  
  // Save the PDF
  if (returnBlob) {
    return doc.output('blob');
  } else {
    doc.save(`Bid_${tenderName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  }
}