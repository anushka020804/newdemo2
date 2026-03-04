import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, Mail, Check } from "lucide-react";
import { sendOtp, verifyOtp } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = async () => {
    if (!email.trim() || !email.includes("@")) return;

    setIsLoading(true);
    setError(null);
    try {
      await sendOtp({ email });
      setShowOTP(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to send OTP';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;

    setVerifying(true);
    setError(null);
    try {
      const data = await verifyOtp({ email, otp: otpCode });
      // Save user + token to AuthContext (which also persists to localStorage)
      if (data.user && data.accessToken) {
        login(data.user, data.accessToken);
      }
      const from = (location.state as any)?.from;
      navigate(from === "hsn" ? "/welcome" : "/dashboard", { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Invalid OTP';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            OpportunityX
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <h2 className="text-2xl mb-6 text-gray-900">Login</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !showOTP && handleSendOTP()}
                placeholder="Enter your email"
                disabled={showOTP}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* OTP Verification Section (Appears Below) */}
          <AnimatePresence>
            {showOTP && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4 mt-4">
                    <label className="block text-sm text-gray-700">
                      Enter OTP
                    </label>
                    <button
                      onClick={() => {
                        setShowOTP(false);
                        setOtp(["", "", "", "", "", ""]);
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-700"
                    >
                      Change Email
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    Sent to {email}
                  </p>

                  {/* OTP Input Boxes */}
                  <div className="flex gap-2 justify-between mb-4">
                    {otp.map((digit, index) => (
                      <motion.input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value.replace(/[^0-9]/g, ""))}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="w-full aspect-square text-center text-2xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    ))}
                  </div>

                  {/* Resend OTP */}
                  <div className="text-center mb-4">
                    <button
                      onClick={handleSendOTP}
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      Didn't receive? <span className="text-indigo-600">Resend OTP</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <motion.button
            onClick={showOTP ? handleVerifyOTP : handleSendOTP}
            disabled={showOTP ? (otp.join("").length !== 6 || verifying) : (!email.includes("@") || isLoading)}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3.5 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading || verifying ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{showOTP ? "Verify OTP" : "Send OTP"}</span>
                {showOTP ? (
                  <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                ) : (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
