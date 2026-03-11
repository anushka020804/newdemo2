import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { 
  ArrowLeft,
  Trophy,
  Calendar,
  Building2,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  Download,
  TrendingUp,
  X,
  FileText,
  Clock,
  MapPin,
  Phone,
  Mail,
  User
} from "lucide-react";
import { generateContractPDF } from "../utils/generateContractPDF";

interface WonBid {
  id: string;
  tenderName: string;
  organization: string;
  value: string;
  wonDate: string;
  contractStartDate: string;
  contractDuration: string;
  status: "completed" | "in-progress" | "upcoming";
  winMargin: string;
}

export function WonBids() {
  const navigate = useNavigate();
  const [showMetalCapitalMessage, setShowMetalCapitalMessage] = useState(false);
  const [showMetalCapitalModal, setShowMetalCapitalModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState<WonBid | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const handleApplyForCredit = () => {
    setShowMetalCapitalModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Close modal
    setShowMetalCapitalModal(false);
    
    // Show success message
    setShowMetalCapitalMessage(true);
    setTimeout(() => {
      setShowMetalCapitalMessage(false);
    }, 3000);
    
    // Reset form
    setFormData({ name: "", phone: "", email: "" });
  };

  const isFormValid = formData.name.trim() !== "" && 
    (formData.phone.trim() !== "" || formData.email.trim() !== "");

  const handleDownloadContract = (bid: WonBid) => {
    generateContractPDF(bid);
  };

  const handleViewDetails = (bid: WonBid) => {
    setSelectedBid(bid);
  };

  const closeDetailsModal = () => {
    setSelectedBid(null);
  };

  const wonBids: WonBid[] = [
    {
      id: "1",
      tenderName: "Industrial Valves Supply - Karnataka PWD",
      organization: "Karnataka PWD",
      value: "₹45,00,000",
      wonDate: "Jan 28, 2026",
      contractStartDate: "Feb 10, 2026",
      contractDuration: "6 months",
      status: "upcoming",
      winMargin: "2.5%"
    },
    {
      id: "2",
      tenderName: "Railway Equipment Supply - Indian Railways",
      organization: "Railway Board",
      value: "₹35,00,000",
      wonDate: "Jan 15, 2026",
      contractStartDate: "Feb 1, 2026",
      contractDuration: "4 months",
      status: "in-progress",
      winMargin: "3.8%"
    },
    {
      id: "3",
      tenderName: "Steel Components - NHAI Project",
      organization: "NHAI",
      value: "₹28,50,000",
      wonDate: "Dec 20, 2025",
      contractStartDate: "Jan 5, 2026",
      contractDuration: "3 months",
      status: "completed",
      winMargin: "4.2%"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">Completed</span>;
      case "in-progress":
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200">In Progress</span>;
      case "upcoming":
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full border border-amber-200">Upcoming</span>;
      default:
        return null;
    }
  };

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
            <div>
              <h1 className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
                <Trophy className="w-6 h-6 text-green-600" />
                Won Bids
              </h1>
              <p className="text-sm text-gray-600">Congratulations on your successful tenders!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Won Bids</p>
            <p className="text-4xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">3</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Value</p>
            <p className="text-4xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">₹1.08Cr</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Avg Win Margin</p>
            <p className="text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">3.5%</p>
          </div>
        </motion.div>

        {/* Won Bids List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {wonBids.map((bid, index) => (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl mb-1">{bid.tenderName}</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm">{bid.organization}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <p className="text-xs text-gray-600 mb-1">Contract Value</p>
                  <p className="text-xl text-green-700">{bid.value}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-xs text-gray-600 mb-1">Won Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-700">{bid.wonDate}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-xs text-gray-600 mb-1">Start Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <p className="text-sm text-purple-700">{bid.contractStartDate}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                  <p className="text-xs text-gray-600 mb-1">Duration</p>
                  <p className="text-sm text-amber-700">{bid.contractDuration}</p>
                </div>
              </div>

              {/* Win Margin */}
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">
                  Won by <span className="text-green-600 font-semibold">{bid.winMargin}</span> competitive margin
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownloadContract(bid)}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2.5 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Contract</span>
                </button>
                <button
                  onClick={() => handleViewDetails(bid)}
                  className="flex-1 bg-white text-indigo-600 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-all border border-indigo-200 flex items-center justify-center gap-2"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Metal Capital CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 translate-y-24" />
          </div>

          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl mb-2">Need Working Capital for Your Won Contracts?</h3>
                <p className="text-amber-50 text-lg">
                  Metal Capital is here for you! Get instant credit to fulfill your contracts and grow your business.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-amber-100 text-sm mb-1">Fast Approval</p>
                  <p className="text-2xl">24 hours</p>
                </div>
                <div>
                  <p className="text-amber-100 text-sm mb-1">Credit Limit</p>
                  <p className="text-2xl">Up to ₹1Cr</p>
                </div>
                <div>
                  <p className="text-amber-100 text-sm mb-1">Interest Rate</p>
                  <p className="text-2xl">From 12%*</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleApplyForCredit}
                className="flex-1 bg-white text-amber-600 px-8 py-4 rounded-xl hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
              >
                <Sparkles className="w-5 h-5" />
                <span>Apply for Credit Now</span>
              </button>
              
              <button
                onClick={() => navigate("/metal-capital-dashboard")}
                className="flex-1 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2 text-lg"
              >
                <Building2 className="w-5 h-5" />
                <span>Go to Metal Capital Dashboard</span>
              </button>
            </div>

            <p className="text-amber-100 text-xs mt-4">
              *Terms and conditions apply. Subject to credit approval.
            </p>
          </div>
        </motion.div>

        {/* Success Message Toast */}
        {showMetalCapitalMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">✓</span>
              </div>
              <p className="text-lg">Thanks for applying! Our team will get back to you shortly.</p>
            </div>
          </motion.div>
        )}

        {/* Details Modal */}
        {selectedBid && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Bid Details</h2>
                <button
                  onClick={closeDetailsModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <p className="text-xs text-gray-600 mb-1">Contract Value</p>
                  <p className="text-xl text-green-700">{selectedBid.value}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-xs text-gray-600 mb-1">Won Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-700">{selectedBid.wonDate}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-xs text-gray-600 mb-1">Start Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <p className="text-sm text-purple-700">{selectedBid.contractStartDate}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                  <p className="text-xs text-gray-600 mb-1">Duration</p>
                  <p className="text-sm text-amber-700">{selectedBid.contractDuration}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Tender Name</p>
                  <p className="text-sm text-gray-700">{selectedBid.tenderName}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Organization</p>
                  <p className="text-sm text-gray-700">{selectedBid.organization}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Win Margin</p>
                  <p className="text-sm text-gray-700">{selectedBid.winMargin}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Status</p>
                  <p className="text-sm text-gray-700">{selectedBid.status}</p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => handleDownloadContract(selectedBid)}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2.5 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Contract</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Metal Capital Modal */}
        {showMetalCapitalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setShowMetalCapitalModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 pb-8">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <button
                    onClick={() => setShowMetalCapitalModal(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="text-2xl text-white mt-4">Apply for Metal Capital</h2>
                <p className="text-amber-50 text-sm mt-1">Fill in your details and our team will reach out</p>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2" htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2" htmlFor="phone">
                    Phone Number {!formData.email && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-500">OR</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2" htmlFor="email">
                    Email Address {!formData.phone && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Info Text */}
                <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  💡 Please provide either phone number or email address (or both) so we can contact you.
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                    isFormValid
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>Submit Application</span>
                  <Sparkles className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}