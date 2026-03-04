import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import HSNChatbot from "../components/HSNChatbot";
import HSNMasterFinder from "../components/HSNMasterFinder";
import { Plus, Edit2, Trash2, Check, X, Mail, MessageCircle } from "lucide-react";
import { saveHsnSetup } from "../api/profile";

interface HSNRow {
  id: string;
  hsnCode: string;
  productKeyword: string;
}

export function HSNSetup() {
  const navigate = useNavigate();
  const location = useLocation();

  const [rows, setRows] = useState<HSNRow[]>(() => {
    const passedHsn = location.state?.hsnDetails;
    if (passedHsn && Array.isArray(passedHsn) && passedHsn.length > 0) {
      return passedHsn.map((hsn: any, index: number) => ({
        id: Date.now().toString() + index,
        hsnCode: hsn.hsnCode || "",
        productKeyword: hsn.hsnDescription || "",
      }));
    }
    return [
      { id: "1", hsnCode: "7326", productKeyword: "Steel Fasteners" },
      { id: "2", hsnCode: "8481", productKeyword: "Industrial Valves" },
    ];
  });

  useEffect(() => {
    const passedHsn = location.state?.hsnDetails;
    if (passedHsn && Array.isArray(passedHsn) && passedHsn.length > 0) {
      setRows(passedHsn.map((hsn: any, index: number) => ({
        id: Date.now().toString() + index,
        hsnCode: hsn.hsnCode || "",
        productKeyword: hsn.hsnDescription || "",
      })));
    }
  }, [location.state]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHsn, setEditHsn] = useState("");
  const [editKeyword, setEditKeyword] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRow = () => {
    const newRow: HSNRow = { id: Date.now().toString(), hsnCode: "", productKeyword: "" };
    setRows([...rows, newRow]);
    setEditingId(newRow.id);
    setEditHsn("");
    setEditKeyword("");
  };

  const handleEdit = (row: HSNRow) => {
    setEditingId(row.id);
    setEditHsn(row.hsnCode);
    setEditKeyword(row.productKeyword);
  };

  const handleSave = (id: string) => {
    if (!editKeyword.trim()) {
      alert("Product Keyword is mandatory.");
      return;
    }
    setRows(rows.map((row) => (row.id === id ? { ...row, hsnCode: editHsn, productKeyword: editKeyword } : row)));
    setEditingId(null);
  };

  const handleCancel = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (row && !row.hsnCode && !row.productKeyword) setRows(rows.filter((r) => r.id !== id));
    setEditingId(null);
  };

  const handleDelete = (id: string) => setRows(rows.filter((row) => row.id !== id));

  const handleSubmit = async () => {
    const hasEmptyKeywords = rows.some((row) => !row.productKeyword.trim());
    if (hasEmptyKeywords || rows.length === 0) {
      alert("Please add at least one product with a keyword.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        hsns: rows.map(r => ({
          hsnCode: r.hsnCode,
          keywords: r.productKeyword.split(',').map(k => k.trim()).filter(k => k)
        })),
        emailAlerts: emailNotif,
        whatsappAlerts: whatsappNotif
      };

      console.log("=== HSN SUBMIT ===");
      console.log("Payload:", JSON.stringify(payload, null, 2));
      console.log("Access token exists:", !!localStorage.getItem('accessToken'));

      const result = await saveHsnSetup(payload);
      console.log("HSN save SUCCESS:", result);

      // After HSN setup, send user to login for verification before welcome/dashboard
      navigate("/login", { state: { from: "hsn" } });
    } catch (error: any) {
      console.error("=== HSN SAVE FAILED ===");
      console.error("Error status:", error?.response?.status);
      console.error("Error data:", error?.response?.data);
      console.error("Full error:", error);
      alert(`Failed to save HSN setup: ${error?.response?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">

      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <span className="text-xl font-bold text-blue-600 tracking-tight">
            OpportunityX
          </span>
        </div>
      </nav>

      {/* Stepper */}
      <div className="flex items-center justify-center py-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-sm font-medium text-emerald-600">Business Verification</span>
          </div>
          <div className="w-16 h-px bg-slate-300"></div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              2
            </div>
            <span className="text-sm font-medium text-indigo-600">HSN Setup</span>
          </div>
          <div className="w-16 h-px bg-slate-200"></div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span className="text-sm font-medium text-slate-400">Complete</span>
          </div>
        </div>
      </div>

      {/* Header Titles */}
      <div className="text-center mb-10 px-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">HSN & Product Setup</h1>
        <p className="text-sm text-slate-600">Add HSN codes and product keywords to match relevant tenders</p>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24 flex flex-col lg:flex-row gap-8 items-start justify-center">

        {/* Left Column (Forms) */}
        <div className="w-full lg:max-w-3xl space-y-6">

          {/* Table Card */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] overflow-hidden border border-slate-100 pb-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[13px] font-semibold text-slate-700">
                  <th className="px-6 py-4">HSN Code <span className="text-slate-400 font-normal ml-1">(Optional)</span></th>
                  <th className="px-6 py-4">Product Keyword</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {editingId === row.id ? (
                        <input
                          type="text"
                          value={editHsn}
                          onChange={(e) => setEditHsn(e.target.value)}
                          className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm w-28 focus:outline-none focus:border-indigo-500"
                        />
                      ) : row.hsnCode ? (
                        <span className="text-sm font-medium text-slate-700">{row.hsnCode}</span>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === row.id ? (
                        <input
                          type="text"
                          value={editKeyword}
                          onChange={(e) => setEditKeyword(e.target.value)}
                          autoFocus
                          className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm w-full focus:outline-none focus:border-indigo-500"
                        />
                      ) : (
                        <span className="text-sm font-medium text-slate-700">{row.productKeyword}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editingId === row.id ? (
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => handleSave(row.id)} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded transition-colors"><Check className="w-4 h-4" /></button>
                          <button onClick={() => handleCancel(row.id)} className="text-slate-400 hover:bg-slate-100 p-1 rounded transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-4">
                          <button onClick={() => handleEdit(row)} className="text-indigo-500 hover:text-indigo-700 transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(row.id)} className="text-rose-500 hover:text-rose-700 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-6 mt-4 mb-2 text-left">
              <button onClick={handleAddRow} className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                <Plus className="w-4 h-4" /> Add Row
              </button>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
            <h3 className="text-[15px] font-semibold text-slate-900 mb-1">Notification Preferences</h3>
            <p className="text-sm text-slate-500 mb-6">Get alerts for relevant tenders</p>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                />
                <Mail className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-slate-800">Email</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={whatsappNotif}
                  onChange={(e) => setWhatsappNotif(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                />
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-800">WhatsApp</span>
              </label>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#3D4BFF] hover:bg-blue-700 text-white text-sm font-medium px-12 py-2.5 rounded-md transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          <div className="mt-4 bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <HSNMasterFinder />
          </div>

        </div>

        {/* Right Column (Chatbot) */}
        <div className="w-full lg:w-[380px] shrink-0 sticky top-24">
          <div className="h-[520px]">
            <HSNChatbot />
          </div>
        </div>

      </div>

    </div>
  );
}
