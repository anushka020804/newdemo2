import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Building2,
  IndianRupee,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Loader2
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getDocumentStatus, uploadDocument, RepositoryStatus } from "../api/documents";
import { getProfile } from "../api/auth";

// Maps backend category enum to frontend display config
const CATEGORY_CONFIG: Record<string, { name: string; icon: any; color: string; bg: string }> = {
  REGISTRATION_IDENTITY: {
    name: "Registration & Identity",
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  FINANCIAL: {
    name: "Financial Documents",
    icon: IndianRupee,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  WORK_EXPERIENCE: {
    name: "Work Experience",
    icon: Briefcase,
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  CERTIFICATION: {
    name: "Certifications & Licenses",
    icon: ShieldCheck,
    color: "text-purple-600",
    bg: "bg-purple-50"
  }
};

export function CompleteProfile() {
  const navigate = useNavigate();
  const [repoStatus, setRepoStatus] = useState<RepositoryStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["REGISTRATION_IDENTITY"]);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null); // documentType currently uploading
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUpload, setPendingUpload] = useState<{ category: string; documentType: string } | null>(null);

  // Fetch profile to get companyId, then fetch document status
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const profile = await getProfile();
        const cId = profile?.companies?.[0]?.id;
        console.log(cId)
        if (cId) {
          setCompanyId(cId);
          const status = await getDocumentStatus(cId);
          console.log("Document Status Data:", status);
          setRepoStatus(status);
        }
      } catch (err) {
        console.error("Failed to load document status:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Derived stats
  const uploadedCount = repoStatus?.uploaded ?? 0;
  const totalCount = repoStatus?.total ?? 16;
  const completionPercentage = repoStatus?.overallProgress ?? 0;
  const pendingCount = totalCount - uploadedCount;

  useEffect(() => {
    localStorage.setItem('profileUploadedCount', uploadedCount.toString());
    localStorage.setItem('profileTotalDocuments', totalCount.toString());
  }, [uploadedCount, totalCount]);

  const chartData = [
    { name: "Completed", value: uploadedCount },
    { name: "Pending", value: pendingCount },
  ];

  const COLORS = ['#10B981', '#E5E7EB'];

  const handleDocumentClick = (category: string, documentType: string) => {
    if (!companyId) return;
    setPendingUpload({ category, documentType });
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingUpload || !companyId) return;

    setUploadingDoc(pendingUpload.documentType);
    try {
      await uploadDocument(companyId, file, pendingUpload.category, pendingUpload.documentType);
      // Refresh document status
      const status = await getDocumentStatus(companyId);
      setRepoStatus(status);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload document. Please try again.");
    } finally {
      setUploadingDoc(null);
      setPendingUpload(null);
      // Reset value so user can re-upload same file if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your document repository...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-indigo-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Complete Profile</h1>
              <p className="text-sm text-gray-500">Official documents for tender eligibility</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Overall Progress</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-indigo-600">{completionPercentage}%</span>
                <span className="text-sm text-gray-400 font-medium">{uploadedCount}/{totalCount}</span>
              </div>
            </div>
            <div className="relative w-14 h-14">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={18}
                    outerRadius={25}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-gray-700">{completionPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Document Repository</h2>
            <p className="text-gray-600 leading-relaxed">
              Organize your business credentials into specific categories. Securely uploaded documents enable instant AI eligibility checks and faster bid preparation.
            </p>
          </header>

          <div className="space-y-6 mb-16">
            {repoStatus?.categories.map((cat) => {
              const config = CATEGORY_CONFIG[cat.category] || {
                name: cat.category,
                icon: FileText,
                color: "text-gray-600",
                bg: "bg-gray-50"
              };
              const Icon = config.icon;
              const isExpanded = expandedCategories.includes(cat.category);

              return (
                <section key={cat.category} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
                  {/* Category Header */}
                  <div
                    onClick={() => toggleCategory(cat.category)}
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50/50 transition-colors select-none group"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 ${config.bg} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-gray-900">{config.name}</h3>
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 italic">Essential business {config.name.toLowerCase()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="items-center gap-3 hidden md:flex">
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 ${cat.uploadedCount === cat.totalCount ? 'bg-green-500' : 'bg-indigo-600'}`}
                            style={{ width: `${(cat.uploadedCount / cat.totalCount) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
                          {cat.uploadedCount}/{cat.totalCount} Uploaded
                        </span>
                      </div>
                      <div className={`p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors`}>
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Document Grid - Collapsible */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {cat.documents.map((doc, idx) => {
                              const isUploaded = doc.status === "UPLOADED";
                              const isCurrentlyUploading = uploadingDoc === doc.documentType;

                              return (
                                <motion.div
                                  key={doc.documentType}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isUploaded && !isCurrentlyUploading) {
                                      handleDocumentClick(cat.category, doc.documentType);
                                    }
                                  }}
                                  className={`group/card relative bg-white rounded-2xl p-5 border transition-all duration-300 ${isUploaded
                                    ? "border-green-100 bg-green-50/10"
                                    : isCurrentlyUploading
                                      ? "border-indigo-200 bg-indigo-50/20"
                                      : "border-gray-100 border-dashed hover:border-indigo-300 hover:shadow-md cursor-pointer"
                                    }`}
                                >
                                  <div className="flex flex-col h-full min-h-[130px]">
                                    <div className="mb-4 flex items-start justify-between">
                                      <div className={`p-2.5 rounded-lg ${isUploaded ? "bg-green-100 text-green-600"
                                        : isCurrentlyUploading ? "bg-indigo-100 text-indigo-600"
                                          : "bg-gray-50 text-gray-400 group-hover/card:bg-indigo-50 group-hover/card:text-indigo-600"
                                        } transition-colors`}>
                                        {isCurrentlyUploading ? (
                                          <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : isUploaded ? (
                                          <FileText className="w-5 h-5" />
                                        ) : (
                                          <Upload className="w-5 h-5" />
                                        )}
                                      </div>
                                      {isUploaded ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                      ) : isCurrentlyUploading ? (
                                        <span className="text-[10px] font-medium text-indigo-600">Uploading...</span>
                                      ) : (
                                        <div className="w-2 h-2 rounded-full bg-amber-400 group-hover/card:bg-indigo-400 animate-pulse" />
                                      )}
                                    </div>

                                    <h4 className="text-sm font-semibold text-gray-900 leading-tight mb-auto group-hover/card:text-indigo-600 transition-colors">
                                      {doc.documentType}
                                    </h4>

                                    <div className="mt-4 pt-3 border-t border-gray-100/50 flex items-center justify-between">
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isUploaded ? "text-green-600" : "text-gray-400"
                                        }`}>
                                        {isUploaded ? "UPLOADED" : "PENDING"}
                                      </span>
                                      {!isUploaded && !isCurrentlyUploading && (
                                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover/card:text-indigo-400 transition-transform group-hover/card:translate-x-0.5" />
                                      )}
                                      {isUploaded && doc.fileUrl && (
                                        <a
                                          href={doc.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase flex items-center gap-1 transition-colors"
                                        >
                                          Show PDF
                                          <ChevronRight className="w-3 h-3" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              );
            })}
          </div>

          {/* Help Center CTA */}
          <div className="bg-white rounded-3xl p-8 border border-indigo-50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 rotate-3 group-hover:rotate-0 transition-transform">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Maximum Security Compliance</h3>
                <p className="text-gray-500 text-sm max-w-lg leading-relaxed">
                  All documents are stored using AES-256 encryption. We only use this data to calculate your eligibility score for specific tenders and pre-fill bid forms.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 whitespace-nowrap"
            >
              Continue to Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}