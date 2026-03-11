import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
  Plus,
  Trash2,
} from "lucide-react";
import { getCustomerProfile, CustomerProfile, updateCustomerProfile, appendHsn, deleteHsn } from "../api/profile";
import { getDocumentStatus, RepositoryStatus } from "../api/documents";

export function UserProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [docStatus, setDocStatus] = useState<RepositoryStatus | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    mobile: "",
    companyLegalName: "",
    companyAddress: "",
    establishmentYear: "",
  });
  const [isEditingHsn, setIsEditingHsn] = useState(false);
  const [newHsnCode, setNewHsnCode] = useState("");
  const [newHsnKeywords, setNewHsnKeywords] = useState("");
  const [hsnSaving, setHsnSaving] = useState(false);

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

  const startEditing = () => {
    setEditForm({
      fullName: profile?.fullName || "",
      mobile: profile?.mobile || "",
      companyLegalName: company?.legalName || "",
      companyAddress: company?.address || "",
      establishmentYear: company?.establishmentYear || "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => setIsEditing(false);

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const updated = await updateCustomerProfile(editForm);
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddHsn = async () => {
    if (!newHsnKeywords.trim()) return;
    setHsnSaving(true);
    try {
      await appendHsn({
        hsns: [{ hsnCode: newHsnCode.trim(), keywords: newHsnKeywords.split(',').map(k => k.trim()).filter(Boolean) }],
      });
      const updated = await getCustomerProfile();
      setProfile(updated);
      setNewHsnCode("");
      setNewHsnKeywords("");
    } catch (err) {
      console.error("Failed to add HSN:", err);
    } finally {
      setHsnSaving(false);
    }
  };

  const handleDeleteHsn = async (hsnId: string) => {
    try {
      await deleteHsn(hsnId);
      const updated = await getCustomerProfile();
      setProfile(updated);
    } catch (err) {
      console.error("Failed to delete HSN:", err);
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
          {!isEditing ? (
            <button
              onClick={startEditing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all text-sm font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={cancelEditing}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all text-sm font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:from-indigo-700 active:to-blue-700"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content — Two Column Layout */}
      <div className="max-w-7xl mx-auto p-6">
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
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.companyLegalName}
                      onChange={(e) => setEditForm(f => ({ ...f, companyLegalName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {company?.legalName || 'N/A'}
                    </p>
                  )}
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
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.establishmentYear}
                      onChange={(e) => setEditForm(f => ({ ...f, establishmentYear: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {company?.establishmentYear || 'N/A'}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] uppercase tracking-wider text-gray-500 mb-1.5 block flex items-center gap-1.5">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.companyAddress}
                      onChange={(e) => setEditForm(f => ({ ...f, companyAddress: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      {company?.address || 'N/A'}
                    </p>
                  )}
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
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm(f => ({ ...f, fullName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profile?.fullName || 'N/A'}
                    </p>
                  )}
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
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={editForm.mobile}
                        onChange={(e) => setEditForm(f => ({ ...f, mobile: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {profile?.mobile || 'N/A'}
                    </p>
                  )}
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
                  onClick={() => setIsEditingHsn(!isEditingHsn)}
                  className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
                >
                  {isEditingHsn ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  {isEditingHsn ? 'Done' : 'Edit'}
                </button>
              </div>

              {uniqueHsns.length === 0 && !isEditingHsn ? (
                <p className="text-gray-500 text-sm">No HSN codes configured yet. Click Edit to add your product categories.</p>
              ) : (
                <div className="space-y-3">
                  {uniqueHsns.map((hsn) => (
                    <div
                      key={hsn.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      {hsn.hsnCode && (
                        <span className="inline-flex items-center justify-center px-3 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-lg min-w-[56px] text-center">
                          {hsn.hsnCode}
                        </span>
                      )}
                      <span className="text-gray-900 flex-1">{hsn.keywords?.join(', ') || 'No keywords'}</span>
                      {isEditingHsn && (
                        <button
                          onClick={() => handleDeleteHsn(hsn.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {isEditingHsn && (
                <div className="mt-4 p-4 border border-dashed border-indigo-200 rounded-xl bg-indigo-50/50">
                  <p className="text-sm font-medium text-gray-700 mb-3">Add New HSN</p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="HSN Code"
                      value={newHsnCode}
                      onChange={(e) => setNewHsnCode(e.target.value)}
                      className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Keywords (comma separated)"
                      value={newHsnKeywords}
                      onChange={(e) => setNewHsnKeywords(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddHsn}
                      disabled={hsnSaving || !newHsnKeywords.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 focus:outline-none"
                    >
                      {hsnSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      Add
                    </button>
                  </div>
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
  );
}
