import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Phone, User, Mail } from "lucide-react";
import { signupStep1 } from "../api/auth";

export function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isFormValid =
        formData.name.trim() !== "" &&
        formData.phone.trim().length >= 10 &&
        formData.email.trim() !== "" &&
        formData.email.includes("@");

    const handleContinue = async () => {
        if (!isFormValid) return;

        setIsLoading(true);
        setError(null);
        try {
            await signupStep1({
                fullName: formData.name,
                email: formData.email,
                phoneNumber: formData.phone
            });
            navigate("/verify-business", { state: { ...formData } });
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Failed to start signup';
            setError(Array.isArray(msg) ? msg.join(', ') : msg);
        } finally {
            setIsLoading(false);
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
                        Get Started
                    </h1>
                    <p className="text-gray-600">Create your account to continue</p>
                </motion.div>

                {/* Signup Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                >
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-2" htmlFor="name">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-2" htmlFor="phone">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    id="phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-2" htmlFor="email">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Continue Button */}
                        <button
                            onClick={handleContinue}
                            disabled={!isFormValid || isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3.5 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-4"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Continue</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-indigo-600 hover:underline font-medium"
                        >
                            Log in
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
