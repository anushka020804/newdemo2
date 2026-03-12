import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/useLogout";

import {
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  ClipboardCheck,
  Factory,
  ShieldEllipsis,
  Zap,
  Plus,
  Minus,
  Users,
  LayoutDashboard,
  Globe,
  Mail,
  MessageSquare,
  ArrowUpRight,
  Target,
  CheckCircle,
  Gift,
  Search,
  FileText,
  BarChart3,
  ArrowRight,
  Lock,
  Building2,
  Check,
  Clock,
  AlertTriangle,
  FileWarning,
  BarChart,
  Star,
  Menu,
  Send,
  User,
  Phone,
  UserPlus,
  Cpu,
  SearchCheck,
  FileDown,
  X,
  Database,
  GlobeLock,
  ShieldAlert,
  FileCheck,
  TrendingUp,
  Sparkles,
  FileSearch,
  Building,
} from "lucide-react";

// --- Animation Variants ---
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
};

const ModalForm = ({
  type,
  onClose,
}: {
  type: "demo" | "contact";
  onClose: () => void;
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full relative shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-900"
        >
          <X size={24} />
        </button>

        {!submitted ? (
          <>
            <div className="mb-8">
              <h3 className="text-3xl font-black text-slate-900 mb-2">
                {type === "demo" ? "Schedule a Demo" : "Contact Our Team"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                type="text"
                placeholder="Full Name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#0b80c6] text-white rounded-xl font-bold"
              >
                {loading
                  ? "Processing..."
                  : type === "demo"
                    ? "Confirm Booking"
                    : "Send Message"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 size={40} className="mx-auto mb-4 text-green-600" />
            <h3 className="text-2xl font-bold">
              {type === "demo"
                ? "Booked Successfully!"
                : "Submission Received!"}
            </h3>

            <button
              onClick={onClose}
              className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const manualPains = [
  "Monitoring multiple tender portals manually",
  "Missing relevant bids due to manual tracking",
  "Spending days on compliance-heavy docs",
  "Facing rejections due to minor errors",
  "Limited manpower to scale bidding",
];

const aiGains = [
  "Unified dashboard for 90+ PSU portals",
  "Instant AI alerts for matching bids",
  "Bid docs generated in < 15 minutes",
  "99% Accuracy on compliance checks",
  "Scale bidding without adding headcount",
];
const faqData = [
  {
    category: "AI Technology",
    icon: <Sparkles className="w-4 h-4" />,
    question: "What is an AI tender automation platform?",
    answer:
      "AI tender automation platform helps MSME manufacturers automatically discover relevant PSU tenders, evaluate eligibility, and generate bid-ready documentation using artificial intelligence.",
  },
  {
    category: "Compliance",
    icon: <FileSearch className="w-4 h-4" />,
    question: "How can MSMEs reduce technical rejection?",
    answer:
      "By using automated compliance checks and AI-driven document preparation, MSMEs can eliminate common errors that cause technical disqualification.",
  },
  {
    category: "Government",
    icon: <Building className="w-4 h-4" />,
    question: "Is this suitable for government bidding in India?",
    answer:
      "Yes. The platform is specifically designed for Indian PSU OEM procurement processes across power, railways, heavy engineering, and defense sectors.",
  },
  {
    category: "Security",
    icon: <ShieldCheck className="w-4 h-4" />,
    question: "Is my tender documentation data secure?",
    answer:
      "Yes. The platform operates under Indian data and privacy regulations and does not publicly share proprietary company information.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create your company profile once",
    desc: "Input your core manufacturing capabilities, certifications, and past performance data.",
    icon: <UserPlus className="w-6 h-6" />,
    color: "bg-[#0b80c6]",
  },
  {
    step: "02",
    title: "AI curates relevant tenders automatically",
    desc: "Our engine scans 90+ PSU portals and matches your profile to high-probability bids.",
    icon: <Cpu className="w-6 h-6" />,
    color: "bg-indigo-500",
  },
  {
    step: "03",
    title: "Check eligibility & risks instantly",
    desc: "AI flags technical disqualification risks and compliance gaps before you spend a rupee.",
    icon: <SearchCheck className="w-6 h-6" />,
    color: "bg-violet-500",
  },
  {
    step: "04",
    title: "Generate bid-ready documentation",
    desc: "Download structured, error-free technical and compliance docs in minutes.",
    icon: <FileDown className="w-6 h-6" />,
    color: "bg-purple-600",
  },
];
const benefits = [
  {
    title: "3–5x More Tenders",
    text: "Scale your reach without increasing headcount.",
    pos: "top-[10%] left-[10%] md:left-[12%]",
  },
  {
    title: "Zero Rejections",
    text: "Eliminate technical errors before submission.",
    pos: "top-[13%] right-[10%] md:right-[12%]",
  },
  {
    title: "Instant Compliance",
    text: "Automatic checks for eligibility and risks.",
    pos: "bottom-[18%] left-[10%] md:left-[9%]",
  },
  {
    title: "Team Freedom",
    text: "Shift focus from paperwork to production.",
    pos: "bottom-[15%] right-[20%] md:right-[9%]",
  },
  {
    title: "Scale Confidently",
    text: "Compete with industry giants on even ground.",
    pos: "top-[38%] right-[4%] md:right-[6%]",
  },
  {
    title: "Smart Automation",
    text: "Reduce manual effort by over 90%.",
    pos: "top-[35%] left-[4%] md:left-[6%]",
  },
];
const securityPoints = [
  {
    text: "Hosted under Indian compliance standards",
    icon: <Database className="w-5 h-5" />,
  },
  {
    text: "Governed by Indian data protection laws",
    icon: <GlobeLock className="w-5 h-5" />,
  },
  {
    text: "No public sharing of proprietary data",
    icon: <ShieldAlert className="w-5 h-5" />,
  },
  {
    text: "Secure VPC access architecture",
    icon: <Lock className="w-5 h-5" />,
  },
];

// --- Components ---
const SmartAccordion = ({
  item,
  index,
}: {
  item: (typeof faqData)[0];
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`group mb-4 rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "border-indigo-500 bg-indigo-50/30 shadow-lg shadow-indigo-100/50"
          : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex items-start justify-between gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                isOpen
                  ? "bg-[#0b80c6] text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-[#0b80c6]"
              }`}
            >
              {item.icon} {item.category}
            </span>
          </div>
          <h4
            className={`text-lg font-bold transition-colors ${isOpen ? "text-indigo-900" : "text-slate-800"}`}
          >
            {item.question}
          </h4>
        </div>
        <div
          className={`mt-1 shrink-0 p-1 rounded-full border transition-transform duration-300 ${
            isOpen
              ? "rotate-180 bg-[#0b80c6] border-[#0b80c6] text-white"
              : "border-slate-300 text-slate-400"
          }`}
        >
          {isOpen ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0">
              <div className="h-px bg-indigo-100 mb-4" />
              <p className="text-slate-600 leading-relaxed">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export function MarketingLandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const handleLogout = useLogout();
  const [activeForm, setActiveForm] = useState<"demo" | "contact" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  const closeForm = () => {
    setActiveForm(null);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-2 font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation Bar - Retained from current version for functionality */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/assets/logo.jpg"
              alt="Logo"
              className="h-14 w-auto max-w-[220px] object-contain bg-white"
            />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Home
            </a>
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                navigate("/about");
              }}
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              About
            </a>
            <div className="relative group">
              <button className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1 focus:outline-none">
                Products
                <svg
                  className="w-4 h-4 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity z-50">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/");
                  }}
                  className="block px-5 py-3 text-sm rounded-lg font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  OpportunityX
                </a>
                <a
                  href="/metalcapital"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/metalcapital");
                  }}
                  className="block px-5 py-3 text-sm rounded-lg font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  MetalCapital
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors hidden sm:block"
                >
                  {user?.fullName?.split(" ")[0] ?? "Dashboard"}
                </button>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-500 hover:text-red-600 border border-red-200 px-4 py-2 rounded-lg transition-all hover:bg-red-50 hidden sm:block"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Start Now
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Toggle Button for OpportunityX / MetalCapital */}
      <div
        className="w-full flex justify-center bg-slate-50 relative z-40"
        style={{ paddingTop: 96, paddingBottom: 0 }}
      >
        <div
          className="flex rounded-full overflow-hidden border border-indigo-200 shadow-md"
          style={{ minWidth: 320 }}
        >
          <button
            onClick={() => navigate("/")}
            className={`px-8 py-3 text-lg font-semibold transition-all focus:outline-none border-r border-indigo-200 ${window.location.pathname === "/" ? "bg-[#0b80c6] text-white" : window.location.pathname.startsWith("/metalcapital") ? "bg-white text-indigo-700" : "bg-white text-indigo-700 hover:bg-indigo-50"}`}
            aria-pressed={window.location.pathname === "/"}
          >
            OpportunityX
          </button>
          <button
            onClick={() => navigate("/metalcapital")}
            className={`px-8 py-3 text-lg font-semibold transition-all focus:outline-none border-l border-indigo-200 ${window.location.pathname.startsWith("/metalcapital") ? "bg-[#0b80c6] text-white" : "bg-white text-indigo-700 hover:bg-indigo-50"}`}
            aria-pressed={window.location.pathname.startsWith("/metalcapital")}
          >
            MetalCapital
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-5 pb-5 lg:pt-8 lg:pb-2 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeIn}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-3">
              AI Tender Automation Platform for{" "}
              <span className="text-[#0b80c6]">MSME Manufacturers</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-5 leading-relaxed">
              Discover relevant PSU tenders, check eligibility instantly, and
              generate bid-ready compliant documentation in minutes — built
              specifically for Indian MSMEs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-[#0b80c6] text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-200"
              >
                Start Free for 6 Months
              </button>
              <a
                href="#how-it-works"
                className="px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
              >
                How it Works
              </a>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-centre"
            >
              {[
                "Auto Curated Tenders Across 90+ PSUs/OEMs",
                "AI Eligibility & Risks Assessment in Minutes",
                "Automated Bid Documentation (Save upto 90% time)",
              ].map((point, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="flex items-start gap-3 bg-white/50 backdrop-blur p-4 rounded-xl border border-[#0b80c6]"
                >
                  <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{point}</span>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-6 py-2 ">
              <p className="text-sm font-bold uppercase tracking-widest text-[#0b80c6] mb-2">
                Trusted Compliance
              </p>
              <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale">
                <span className="font-bold text-xl">
                  Built for Indian MSMEs
                </span>
                <span className="font-bold text-xl">|</span>
                <span className="font-bold text-xl">
                  Governed by Indian Data Laws
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section
        id="problem"
        className="py-12 lg:py-16 bg-white relative overflow-hidden min-h-[90vh] flex flex-col justify-center"
      >
        {/* TOP DECORATION */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* ANIMATED BACKGROUND ELEMENTS */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.05, 0.03] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -left-24 w-96 h-96 bg-red-500 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.08, 0.03] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-[100px]"
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          {/* SECTION HEADER */}
          <div className="text-center max-w-4xl mx-auto mb-10 lg:mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl lg:text-4xl font-black text-slate-900 leading-[1.2] tracking-tight"
            >
              You’re Not Losing Tenders to Competitors— <br />
              <span className="text-red-600">
                You’re Losing Them to Your Process.
              </span>
            </motion.h2>
          </div>

          {/* THE FLUSH CONTAINER */}
          <div className="relative grid lg:grid-cols-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border border-slate-100 bg-white max-w-4xl mx-auto">
            {/* FLOATING VS BADGE */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center">
              <div className="w-px h-8 bg-gradient-to-b from-transparent to-slate-300" />
              <div className="bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-[10px] border-[3px] border-white shadow-xl">
                VS
              </div>
              <div className="w-px h-8 bg-gradient-to-t from-transparent to-slate-300" />
            </div>

            {/* LEFT PANEL: THE PAIN */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-6 md:p-8 lg:p-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-100 p-1.5 rounded-lg text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Manual Chaos
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                      Growth Bottleneck
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {manualPains.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center group">
                      <div className="shrink-0 bg-white border border-red-100 p-1 rounded-md text-red-500">
                        <X className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <p className="text-slate-700 font-bold text-sm italic">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/50 rounded-xl border border-red-100 border-dashed">
                <p className="text-red-500 font-black text-[9px] uppercase tracking-widest mb-0.5">
                  Efficiency Leak
                </p>
                <p className="text-slate-900 font-black text-xl">2+ Days</p>
                <p className="text-slate-500 font-bold text-[10px]">
                  Wasted per single tender
                </p>
              </div>
            </motion.div>

            {/* RIGHT PANEL: THE GAIN */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-[#0b80c6] p-6 md:p-8 lg:p-10 text-white relative flex flex-col justify-between"
            >
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/20 p-1.5 rounded-lg border border-white/30 text-white">
                    <BarChart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                      OpportunityX
                    </h3>
                    <p className="text-indigo-200 font-medium text-[10px] tracking-tight">
                      AI Dominance
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {aiGains.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="shrink-0 bg-green-400 p-1 rounded-md text-indigo-900">
                        <Check className="w-3 h-3" strokeWidth={4} />
                      </div>
                      <p className="text-white font-bold text-sm italic">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                {/* STAMP COMPONENT - FIXED LAG */}
                <div className="relative h-32 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-indigo-900/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* REJECTED STAMP */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 0.3, rotate: -15 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="border-4 border-red-500 px-4 py-1 rounded text-red-500 font-black text-2xl uppercase"
                    >
                      REJECTED
                    </motion.div>

                    {/* BID APPROVED OVERLAY - Optimized Transition */}
                    <motion.div
                      initial={{ y: "100%" }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.6, // Shorter delay for better feel
                        type: "spring",
                        damping: 20,
                        stiffness: 100,
                      }}
                      className="absolute inset-0 bg-[#0b80c6]  flex flex-col items-center justify-center border-t border-indigo-400/30 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.9, type: "spring" }}
                        className="bg-green-400 p-1.5 rounded-full mb-1"
                      >
                        <Check
                          className="w-5 h-5 text-indigo-900"
                          strokeWidth={4}
                        />
                      </motion.div>
                      <p className="font-black text-lg tracking-tight text-white">
                        BID APPROVED
                      </p>
                      <p className="text-indigo-200 font-bold text-[9px]">
                        Qualified in 4 Minutes
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AGITATE SECTION */}
      <section className="py-30 bg-[#1b1464] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Every Missed Tender Is{" "}
              <span className="text-red-600">Lost Revenue.</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Efficiency Gap",
                  desc: "Competitors apply to more tenders using automation",
                },
                {
                  title: "Wasted Effort",
                  desc: "Technical disqualifications waste weeks of manual work",
                },
                {
                  title: "Risk Exposure",
                  desc: "Compliance gaps go unnoticed until it's too late",
                },
                {
                  title: "Resource Drain",
                  desc: "Team spends more time on paper than production",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors"
                >
                  <div className="text-indigo-400 mb-4 font-bold text-xl">
                    0{i + 1}.
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section id="solution" className="py-7 lg:py-7 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-5">
            <h2 className="text-4xl md:text-6xl font-black text-[slate-900] mb-1 tracking-tighter leading-[1.1]">
              {" "}
              Introducing AI-Powered PSU <br className="hidden md:block" />
              <span className="text-[#0b80c6]">
                Tender Management & Bid Automation
              </span>
            </h2>
            <p className="text-slate-600 text-lg">
              An AI integrated platform designed specifically for MSME
              manufacturers supplying to PSU OEMs in India.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 px-8 pt-2">
            {/* Discovery */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 transition-all duration-300 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 hover:shadow-xl hover:shadow-indigo-100/50"
            >
              {/* <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-8">
          <Search className="text-[#0b80c6] w-7 h-7" />
        </div> */}
              <h3 className="text-2xl font-bold mb-2 text-center">
                AI Powered Tender Discovery Across 90+ PSUs & OEMs
              </h3>

              <p className="text-slate-600 mb-2 leading-relaxed">
                Automatically scans and curates relevant tenders from multiple
                PSU portals.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" /> No more
                  switching portals.
                </li>
                <li className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" /> No more
                  missed opportunities.
                </li>
                <li className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  No manual tracking spreadsheets.
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  This is intelligent government tender discovery built for
                  MSMEs
                </li>
              </ul>
            </motion.div>

            {/* Eligibility */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 transition-all duration-300 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 hover:shadow-xl hover:shadow-indigo-100/50"
            >
              {/* <div className="bg-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-8">
          <BarChart3 className="text-[#0b80c6] w-7 h-7" />
        </div> */}
              <h3 className="text-2xl font-bold mb-2 text-center">
                Eligibility & Risk Checks in Minutes
              </h3>
              <p className="text-slate-600 mb-2 leading-relaxed">
                Our AI Based Tender Platform Instantly analyzes:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Technical
                  Disqualification Criteria
                </li>
                <li className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />{" "}
                  Compliance Requirements
                </li>
                <li className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />{" "}
                  Documentations Gaps
                </li>
                <li className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Risk
                  Factors
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  {" "}
                  Before you invest time preparing the bid. Apply only where you
                  have a real chance to win.
                </li>
              </ul>
            </motion.div>

            {/* Documentation */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 transition-all duration-300 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 hover:shadow-xl hover:shadow-indigo-100/50"
            >
              {/* <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-8">
          <FileText className="text-purple-600 w-7 h-7" />
        </div> */}
              <h3 className="text-2xl font-bold mb-2 text-center">
                Automated Bid-Ready Documentation
              </h3>
              <p className="text-slate-600 mb-2 leading-relaxed">
                Upload basic company data once. The platform generates:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />{" "}
                  Structured technical documentation
                </li>
                <li className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />{" "}
                  Compliance-aligned bid formats
                </li>
                <li className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Error
                  minimized documentation
                </li>
                <li className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Organized
                  submission-ready files
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  {" "}
                  Reduce bid preparation time by up to 95%
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
      {/* SECTION 5: BENEFITS - GROWTH MULTIPLIER */}
      <section className="relative w-full min-h-screen lg:h-screen bg-white flex flex-col lg:items-center lg:justify-center overflow-hidden font-sans py-20 lg:py-0">
        {/* Background Brand Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-[#5842f4]/5 rounded-full blur-[80px] lg:blur-[120px]" />
        </div>

        {/* Central Headline Section */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-block px-4 py-1.5 mb-6 text-[10px] lg:text-[11px] font-bold tracking-[0.2em] text-[#5842f4] uppercase bg-[#5842f4]/10 rounded-full"
          >
            The Growth Multiplier
          </motion.span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6 lg:mb-8">
            Apply to More. <br />
            <span className="text-[#0b80c6]">Win More.</span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg lg:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto"
          >
            The only AI-driven tender platform built specifically for Indian
            MSME Manufacturers.
          </motion.p>
        </motion.div>

        {/* MOBILE DESIGN: Vertical Stack (Visible only on mobile/tablet) */}
        <div className="lg:hidden mt-12 px-6 w-full z-20 grid grid-cols-1 gap-4">
          {benefits.map((item, i) => (
            <motion.div
              key={`mobile-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]"
            >
              <h3 className="text-lg font-black text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 font-medium">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* DESKTOP DESIGN: Floating Benefit Cards (Hidden on mobile) */}
        {benefits.map((item, i) => (
          <motion.div
            key={`desktop-${i}`}
            className={`absolute z-20 hidden lg:block ${item.pos}`}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 1.2 + i * 0.1,
              duration: 0.7,
              type: "spring",
              stiffness: 70,
            }}
          >
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, i % 2 === 0 ? 0.5 : -0.5, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-72 p-7 rounded-[2rem] bg-white/95 backdrop-blur-md border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:shadow-[#5842f4]/15 hover:scale-105 transition-all duration-500 relative overflow-hidden group cursor-default"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#5842f4]/20" />
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#5842f4] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight tracking-tight">
                {item.title}
              </h3>
              <p className="text-[15px] text-slate-600 leading-relaxed font-medium">
                {item.text}
              </p>
            </motion.div>
          </motion.div>
        ))}

        {/* Radial fade to soften the edges */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_white_85%)] pointer-events-none" />
      </section>

      {/* SECTION 6: BUILT FOR INDIAN MSMEs */}
      <section className="py-20 bg-[#1b1464] text-white overflow-hidden relative">
        {/* Decorative Indian-inspired subtle pattern or glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -mt-64" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#0b80c6]/10 blur-[120px] rounded-full -mb-64" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* CENTERED CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4">
                India-First Platform
              </h2>
              <h3 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
                Built Specially for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-slate-400">
                  Indian MSMEs
                </span>
              </h3>
              <p className="text-slate-400 text-lg mb-12 mx-auto">
                Unlike generic global portals, we’ve engineered this
                specifically for the nuances of Indian PSU procurement and MSME
                compliance.
              </p>

              {/* FEATURE CARDS - CENTERED GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Designed for Indian PSU procurement processes",
                    icon: (
                      <Globe className="text-indigo-400 mx-auto" size={28} />
                    ),
                  },
                  {
                    title: "Structured around real compliance required",
                    icon: (
                      <LayoutDashboard
                        className="text-indigo-400 mx-auto"
                        size={28}
                      />
                    ),
                  },
                  {
                    title: "Simplified interface (no enterprise complexity)",
                    icon: (
                      <CheckCircle
                        className="text-indigo-400 mx-auto"
                        size={28}
                      />
                    ),
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="mb-4 transform group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-white text-sm md:text-base leading-snug">
                      {item.title}
                    </h4>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="py-10 lg:py-12 lg:pb-10 bg-slate-50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              How it Works
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0b80c6] to-violet-600"></span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We've automated the complex PSU procurement lifecycle so you can
              focus on manufacturing excellence.
            </p>
          </motion.div>

          <div className="relative">
            {/* THE ANIMATED CONNECTOR LINE (Desktop Only) */}
            <div className="hidden lg:block absolute top-24 left-0 w-full h-1 bg-slate-200">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="h-full bg-gradient-to-r from-[#0b80c6] via-indigo-500 to-purple-600 origin-left"
              />
            </div>

            {/* STEPS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
              {steps.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.25, // This creates the "one by one" loading effect
                    ease: "backOut",
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group relative"
                >
                  {/* 3D-Look Card */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col items-center text-center transition-all group-hover:shadow-indigo-100 group-hover:border-indigo-200">
                    {/* Step Number & Icon */}
                    <div
                      className={`relative w-20 h-20 mb-8 flex items-center justify-center rounded-2xl ${item.color} text-white shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-300`}
                    >
                      <span className="absolute -top-4 -right-4 bg-slate-900 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
                        {item.step}
                      </span>
                      {item.icon}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-[#0b80c6] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-slate-500 leading-relaxed text-sm">
                      {item.desc}
                    </p>

                    {/* Decorative Subtle Element */}
                    <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-1 bg-indigo-100 rounded-full mx-auto" />
                    </div>
                  </div>

                  {/* Mobile Step Indicator Connector */}
                  {i < 3 && (
                    <div className="lg:hidden absolute -bottom-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-indigo-200" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* DATA SECURITY SECTION */}
      <section className="py-24 lg:py-16 bg-[#1b1464] relative overflow-hidden">
        {/* 1. ENTERPRISE GRID BACKGROUND */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* 2. ANIMATED SPOTLIGHT GRADIENT */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#0b80c6]/30 rounded-full blur-[120px] pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT SIDE: ANIMATED SECURITY ILLUSTRATION */}
            <div className="relative flex justify-center items-center">
              {/* Rotating Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 md:w-80 md:h-80 border-2 border-dashed border-indigo-500/30 rounded-full"
              />

              {/* Pulsing Inner Glow */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute w-40 h-40 bg-indigo-500 rounded-full blur-3xl"
              />

              {/* Main Shield Visual */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-20 bg-gradient-to-br from-indigo-500 to-[#0b80c6] p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 border border-white/20"
              >
                <ShieldCheck className="w-24 h-24 md:w-32 md:h-32 text-white drop-shadow-lg" />

                {/* Floating Orbiting Mini Icons */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 p-2 rounded-lg border border-indigo-400/50">
                    <Lock className="w-5 h-5 text-indigo-400" />
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT SIDE: CONTENT & CARDS */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-left"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                Is My Data{" "}
                <span className="text-indigo-400 text-glow">Secure?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-xl">
                We treat your proprietary bid data with the same rigor as PSU
                defense contractors. Your strategic advantage is protected by
                multi-layer encryption and local sovereignty.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {securityPoints.map((point, i) => (
                  <motion.div
                    key={i}
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(79, 70, 229, 0.2)",
                    }}
                    className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all"
                  >
                    <div className="text-indigo-400 shrink-0 mt-1">
                      {point.icon}
                    </div>
                    <span className="text-slate-200 font-medium leading-snug">
                      {point.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Indian Compliance Badge */}
              <div className="mt-10 inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
                  Compliant with Digital Personal Data Protection Act (DPDP)
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OFFER SECTION */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="relative">
            {/* 🎁 FLOATING "6 MONTHS FREE" BADGE */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              whileInView={{ scale: 1, rotate: 5 }}
              viewport={{ once: true }}
              animate={{
                y: [-8, 8, -8],
                rotate: [5, 2, 5],
              }}
              transition={{
                scale: { type: "spring", stiffness: 260, damping: 20 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -top-8 -left-4 md:-top-10 md:-left-10 z-30 pointer-events-none"
            >
              <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-[#0b80c6] p-[2px] rounded-2xl shadow-2xl">
                <div className="bg-white px-6 py-3 rounded-[14px] flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Gift className="text-orange-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                      Limited Time
                    </p>
                    <p className="text-xl font-black text-slate-900 leading-none">
                      6 MONTHS FREE
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-indigo-500/30 blur-2xl -z-10 animate-pulse" />
            </motion.div>

            {/* MAIN CARD CONTAINER */}
            <div className="bg-slate-50 border border-slate-200 rounded-[3rem] overflow-hidden grid lg:grid-cols-2 relative shadow-2xl shadow-slate-200/50">
              {/* LEFT CONTENT */}
              <div className="p-4 md:p-16 lg:p-10 relative z-10 bg-white/50 backdrop-blur-sm">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
                  Empowering MSMEs to <br />{" "}
                  <span className="text-[#0b80c6] font-black">
                    Scale without Limits.
                  </span>
                </h2>

                <div className="space-y-1 mb-4 pl-5">
                  {[
                    {
                      t: "No upfront cost",
                      d: "Zero setup fees for eligible manufacturers.",
                    },
                    {
                      t: "No commitment",
                      d: "Cancel anytime if it doesn't fit your workflow.",
                    },
                    {
                      t: "R̶s̶.̶ ̶3̶000̶0̶ Rs. 0",
                      d: "Get Rs. 30000 worth subscription for free",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="bg-green-100 p-1 rounded-full mt-1">
                        <CheckCircle className="text-green-600 w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-none mb-1">
                          {item.t}
                        </h4>
                        <p className="text-slate-500 text-sm">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl mb-10">
                  <p className="text-indigo-800 font-bold italic">
                    "If it doesn’t help you apply more — you walk away."
                  </p>
                </div>

                <motion.button
                  onClick={() => navigate("/signup")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full sm:w-auto px-10 py-5 bg-[#0b80c6] text-white rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3"
                >
                  Claim 6 Months Free Access
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              {/* RIGHT VISUAL WITH ANIMATED GRADIENT */}
              <div className="relative flex items-center justify-center p-12 overflow-hidden min-h-[500px]">
                {/* 1. ANIMATED MESH GRADIENT BACKGROUND */}
                <div
                  className="absolute inset-0 z-0 animate-mesh-gradient"
                  style={{
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #3b82f6 25%, #8b5cf6 50%, #6366f1 75%, #4f46e5 100%)",
                    backgroundSize: "400% 400%",
                  }}
                />

                {/* 2. REAL MANUFACTURING OVERLAY IMAGE (Blended) */}
                <div className="absolute inset-0 z-[1] opacity-30 mix-blend-overlay">
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000"
                    alt="Manufacturing Plant"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 3. DARK OVERLAY FOR TEXT READABILITY */}
                <div className="absolute inset-0 bg-indigo-900/40 z-[2]" />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="relative z-10 w-full max-w-sm"
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-20 bg-indigo-500/40 blur-[100px] rounded-full animate-pulse" />

                  {/* MAIN ANIMATED DOCUMENT STACK CARD */}
                  <div className="relative bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden">
                    {/* "AI Generating" Status Tag */}
                    <div className="absolute top-4 right-6 flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                      <span className="text-[10px] font-bold text-green-300 uppercase tracking-tighter">
                        AI Generating Bid...
                      </span>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Document 1 (Back) */}
                      <motion.div
                        animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-full h-16 bg-white/5 rounded-xl border border-white/10 flex items-center px-4 gap-3 opacity-50"
                      >
                        <div className="w-8 h-8 rounded bg-white/10" />
                        <div className="flex-1 space-y-2">
                          <div className="w-2/3 h-2 bg-white/10 rounded" />
                          <div className="w-1/2 h-2 bg-white/10 rounded" />
                        </div>
                      </motion.div>

                      {/* Document 2 (Middle) */}
                      <motion.div
                        animate={{ x: [0, -10, 0], y: [0, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="w-full h-20 bg-white/10 rounded-xl border border-white/20 flex items-center px-5 gap-4 shadow-xl translate-x-4"
                      >
                        <FileCheck className="text-indigo-300 w-10 h-10" />
                        <div className="flex-1 space-y-2">
                          <div className="w-full h-2.5 bg-indigo-300/30 rounded" />
                          <div className="w-3/4 h-2.5 bg-white/20 rounded" />
                        </div>
                      </motion.div>

                      {/* Document 3 (Front - Focus) */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-full h-24 bg-white rounded-2xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center px-6 gap-5 relative z-20 -mt-4"
                      >
                        <div className="bg-[#0b80c6] p-3 rounded-xl shadow-lg shadow-indigo-200">
                          <Sparkles className="text-white w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-slate-900 font-bold text-sm">
                            Technical_Bid_Final.pdf
                          </h5>
                          <p className="text-[#0b80c6] text-xs font-bold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> 98% Compliance
                            Score
                          </p>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Floating Success Notification */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -bottom-6 -right-4 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 z-30"
                  >
                    <div className="bg-green-500 p-1.5 rounded-full">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="pr-4">
                      <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">
                        Status
                      </p>
                      <p className="text-xs font-bold">Ready for Submission</p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Tailwind Config for the animation (Add this to your tailwind.config.js or a <style> tag) */}
        <style>{`
        @keyframes mesh-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-mesh-gradient {
          animation: mesh-gradient 15s ease infinite;
        }
      `}</style>
      </section>
      {/* /FAQ */}
      <section className="pt-2 pb-20 bg-white relative overflow-hidden">
        {/* BACKGROUND DECORATION */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16">
            {/* LEFT CONTENT */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                  <span className="text-[#0b80c6]">FAQ</span>
                </h2>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                  Everything You Need to{" "}
                  <span className="text-[#0b80c6]">Know</span>
                </h2>
                <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                  Have questions about how AI fits into your bidding process?
                  We've gathered answers from MSME manufacturers across India.
                </p>

                {/* STILL HAVE QUESTIONS SECTION */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative"
                >
                  {/* Background Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#0b80c6] blur-[60px] opacity-50" />

                  <div className="relative z-10 text-center md:text-left">
                    <h4 className="text-xl font-bold mb-2">
                      Still Have Questions?
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Our MSME experts are here to help you scale.
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 relative z-10">
                    <motion.button
                      onClick={() => setActiveForm("demo")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-[#0b80c6] text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                    >
                      <MessageSquare className="w-4 h-4" /> Book a Demo
                    </motion.button>
                    <motion.button
                      onClick={() => setActiveForm("contact")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-white/10 text-white border border-white/20 backdrop-blur-md rounded-xl font-bold flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" /> Contact Team
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT CONTENT: ACCORDION */}
            <div className="lg:col-span-7">
              <div className="space-y-4">
                {faqData.map((item, index) => (
                  <SmartAccordion key={index} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FORM MODAL */}
        <AnimatePresence>
          {activeForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeForm}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl"
              >
                <button
                  onClick={closeForm}
                  className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>

                {!submitted ? (
                  <>
                    <h3 className="text-2xl font-bold text-slate-900 mb-8">
                      {activeForm === "demo"
                        ? "Schedule a Demo"
                        : "Contact Our Team"}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0b80c6]"
                        placeholder="Full Name"
                        onChange={(e: any) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                      <input
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0b80c6]"
                        placeholder="Work Email"
                        type="email"
                      />
                      <input
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0b80c6]"
                        placeholder="Mobile Number"
                        type="tel"
                      />
                      <input
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0b80c6]"
                        placeholder="Business Name"
                      />
                      <button className="w-full py-4 bg-[#0b80c6] text-white rounded-xl font-bold flex items-center justify-center gap-2">
                        <Send size={18} />{" "}
                        {activeForm === "demo"
                          ? "Confirm Demo"
                          : "Send Message"}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={44} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      Success!
                    </h3>
                    <p className="text-slate-600">
                      {activeForm === "demo"
                        ? "Thank you for booking a demo. Our representative will contact you soon."
                        : "Your message was received. Our representative will reach you soon."}
                    </p>
                    <button
                      onClick={closeForm}
                      className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold"
                    >
                      Close
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* FINAL CTA */}
      <section className="py-10 lg:py-12 bg-[#1b1464] relative overflow-hidden">
        {/* 1. PREMIUM BACKGROUND: ANIMATED MESH & LIGHT BEAMS */}
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[#0b80c6]/30 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              delay: 2,
            }}
            className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#0b80c6]/20 rounded-full blur-[100px]"
          />
        </div>

        {/* 2. SUBTLE UPWARD DOCUMENT FLOW (REPRESENTING GROWTH) */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: -500, opacity: [0, 1, 0] }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear",
              }}
              className="absolute"
              style={{ left: `${15 * i}%` }}
            >
              <div className="w-12 h-16 bg-white rounded-md border border-white/20" />
            </motion.div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-8 text-center">
          {/* 3. EARLY ACCESS BADGE */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/30 mb-4"
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em]">
              Early Access Batch — 6 Months Free
            </span>
          </motion.div>

          {/* 4. HEADLINE WITH EMOTIONAL FRAMING */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3 leading-[1.1] tracking-tight">
              You can keep chasing tenders manually... <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-[#0b80c6]">
                or start winning them systematically.
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto y-2 leading-relaxed">
              Join the elite MSME manufacturers who are using AI to out-bid,
              out-prepare, and out-scale their competition.
            </p>
          </motion.div>

          {/* 5. MINI BENEFITS BULLETS */}
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {[
              { icon: <Zap className="w-4 h-4" />, text: "Apply 3x faster" },
              {
                icon: <ShieldCheck className="w-4 h-4" />,
                text: "Zero compliance errors",
              },
              { icon: <Lock className="w-4 h-4" />, text: "Cancel anytime" },
            ].map((benefit, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-indigo-200/80 text-sm font-medium"
              >
                <span className="p-1 bg-indigo-500/20 rounded-full">
                  {benefit.icon}
                </span>
                {benefit.text}
              </div>
            ))}
          </div>

          {/* 6. IRRESISTIBLE CTA BUTTON */}
          <div className="relative inline-block group">
            {/* Button Outer Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#0b80c6] to-[#0b80c6] rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-12 py-6 bg-white text-indigo-900 rounded-2xl font-black text-2xl flex items-center gap-4 overflow-hidden"
            >
              {/* Shimmer Effect */}
              <motion.div
                onClick={() => navigate("/signup")}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-100/50 to-transparent skew-x-[-20deg]"
              />
              Claim Your 6 Months Free
              <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
            </motion.button>
          </div>

          {/* 7. TRUST BUILDER MICRO-COPY */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-slate-500 text-sm font-medium flex items-center gap-4">
              <span>No credit card required</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full" />
              <span>100% Secure & Compliant</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full" />
              <span>MSME-First Support</span>
            </p>

            {/* Social Proof Line */}
            <div className="pt-8 border-t border-white/5 w-full max-w-md">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                Trusted by MSME Manufacturers across India
              </p>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes mesh-gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-mesh {
            background-size: 200% 200%;
            animation: mesh-gradient 10s ease infinite;
          }
        `}</style>
      </section>

      {/* FOOTER - Retained from current version */}
      <footer className="bg-slate-50 text-slate-700 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="/assets/logo.jpg"
                  alt="Logo"
                  className="h-12 w-auto max-w-[220px] object-contain bg-white"
                />
              </div>
              <p className="text-sm text-slate-600">
                Empowering businesses with smart opportunities and capital.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Links</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>
                  <a
                    href="https://in.linkedin.com/company/qistonpe"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-semibold text-slate-900 mb-4">Contact</h4>
              <p className="text-sm text-slate-700 mb-3">
                Write to info@qistonpe.com
              </p>
              <p className="text-sm text-slate-500">
                Copyright © 2026 Ambition10T Innovations Private Limited
                <br />
                All rights reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
