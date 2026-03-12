import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { CheckCircle2, User, ClipboardList, Settings } from "lucide-react";

export function WelcomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const companyName = (location.state as any)?.companyName || "Your Business";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -left-48 -top-32 w-96 h-96 bg-gradient-to-tr from-indigo-200 to-transparent rounded-full opacity-40 pointer-events-none" />
      <div className="absolute -right-48 -bottom-24 w-80 h-80 bg-gradient-to-br from-blue-200 to-transparent rounded-full opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full border border-gray-100 text-center relative z-10"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 text-green-700 rounded-full flex items-center justify-center ring-4 ring-green-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        </div>

        <h2 className="text-3xl font-semibold mb-2">Welcome, <span className="text-indigo-600">{companyName}</span>!</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">Your account was created successfully. Here are a few quick actions to get you started — explore tenders, complete your profile, or update settings.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-xl mx-auto">
          <div className="flex flex-col items-center gap-2 p-3 border border-gray-100 rounded-lg">
            <div className="p-2 bg-indigo-50 rounded-md">
              <ClipboardList className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-sm font-medium">Explore Tenders</div>
            <div className="text-xs text-gray-500">Browse and bid on tenders</div>
          </div>

          <div className="flex flex-col items-center gap-2 p-3 border border-gray-100 rounded-lg">
            <div className="p-2 bg-indigo-50 rounded-md">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-sm font-medium">Complete Profile</div>
            <div className="text-xs text-gray-500">Add more business details</div>
          </div>

          <div className="flex flex-col items-center gap-2 p-3 border border-gray-100 rounded-lg">
            <div className="p-2 bg-indigo-50 rounded-md">
              <Settings className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-sm font-medium">Notification Settings</div>
            <div className="text-xs text-gray-500">Manage alerts & preferences</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <motion.button
            onClick={() => navigate("/dashboard")}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md"
          >
            Go to Dashboard
          </motion.button>

          <button
            onClick={() => navigate("/complete-profile")}
            className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-all"
          >
            Complete Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
}
