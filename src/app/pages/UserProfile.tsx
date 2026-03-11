import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  Loader2,
  LayoutDashboard,
  Bookmark,
  Settings,
} from "lucide-react";
import { getCustomerProfile, CustomerProfile } from "../api/profile";
import { getDocumentStatus, RepositoryStatus } from "../api/documents";
import { SharedSidebar, CompanyInfoPopup, CompanyInfo } from "../components/SharedComponents";

export function UserProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [docStatus, setDocStatus] = useState<RepositoryStatus | null>(null);
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const profileData = await getCustomerProfile();
        setProfile(profileData);

        // Also fetch document status for the first company
        if (profileData.companies?.[0]?.id) {
          try {
            const docs = await getDocumentStatus(profileData.companies[0].id);
            setDocStatus(docs);
          } catch {
            // Document status is optional, don't block
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Derived data
  const company = profile?.companies?.[0];
  const hsnCodes = profile?.hsnCodes ?? [];

  // De-duplicate HSN codes by hsnCode value
  const uniqueHsns = hsnCodes.reduce((acc, hsn) => {
    if (!acc.find(h => h.hsnCode === hsn.hsnCode)) {
      acc.push(hsn);
    }
    return acc;
  }, [] as typeof hsnCodes);

  // Document summary for sidebar
  const uploadedDocs = docStatus?.uploaded ?? 0;
  const totalDocs = docStatus?.total ?? 16;
  const completionPercent = docStatus?.overallProgress ?? 0;

  // Build a flattened document list for the sidebar
  const docList = docStatus?.categories?.flatMap(cat =>
    cat.documents.map(d => ({
      name: d.documentType,
      fileUrl: d.fileUrl,
      status: d.status === 'UPLOADED' ? 'verified' as const : 'pending' as const,
      date: d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '-',
    }))
  )?.slice(0, 5) ?? []; // Show first 5

  // SVG circular progress ring
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (completionPercent / 100) * circumference;

  // Company Info for popup (mapping from API CompanyInfo type)
  const companyInfoPopup: CompanyInfo = {
    name: profile?.companies?.[0]?.legalName || "Your Company",
    registrationNumber: "CIN-U72200MH2020PTC123456",
    gstNumber: profile?.companies?.[0]?.gstin || "27AABCU9603R1ZM",
    panNumber: profile?.companies?.[0]?.pan || "AABCU9603R",
    address: profile?.companies?.[0]?.address || "Address not available",
    contactPerson: profile?.fullName || "Contact Person",
    email: profile?.email || "contact@company.com",
    phone: profile?.mobile || "+91 98765 43210",
    hsnCodes: profile?.hsnCodes?.map(h => h.hsnCode) || ["84713010", "84714100", "85176290", "85044090"],
    status: "verified"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SharedSidebar 
          companyName={companyInfoPopup.name}
          onCompanyClick={() => setShowCompanyInfo(true)}
        />
        <div className="flex-1 ml-[220px] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-30 flex">
      {/* Sidebar */}
      <SharedSidebar 
        companyName={companyInfoPopup.name}
        onCompanyClick={() => setShowCompanyInfo(true)}
      />

      {/* Company Info Popup */}
      <CompanyInfoPopup
        isOpen={showCompanyInfo}
        onClose={() => setShowCompanyInfo(false)}
        company={companyInfoPopup}
      />

      {/* Main Content */}
      <div className="flex-1 ml-[220px]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Profile
            </h1>
          </div>
        </div>

        {/* Main Content — Two Column Layout */}
        <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* ========== LEFT COLUMN ========== */}
          <div className="space-y-6">
            {/* Company Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Company Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-500 mb-1.5 block">
                    Company Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {company?.legalName || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-500 mb-1.5 block">
                    GST Number
                  </label>
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    {company?.gstin || 'N/A'}
                    {company?.gstin && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-500 mb-1.5 block">
                    Business PAN
                  </label>
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    {company?.pan || 'N/A'}
                    {company?.pan && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-500 mb-1.5 block">
                    Establishment Year
                  </label>
                  <p className="text-gray-900 font-medium">
                    {company?.establishmentYear || 'N/A'}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                    Address
                  </label>
                  <p className="text-gray-900 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    {company?.address || 'N/A'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h2 className="text-xl font-semibold mb-6">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-500 mb-1.5 block">
                    Owner Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {profile?.fullName || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-500 mb-1.5 block">
                    Email
                  </label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {profile?.email || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-gray-500 mb-1.5 block">
                    Mobile
                  </label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {profile?.mobile || 'N/A'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Product Categories (HSN) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Product Categories (HSN)
                </h2>
                <button
                  onClick={() => navigate("/hsn-setup")}
                  className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              {uniqueHsns.length === 0 ? (
                <p className="text-gray-500 text-sm">No HSN codes configured yet. Click Edit to add your product categories.</p>
              ) : (
                <div className="space-y-3">
                  {uniqueHsns.map((hsn) => (
                    <div
                      key={hsn.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <span className="inline-flex items-center justify-center px-3 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-lg min-w-[56px] text-center">
                        {hsn.hsnCode}
                      </span>
                      <span className="text-gray-900">{hsn.keywords?.join(', ') || 'No keywords'}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* ========== RIGHT COLUMN (Sidebar) ========== */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold mb-4">
                Profile Completion
              </h3>

              <div className="flex justify-center mb-5">
                <div className="relative w-32 h-32">
                  <svg
                    className="w-32 h-32 -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    {/* Background circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="#4F46E5"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      {completionPercent}%
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/complete-profile")}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all font-medium"
              >
                Complete Profile
              </button>
            </motion.div>

            {/* Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Documents</h3>
                <button
                  onClick={() => navigate("/complete-profile")}
                  className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold uppercase tracking-wider"
                >
                  Manage
                </button>
              </div>

              <div className="space-y-1">
                {docList.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">No documents uploaded yet.</p>
                ) : (
                  docList.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
                    >
                      <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-400">{doc.date}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {doc.status === "verified" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {doc.fileUrl ? (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors"
                                title="Show PDF"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                            ) : (
                              <Download className="w-4 h-4 text-gray-300 hover:text-gray-500 cursor-pointer" />
                            )}
                          </>
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
