import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Building2, Sparkles, ArrowRight, X, Phone, Mail, User } from "lucide-react";
import { useState } from "react";

export function PortalPage() {
  const navigate = useNavigate();
  const [showMetalCapitalMessage, setShowMetalCapitalMessage] = useState(false);
  const [showMetalCapitalModal, setShowMetalCapitalModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const handleMetalCapitalApply = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        {/* Logo & Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <h1 className="text-5xl tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Qistonpe
            </h1>
            <p className="text-gray-600">Empowering B2B businesses with smart solutions</p>
          </motion.div>
        </div>

        {/* Two Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Metal Capital Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 h-full border border-gray-100 relative overflow-hidden">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50" />

              {/* Advertisement Badge */}
              <div className="absolute top-4 right-4 z-20">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                  <Building2 className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h2 className="text-3xl mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Metal Capital
                </h2>
                <p className="text-gray-600 mb-8">
                  Quick financing for tender requirements
                </p>

                {/* Buttons */}
                <div className="space-y-3">
                  {/* Apply Now Button */}
                  <button
                    onClick={handleMetalCapitalApply}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3.5 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Go to Dashboard Button */}
                  <button
                    onClick={() => navigate("/metal-capital-dashboard")}
                    className="w-full bg-white text-amber-600 px-6 py-3.5 rounded-xl hover:bg-amber-50 transition-all duration-300 flex items-center justify-center gap-2 border border-amber-200 shadow-sm hover:shadow-md"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* OpportunityX Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full border border-gray-100 relative overflow-hidden">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h2 className="text-3xl mb-2 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  OpportunityX
                </h2>
                <p className="text-gray-600 mb-8">
                  Discover tenders for your business
                </p>

                {/* CTA Button */}
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3.5 rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-lg"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

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
                  className={`w-full px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${isFormValid
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <span>Submit Application</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}