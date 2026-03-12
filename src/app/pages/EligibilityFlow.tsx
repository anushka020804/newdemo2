import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft,
  FileText,
  CheckCircle2,
  Download,
  Edit2,
  Trash2,
  Minimize2,
  Loader2,
  Sparkles,
  TrendingUp,
  DollarSign,
  Zap,
  X,
  Upload
} from "lucide-react";
import { generateFormalBidPDF } from "../utils/generateBidPDF";
import JSZip from "jszip";

export function EligibilityFlow() {
  const navigate = useNavigate();
  const { tenderId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showMetalCapital, setShowMetalCapital] = useState(false);
  const [isMetalCapitalCustomer] = useState(false); // Set to true to hide cross-sell
  const [documents, setDocuments] = useState([
    { id: "1", name: "Company Registration", status: "verified" },
    { id: "2", name: "GST Certificate", status: "verified" },
    { id: "3", name: "PAN Card", status: "verified" },
    { id: "4", name: "Financial Statements", status: "verified" },
  ]);
  const [bidDocumentDeleted, setBidDocumentDeleted] = useState(false);
  const [bidDocumentContent, setBidDocumentContent] = useState(`TECHNICAL & FINANCIAL BID

Tender Reference: TND-2024-001
Tender Name: Industrial Valves Supply - Karnataka PWD
Organization: Karnataka Public Works Department

SECTION I: COVERING LETTER

Dear Sir/Madam,

With reference to your tender notification for "Industrial Valves Supply - Karnataka PWD", we are pleased to submit our technical and financial bid for your kind consideration.

We have carefully examined all tender documents, including specifications, terms and conditions, and confirm that we have no objection to any of the stated requirements. We hereby confirm our acceptance of all terms and conditions without any deviation.

SECTION II: COMPANY PROFILE

Our organization is a well-established entity with a proven track record in the industry. We have been operational for over a decade, serving both government and private sector clients across the country.

SECTION III: TECHNICAL BID

We confirm compliance with all technical specifications mentioned in the tender document. All materials and equipment will conform to IS/BIS/ISO standards.

SECTION IV: FINANCIAL BID

Total Bid Amount: ₹45,00,000 (Inclusive of all taxes)
GST @ 18%: ₹6,86,440
EMD @ 2%: ₹90,000
Performance Guarantee @ 10%: ₹4,50,000

Payment Terms: As per tender conditions
Bid Validity: 90 days from submission

We look forward to your favorable consideration.`);
  const [isEditingBid, setIsEditingBid] = useState(false);
  const [editedContent, setEditedContent] = useState(bidDocumentContent);

  const steps = [
    { number: 1, title: "Analyze Document" },
    { number: 2, title: "Required Documents" },
    { number: 3, title: "Generate Document" },
    { number: 4, title: "Final Bid Preparation" },
  ];

  const tenderData = {
    tenderRef: "TND-2024-001",
    tenderTitle: "Industrial Valves Supply - Karnataka PWD",
    organization: "Karnataka Public Works Department",
    value: "₹45,00,000",
    location: "Bangalore, Karnataka",
    deadline: "Feb 15, 2026",
  };

  useEffect(() => {
    if (currentStep === 1 && !analysisComplete) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 3000);
    }
  }, [currentStep, analysisComplete]);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the eligibility flow and navigate to saved bids
      console.log("Navigating to saved bids...");
      navigate("/saved-bids");
    }
  };

  const handleUploadDocument = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newDoc = {
          id: String(documents.length + 1),
          name: file.name.split('.')[0],
          status: "pending" as const
        };
        setDocuments([...documents, newDoc]);
      }
    };
    input.click();
  };

  const handleEditDocument = (docId: string) => {
    // In a real app, this would open a document editor
    alert(`Edit functionality for document ${docId} would open here`);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  const handleDownloadBidPDF = () => {
    generateFormalBidPDF(tenderData);
  };

  const handleCompressAndDownload = async () => {
    const zip = new JSZip();
    
    // Generate the PDF
    const pdfBlob = await generateFormalBidPDF(tenderData, true);
    
    // Add PDF to zip
    zip.file("Bid_Karnataka_PWD_Industrial_Valves.pdf", pdfBlob);
    
    // Add supporting documents (mock)
    documents.forEach((doc) => {
      // Create a simple text file for each document (in real app, these would be actual files)
      const content = `${doc.name}\nStatus: ${doc.status}\nGenerated: ${new Date().toLocaleDateString()}`;
      zip.file(`${doc.name}.txt`, content);
    });
    
    // Generate and download zip
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Bid_Package_Karnataka_PWD.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleEditBid = () => {
    setEditedContent(bidDocumentContent);
    setIsEditingBid(true);
  };

  const handleSaveBidEdit = () => {
    setIsEditingBid(false);
    alert("Bid document updated successfully!");
  };

  const handleDeleteBid = () => {
    if (confirm("Are you sure you want to delete this bid document? This action cannot be undone.")) {
      setBidDocumentDeleted(true);
    }
  };

  const handleMetalCapitalExplore = () => {
    // Navigate to Metal Capital product page
    navigate("/");
  };

  const handleMetalCapitalDismiss = () => {
    setShowMetalCapital(false);
    navigate("/saved-bids");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/tenders")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Tender Eligibility Check
            </h1>
            <p className="text-sm text-gray-600">Karnataka PWD - Industrial Valves</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentStep > step.number
                      ? "bg-green-500 text-white"
                      : currentStep === step.number
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <span className={`text-sm mt-2 text-center ${
                    currentStep >= step.number ? "text-indigo-600" : "text-gray-500"
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-4 transition-all ${
                    currentStep > step.number ? "bg-green-500" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: Analyze Document */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl mb-6 text-center">AI Tender Analysis</h2>
                
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative mb-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-indigo-600" />
                      </div>
                    </div>
                    <h3 className="text-xl text-gray-900 mb-2">Analyzing Tender Document...</h3>
                    <p className="text-gray-600 text-center max-w-md">
                      Our AI is reviewing eligibility criteria, technical specifications, and required documentation.
                    </p>
                    <div className="mt-6 space-y-2">
                      <motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                        className="text-sm text-gray-600"
                      >
                        ✓ Extracting requirements...
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, repeat: Infinity, repeatType: "reverse" }}
                        className="text-sm text-gray-600"
                      >
                        ✓ Checking eligibility criteria...
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6, repeat: Infinity, repeatType: "reverse" }}
                        className="text-sm text-gray-600"
                      >
                        ✓ Identifying required documents...
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl text-gray-900 mb-2">Analysis Complete!</h3>
                    <p className="text-gray-600 mb-6">
                      We've identified all requirements and your business is eligible to bid.
                    </p>
                    
                    {/* Eligibility Status Banner */}
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <h4 className="text-lg text-green-800">You are ELIGIBLE for this tender</h4>
                      </div>
                      <p className="text-sm text-green-700">
                        Your business meets all the eligibility criteria based on the document analysis
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-6 border border-indigo-100">
                      <div className="flex justify-center">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Match Score</p>
                          <p className="text-2xl text-indigo-600">92%</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Continue to Documents
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Required Documents */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl mb-2">Required Documents</h2>
                <p className="text-gray-600 mb-6">Review, edit, or replace your documents before generating the bid</p>

                <div className="space-y-3 mb-8">
                  {documents.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          doc.status === "verified" ? "bg-green-100" : "bg-amber-100"
                        }`}>
                          <FileText className={`w-5 h-5 ${
                            doc.status === "verified" ? "text-green-600" : "text-amber-600"
                          }`} />
                        </div>
                        <div>
                          <p className="text-gray-900">{doc.name}</p>
                          <p className={`text-xs ${
                            doc.status === "verified" ? "text-green-600" : "text-amber-600"
                          }`}>
                            {doc.status === "verified" ? "Verified" : "Pending Review"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditDocument(doc.id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleUploadDocument}
                    className="w-full bg-white text-indigo-600 px-8 py-3 rounded-xl hover:bg-indigo-50 transition-all border-2 border-indigo-200 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload Documents</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Generate Bid Document
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Generate Document */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl mb-2">Generated Bid Document</h2>
                <p className="text-gray-600 mb-6">Your bid document is ready for submission</p>

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-6 border border-indigo-100">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-gray-900 mb-1">Bid_Karnataka_PWD_Industrial_Valves.pdf</h3>
                      <p className="text-sm text-gray-600 mb-3">Generated on Feb 6, 2026 • 2.4 MB</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={handleDownloadBidPDF}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button
                          onClick={handleEditBid}
                          className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-200 flex items-center gap-2 text-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={handleCompressAndDownload}
                          className="px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-2 text-sm"
                        >
                          <Minimize2 className="w-4 h-4" />
                          Compress
                        </button>
                        <button
                          onClick={handleDeleteBid}
                          className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors border border-red-200 flex items-center gap-2 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Finalize Bid
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Final Bid Preparation */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl mb-2">Bid is Ready!</h2>
                <p className="text-gray-600 mb-8">
                  Your bid document has been successfully prepared and is ready for submission
                </p>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-100">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Completion</p>
                      <p className="text-2xl text-green-600">100%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Documents</p>
                      <p className="text-2xl text-green-600">4/4</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <p className="text-2xl text-green-600">Ready</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Complete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bid Document Edit Modal */}
      <AnimatePresence>
        {isEditingBid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => setIsEditingBid(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl">Edit Bid Document</h2>
                    <p className="text-indigo-100 text-sm">Make changes to your bid document</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingBid(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">
                    Document Content
                  </label>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-96 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm resize-none"
                    placeholder="Enter bid document content..."
                  />
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-indigo-900 mb-1">Pro Tip</p>
                      <p className="text-sm text-indigo-700">
                        Edit the sections to customize your bid. All changes will be reflected in the downloaded PDF.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 p-6 flex gap-3">
                <button
                  onClick={() => setIsEditingBid(false)}
                  className="flex-1 px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setBidDocumentContent(editedContent);
                    setIsEditingBid(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metal Capital Cross-Sell Modal */}
      <AnimatePresence>
        {showMetalCapital && !isMetalCapitalCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={handleMetalCapitalDismiss}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white relative">
                <button
                  onClick={handleMetalCapitalDismiss}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl">Boost Your Tender Success</h2>
                    <p className="text-amber-100">with Metal Capital</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-gray-600 mb-6">
                  Access working capital, improve bidding capacity, and scale faster with our tailored financing solutions.
                </p>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 mb-1">Quick approvals</p>
                      <p className="text-sm text-gray-600">Get funded in 48 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 mb-1">Higher bidding power</p>
                      <p className="text-sm text-gray-600">Win more contracts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 mb-1">Better cash flow</p>
                      <p className="text-sm text-gray-600">Manage operations smoothly</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 mb-1">Tender-focused financing</p>
                      <p className="text-sm text-gray-600">Built for your needs</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleMetalCapitalExplore}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    Explore Metal Capital
                  </button>
                  <button
                    onClick={handleMetalCapitalDismiss}
                    className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>

                {/* Trust Line */}
                <p className="text-center text-sm text-gray-500 mt-6">
                  Trusted by 5,000+ businesses
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}