import jsPDF from "jspdf";

interface Contract {
  id: string;
  tenderName: string;
  organization: string;
  value: string;
  wonDate: string;
  contractStartDate: string;
  contractDuration: string;
  winMargin: string;
}

export function generateContractPDF(contract: Contract): void {
  const doc = new jsPDF();
  let currentPage = 1;
  
  // Helper function to add page numbers and footer
  const addPageFooter = () => {
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.text(`Page ${currentPage} of 4`, 105, 285, { align: 'center' });
    doc.line(20, 280, 190, 280);
    currentPage++;
  };
  
  // ==================== PAGE 1: COVER PAGE ====================
  
  // Top border
  doc.setLineWidth(2);
  doc.setDrawColor(0, 0, 0);
  doc.line(20, 20, 190, 20);
  doc.line(20, 22, 190, 22);
  
  let yPos = 50;
  
  // Header
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('CONTRACT AGREEMENT', 105, yPos, { align: 'center' });
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont(undefined, 'normal');
  doc.text('Work Order & Terms of Engagement', 105, yPos, { align: 'center' });
  
  yPos += 30;
  
  // Contract Details Box
  doc.setLineWidth(0.5);
  doc.rect(20, yPos, 170, 120);
  yPos += 10;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('CONTRACT PARTICULARS', 105, yPos, { align: 'center' });
  yPos += 15;
  
  doc.setFontSize(11);
  
  const contractRef = `CNT/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`;
  
  doc.setFont(undefined, 'bold');
  doc.text('Contract Reference No.:', 30, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(contractRef, 180, yPos, { align: 'right' });
  yPos += 12;
  
  doc.setFont(undefined, 'bold');
  doc.text('Date of Contract:', 30, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(contract.wonDate, 180, yPos, { align: 'right' });
  yPos += 12;
  
  doc.setFont(undefined, 'bold');
  doc.text('Project Name:', 30, yPos);
  doc.setFont(undefined, 'normal');
  const projectNameLines = doc.splitTextToSize(contract.tenderName, 100);
  doc.text(projectNameLines, 30, yPos + 5);
  yPos += projectNameLines.length * 5 + 12;
  
  doc.setFont(undefined, 'bold');
  doc.text('Contracting Authority:', 30, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(contract.organization, 180, yPos, { align: 'right' });
  yPos += 12;
  
  doc.setFont(undefined, 'bold');
  doc.text('Contractor:', 30, yPos);
  doc.setFont(undefined, 'normal');
  doc.text('Acme Solutions Pvt. Ltd.', 180, yPos, { align: 'right' });
  yPos += 12;
  
  doc.setFont(undefined, 'bold');
  doc.text('Contract Value:', 30, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(contract.value, 180, yPos, { align: 'right' });
  yPos += 12;
  
  doc.setFont(undefined, 'bold');
  doc.text('Contract Start Date:', 30, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(contract.contractStartDate, 180, yPos, { align: 'right' });
  yPos += 12;
  
  doc.setFont(undefined, 'bold');
  doc.text('Contract Duration:', 30, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(contract.contractDuration, 180, yPos, { align: 'right' });
  
  yPos += 25;
  
  // Parties Box
  doc.rect(20, yPos, 170, 50);
  yPos += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('BETWEEN', 105, yPos, { align: 'center' });
  yPos += 12;
  
  doc.setFont(undefined, 'normal');
  doc.text(`${contract.organization}`, 30, yPos);
  doc.text('(Hereinafter referred to as "The Employer")', 30, yPos + 6);
  yPos += 15;
  
  doc.setFont(undefined, 'bold');
  doc.text('AND', 105, yPos, { align: 'center' });
  yPos += 10;
  
  doc.setFont(undefined, 'normal');
  doc.text('Acme Solutions Pvt. Ltd.', 30, yPos);
  doc.text('(Hereinafter referred to as "The Contractor")', 30, yPos + 6);
  
  // Bottom border
  doc.setLineWidth(2);
  doc.line(20, 275, 190, 275);
  doc.line(20, 277, 190, 277);
  
  addPageFooter();
  doc.addPage();
  
  // ==================== PAGE 2: SCOPE OF WORK ====================
  
  yPos = 30;
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('ARTICLE 1: SCOPE OF WORK', 20, yPos);
  doc.line(20, yPos + 2, 85, yPos + 2);
  yPos += 15;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  const scopeText = `The Contractor shall execute the work as per the specifications, drawings, and documents forming part of this Contract. The scope includes but is not limited to:\n\n1. Supply of all materials, equipment, labor, and supervision necessary for the complete execution of the work.\n\n2. Compliance with all applicable quality standards, codes, and regulations.\n\n3. Testing, commissioning, and handover of the completed work.\n\n4. Provision of all necessary documentation including quality certificates, test reports, and as-built drawings.\n\n5. Training of personnel (if applicable) for operation and maintenance.\n\n6. Warranty and after-sales support as per contract terms.`;
  
  const scopeLines = doc.splitTextToSize(scopeText, 170);
  doc.text(scopeLines, 20, yPos);
  yPos += scopeLines.length * 5 + 15;
  
  // Article 2: Contract Price
  doc.setFont(undefined, 'bold');
  doc.text('ARTICLE 2: CONTRACT PRICE', 20, yPos);
  doc.line(20, yPos + 2, 80, yPos + 2);
  yPos += 12;
  
  doc.setFont(undefined, 'normal');
  doc.text(`The total contract price is ${contract.value} (inclusive of all taxes).`, 20, yPos);
  yPos += 10;
  doc.text('The contract price is fixed and firm for the entire duration of the contract.', 20, yPos);
  yPos += 10;
  doc.text('No price escalation claims shall be entertained unless specifically provided in the contract.', 20, yPos);
  yPos += 20;
  
  // Article 3: Payment Terms
  doc.setFont(undefined, 'bold');
  doc.text('ARTICLE 3: PAYMENT TERMS', 20, yPos);
  doc.line(20, yPos + 2, 75, yPos + 2);
  yPos += 12;
  
  doc.setFont(undefined, 'normal');
  const paymentText = `3.1 Payment Schedule:\n• Advance Payment: 10% on signing of contract (subject to submission of bank guarantee)\n• Milestone 1 (30% completion): 20% of contract value\n• Milestone 2 (60% completion): 30% of contract value\n• Milestone 3 (90% completion): 30% of contract value\n• Final Payment: 10% after successful completion and acceptance\n\n3.2 All payments shall be made within 30 days of submission of valid invoice and supporting documents.\n\n3.3 TDS shall be deducted as per applicable Income Tax Act provisions.\n\n3.4 10% retention money shall be deducted from each payment and released after successful completion of warranty period.`;
  
  const paymentLines = doc.splitTextToSize(paymentText, 170);
  doc.text(paymentLines, 20, yPos);
  yPos += paymentLines.length * 5 + 15;
  
  addPageFooter();
  doc.addPage();
  
  // ==================== PAGE 3: TERMS & CONDITIONS ====================
  
  yPos = 30;
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('ARTICLE 4: TIME FOR COMPLETION', 20, yPos);
  doc.line(20, yPos + 2, 90, yPos + 2);
  yPos += 12;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`The Contractor shall complete the work within ${contract.contractDuration} from the date of`, 20, yPos);
  yPos += 6;
  doc.text('commencement as specified in the Letter of Acceptance.', 20, yPos);
  yPos += 10;
  doc.text('Time is the essence of this contract. Delay shall attract liquidated damages as per contract.', 20, yPos);
  yPos += 20;
  
  // Article 5: Quality Standards
  doc.setFont(undefined, 'bold');
  doc.text('ARTICLE 5: QUALITY STANDARDS', 20, yPos);
  doc.line(20, yPos + 2, 80, yPos + 2);
  yPos += 12;
  
  doc.setFont(undefined, 'normal');
  const qualityText = `All materials, equipment, and workmanship shall conform to:\n• Indian Standards (IS) / Bureau of Indian Standards (BIS)\n• ISO 9001:2015 Quality Management Systems\n• Technical specifications mentioned in tender/contract documents\n• Any other standards specifically mentioned in the contract\n\nThe Employer reserves the right to inspect and test any materials or workmanship. Rejected materials shall be removed from site immediately.`;
  
  const qualityLines = doc.splitTextToSize(qualityText, 170);
  doc.text(qualityLines, 20, yPos);
  yPos += qualityLines.length * 5 + 15;
  
  // Article 6: Performance Guarantee
  doc.setFont(undefined, 'bold');
  doc.text('ARTICLE 6: PERFORMANCE GUARANTEE', 20, yPos);
  doc.line(20, yPos + 2, 95, yPos + 2);
  yPos += 12;
  
  doc.setFont(undefined, 'normal');
  doc.text('The Contractor shall submit a Performance Bank Guarantee for 10% of the contract value', 20, yPos);
  yPos += 6;
  doc.text('within 15 days of contract award, valid for the entire contract period plus 90 days.', 20, yPos);
  yPos += 20;
  
  // Article 7: Warranty
  doc.setFont(undefined, 'bold');
  doc.text('ARTICLE 7: WARRANTY', 20, yPos);
  doc.line(20, yPos + 2, 60, yPos + 2);
  yPos += 12;
  
  doc.setFont(undefined, 'normal');
  const warrantyText = `The Contractor shall provide a warranty period of 12 months from the date of completion and acceptance of work. During this period, the Contractor shall rectify any defects arising from faulty materials or workmanship free of cost.\n\nThe warranty shall cover:\n• Defects in materials and workmanship\n• Defects arising from improper installation or commissioning\n• Replacement of defective parts/materials\n• All costs related to rectification including labor, transportation, etc.`;
  
  const warrantyLines = doc.splitTextToSize(warrantyText, 170);
  doc.text(warrantyLines, 20, yPos);
  yPos += warrantyLines.length * 5 + 15;
  
  // Article 8: Insurance
  doc.setFont(undefined, 'bold');
  doc.text('ARTICLE 8: INSURANCE & INDEMNITY', 20, yPos);
  doc.line(20, yPos + 2, 80, yPos + 2);
  yPos += 12;
  
  doc.setFont(undefined, 'normal');
  const insuranceText = `The Contractor shall maintain adequate insurance coverage for the works, materials, equipment, and third-party liabilities. The Contractor shall indemnify the Employer against all claims, damages, losses arising from the Contractor's negligence or breach of contract.`;
  
  const insuranceLines = doc.splitTextToSize(insuranceText, 170);
  doc.text(insuranceLines, 20, yPos);
  yPos += insuranceLines.length * 5 + 15;
  
  addPageFooter();
  doc.addPage();
  
  // ==================== PAGE 4: GENERAL CONDITIONS & SIGNATURES ====================
  
  yPos = 30;
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('ARTICLE 9: GENERAL CONDITIONS', 20, yPos);
  doc.line(20, yPos + 2, 85, yPos + 2);
  yPos += 12;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  const generalConditions = [
    '9.1 Force Majeure: Neither party shall be liable for delays due to force majeure events beyond reasonable control.',
    
    '9.2 Dispute Resolution: Any disputes shall first be resolved through mutual discussion. Unresolved disputes shall be referred to arbitration as per Indian Arbitration & Conciliation Act.',
    
    '9.3 Governing Law: This contract shall be governed by the laws of India.',
    
    '9.4 Jurisdiction: Courts at the location of the Employer shall have exclusive jurisdiction.',
    
    '9.5 Termination: The Employer may terminate the contract in case of breach, poor performance, or insolvency of the Contractor.',
    
    '9.6 Confidentiality: Both parties shall maintain confidentiality of all information exchanged.',
    
    '9.7 Amendments: No amendments shall be valid unless made in writing and signed by both parties.',
  ];
  
  generalConditions.forEach(condition => {
    const conditionLines = doc.splitTextToSize(condition, 170);
    doc.text(conditionLines, 20, yPos);
    yPos += conditionLines.length * 5 + 8;
  });
  
  yPos += 10;
  
  // Acceptance
  doc.setFont(undefined, 'bold');
  doc.text('ARTICLE 10: ACCEPTANCE', 20, yPos);
  doc.line(20, yPos + 2, 65, yPos + 2);
  yPos += 12;
  
  doc.setFont(undefined, 'normal');
  doc.text('Both parties hereby accept the terms and conditions of this contract and affix their', 20, yPos);
  yPos += 6;
  doc.text('signatures as a token of agreement.', 20, yPos);
  yPos += 20;
  
  // Signature Section
  doc.setLineWidth(0.5);
  doc.rect(20, yPos, 170, 80);
  yPos += 10;
  
  // Left Column - Contractor
  doc.setFont(undefined, 'bold');
  doc.text('FOR THE CONTRACTOR', 30, yPos);
  yPos += 15;
  
  doc.setFont(undefined, 'normal');
  doc.text('Signature: _______________________', 30, yPos);
  yPos += 12;
  doc.text('Name: _______________________', 30, yPos);
  yPos += 12;
  doc.text('Designation: _______________________', 30, yPos);
  yPos += 12;
  doc.text('Date: ' + new Date().toLocaleDateString('en-GB'), 30, yPos);
  yPos += 10;
  doc.setFontSize(9);
  doc.setFont(undefined, 'italic');
  doc.text('(Company Seal)', 30, yPos);
  
  // Right Column - Employer
  yPos = yPos - 49;
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('FOR THE EMPLOYER', 120, yPos);
  yPos += 15;
  
  doc.setFont(undefined, 'normal');
  doc.text('Signature: _______________________', 120, yPos);
  yPos += 12;
  doc.text('Name: _______________________', 120, yPos);
  yPos += 12;
  doc.text('Designation: _______________________', 120, yPos);
  yPos += 12;
  doc.text('Date: ' + new Date().toLocaleDateString('en-GB'), 120, yPos);
  yPos += 10;
  doc.setFontSize(9);
  doc.setFont(undefined, 'italic');
  doc.text('(Official Seal)', 120, yPos);
  
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
  doc.text('This is a system generated document. Please verify all details before signing.', 105, yPos, { align: 'center' });
  
  addPageFooter();
  
  // Save the PDF
  const fileName = `Contract_${contract.tenderName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(fileName);
}
