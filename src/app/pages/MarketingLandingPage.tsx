import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/useLogout";

import {
  CheckCircle2,
  ChevronDown,
  ShieldCheck, ClipboardCheck, Factory, ShieldEllipsis,
  Zap, Plus,
  Minus, Users, LayoutDashboard, Globe,
  Mail,
  MessageSquare, ArrowUpRight, Target,
  CheckCircle,
  Gift,
  Search,
  FileText,
  BarChart3,
  ArrowRight,
  Lock,
  Building2, Check, Clock, AlertTriangle, FileWarning, BarChart, Star,
  Menu,
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
} from 'lucide-react';

// --- Animation Variants ---
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

const manualPains = [
  "Monitoring multiple tender portals manually",
  "Missing relevant bids due to manual tracking",
  "Spending days on compliance-heavy docs",
  "Facing rejections due to minor errors",
  "Limited manpower to scale bidding"
];

const aiGains = [
  "Unified dashboard for 90+ PSU portals",
  "Instant AI alerts for matching bids",
  "Bid docs generated in < 15 minutes",
  "99% Accuracy on compliance checks",
  "Scale bidding without adding headcount"
];
const faqData = [
  {
    category: "AI Technology",
    icon: <Sparkles className="w-4 h-4" />,
    question: "What is AI tender automation software?",
    answer: "AI tender automation software helps MSME manufacturers automatically discover relevant PSU tenders, evaluate eligibility, and generate bid-ready documentation using artificial intelligence."
  },
  {
    category: "Compliance",
    icon: <FileSearch className="w-4 h-4" />,
    question: "How can MSMEs reduce technical rejection?",
    answer: "By using automated compliance checks and AI-driven document preparation, MSMEs can eliminate common errors that cause technical disqualification."
  },
  {
    category: "Government",
    icon: <Building className="w-4 h-4" />,
    question: "Is this suitable for government bidding in India?",
    answer: "Yes. The platform is specifically designed for Indian PSU OEM procurement processes across power, railways, heavy engineering, and defense sectors."
  },
  {
    category: "Security",
    icon: <ShieldCheck className="w-4 h-4" />,
    question: "Is my tender documentation data secure?",
    answer: "Yes. The platform operates under Indian data and privacy regulations and does not publicly share proprietary company information."
  }
];


const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
};
const steps = [
  {
    step: "01",
    title: "Create your company profile once",
    desc: "Input your core manufacturing capabilities, certifications, and past performance data.",
    icon: <UserPlus className="w-6 h-6" />,
    color: "bg-[#0b80c6]"
  },
  {
    step: "02",
    title: "AI curates relevant tenders automatically",
    desc: "Our engine scans 90+ PSU portals and matches your profile to high-probability bids.",
    icon: <Cpu className="w-6 h-6" />,
    color: "bg-indigo-500"
  },
  {
    step: "03",
    title: "Check eligibility & risks instantly",
    desc: "AI flags technical disqualification risks and compliance gaps before you spend a rupee.",
    icon: <SearchCheck className="w-6 h-6" />,
    color: "bg-violet-500"
  },
  {
    step: "04",
    title: "Generate bid-ready documentation",
    desc: "Download structured, error-free technical and compliance docs in minutes.",
    icon: <FileDown className="w-6 h-6" />,
    color: "bg-purple-600"
  }
]; const benefits = [
  // Positions tuned: Far enough to clear the 8xl text, 
  // close enough to keep the section cohesive.
  {
    title: "3–5x More Tenders",
    text: "Scale your reach without increasing headcount.",
    pos: "top-[10%] left-[10%] md:left-[12%]"
  },
  {
    title: "Zero Rejections",
    text: "Eliminate technical errors before submission.",
    pos: "top-[13%] right-[10%] md:right-[12%]"
  },
  {
    title: "Instant Compliance",
    text: "Automatic checks for eligibility and risks.",
    pos: "bottom-[18%] left-[10%] md:left-[9%]"
  },
  {
    title: "Team Freedom",
    text: "Shift focus from paperwork to production.",
    pos: "bottom-[15%] right-[20%] md:right-[9%]"
  },
  {
    title: "Scale Confidently",
    text: "Compete with industry giants on even ground.",
    pos: "top-[38%] right-[4%] md:right-[6%]"
  },
  {
    title: "Smart Automation",
    text: "Reduce manual effort by over 85%.",
    pos: "top-[35%] left-[4%] md:left-[6%]"
  },
];
const securityPoints = [
  { text: "Hosted under Indian compliance standards", icon: <Database className="w-5 h-5" /> },
  { text: "Governed by Indian data protection laws", icon: <GlobeLock className="w-5 h-5" /> },
  { text: "No public sharing of proprietary data", icon: <ShieldAlert className="w-5 h-5" /> },
  { text: "Secure VPC access architecture", icon: <Lock className="w-5 h-5" /> },

];
// --- Components ---
const SmartAccordion = ({ item, index }: { item: any, index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`group mb-4 rounded-2xl border transition-all duration-300 ${isOpen
        ? 'border-indigo-500 bg-indigo-50/30 shadow-lg shadow-indigo-100/50'
        : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
        }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex items-start justify-between gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${isOpen ? 'bg-[#0b80c6] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-[#0b80c6]'
              }`}>
              {item.icon} {item.category}
            </span>
          </div>
          <h4 className={`text-lg font-bold transition-colors ${isOpen ? 'text-indigo-900' : 'text-slate-800'}`}>
            {item.question}
          </h4>
        </div>
        <div className={`mt-1 shrink-0 p-1 rounded-full border transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#0b80c6] border-[#0b80c6] text-white' : 'border-slate-300 text-slate-400'
          }`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
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
              <p className="text-slate-600 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


const Accordion = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-4">
      <button
        className="w-full flex justify-between items-center text-left py-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-slate-800">{question}</span>
        <ChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : ''} text-[#0b80c6]`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-slate-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function MarketingLandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const handleLogout = useLogout();

  return (
    <div className="min-h-screen bg-slate-50 pb-2 font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation Bar - Retained from current version for functionality */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/assets/logo.jpg" alt="Logo" className="h-14 w-auto max-w-[220px] object-contain bg-white" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Home</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">About</a>
            <div className="relative group">
              <button className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1 focus:outline-none">
                Products
                <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity z-50">
                <a href="/" onClick={e => { e.preventDefault(); navigate("/"); }} className="block px-5 py-3 text-sm rounded-lg font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">OpportunityX</a>
                <a href="/metalcapital" onClick={e => { e.preventDefault(); navigate("/metalcapital"); }} className="block px-5 py-3 text-sm rounded-lg font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">MetalCapital</a>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button onClick={() => navigate("/dashboard")} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors hidden sm:block">
                  {user?.fullName?.split(' ')[0] ?? 'Dashboard'}
                </button>
                <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-600 border border-red-200 px-4 py-2 rounded-lg transition-all hover:bg-red-50 hidden sm:block">
                  Log out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/login")} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">Log in</button>
                <button onClick={() => navigate("/signup")} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5">Start Now</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-5 pb-5 lg:pt-8 lg:pb-2 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeIn}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-3">
              AI Tender Automation Software for <span className="text-[#0b80c6]">MSME Manufacturers</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-5 leading-relaxed">
              Discover relevant PSU tenders, check eligibility instantly, and generate bid-ready compliant documentation in minutes — built specifically for Indian MSMEs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-[#0b80c6] text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-200">
                Start Free for 6 Months
              </button>
              <a
                href="#how-it-works"
                className="px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
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
                "Automated Bid Documentation (Save upto 90% time)"
              ].map((point, i) => (
                <motion.div key={i} variants={fadeIn} className="flex items-start gap-3 bg-white/50 backdrop-blur p-4 rounded-xl border border-[#0b80c6]">
                  <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{point}</span>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-6 py-2 ">
              <p className="text-sm font-bold uppercase tracking-widest text-[#0b80c6] mb-2">Trusted Compliance</p>
              <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale">
                <span className="font-bold text-xl">Built for Indian MSMEs</span>
                <span className="font-bold text-xl">|</span>
                <span className="font-bold text-xl">Governed by Indian Data Laws</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section id="problem" className="py-12 lg:py-16 bg-white relative overflow-hidden min-h-[90vh] flex flex-col justify-center">
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
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
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
              <span className="text-red-600">You’re Losing Them to Your Process.</span>
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
                    <h3 className="text-lg font-black text-slate-900">Manual Chaos</h3>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">Growth Bottleneck</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {manualPains.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center group">
                      <div className="shrink-0 bg-white border border-red-100 p-1 rounded-md text-red-500">
                        <X className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <p className="text-slate-700 font-bold text-sm italic">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/50 rounded-xl border border-red-100 border-dashed">
                <p className="text-red-500 font-black text-[9px] uppercase tracking-widest mb-0.5">Efficiency Leak</p>
                <p className="text-slate-900 font-black text-xl">5+ Hours</p>
                <p className="text-slate-500 font-bold text-[10px]">Wasted per single tender</p>
              </div>
            </motion.div>

            {/* RIGHT PANEL: THE GAIN */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-[#0b80c6] p-6 md:p-8 lg:p-10 text-white relative flex flex-col justify-between"      >
              <div className="absolute inset-0 opacity-[0.05]"
                style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/20 p-1.5 rounded-lg border border-white/30 text-white">
                    <BarChart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">OpportunityX</h3>
                    <p className="text-indigo-200 font-medium text-[10px] tracking-tight">AI Dominance</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {aiGains.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="shrink-0 bg-green-400 p-1 rounded-md text-indigo-900">
                        <Check className="w-3 h-3" strokeWidth={4} />
                      </div>
                      <p className="text-white font-bold text-sm italic">{item}</p>
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
                        stiffness: 100
                      }}
                      className="absolute inset-0 bg-[#0b80c6]  flex flex-col items-center justify-center border-t border-indigo-400/30 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.9, type: "spring" }}
                        className="bg-green-400 p-1.5 rounded-full mb-1"
                      >
                        <Check className="w-5 h-5 text-indigo-900" strokeWidth={4} />
                      </motion.div>
                      <p className="font-black text-lg tracking-tight text-white">BID APPROVED</p>
                      <p className="text-indigo-200 font-bold text-[9px]">Qualified in 4 Minutes</p>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Every Missed Tender Is <span className="text-red-600">Lost Revenue.</span></h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Efficiency Gap", desc: "Competitors apply to more tenders using automation" },
                { title: "Wasted Effort", desc: "Technical disqualifications waste weeks of manual work" },
                { title: "Risk Exposure", desc: "Compliance gaps go unnoticed until it's too late" },
                { title: "Resource Drain", desc: "Team spends more time on paper than production" }
              ].map((card, i) => (
                <div key={i} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors">
                  <div className="text-indigo-400 mb-4 font-bold text-xl">0{i + 1}.</div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section id="solution" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter leading-[1.1]">
            Introducing an AI-Powered PSU <br className="hidden md:block" />
            <span className="text-[#0b80c6]">Tender Management & Bid Automation</span>
          </h2>
          <p className="text-slate-600 text-lg">An AI integrated platform designed specifically for MSME manufacturers supplying to PSU OEMs in India.</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
          <motion.div whileHover={{ y: -10 }} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 transition-all hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500 hover:shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-center">AI Powered Tender Discovery Across 90+ PSUs & OEMs</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">Automatically scans and curates relevant tenders from multiple PSU portals.</p>
            <ul className="space-y-3">
              {["No more switching portals.", "No more missed opportunities.", "No manual tracking spreadsheets."].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-700 font-medium"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> {item}</li>
              ))}
            </ul>
          </motion.div>
          <motion.div whileHover={{ y: -10 }} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 transition-all hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500 hover:shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-center">Eligibility & Risk Checks in Minutes</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">Our AI Based Tender Platform Instantly analyzes:</p>
            <ul className="space-y-3">
              {["Technical Disqualification Criteria", "Compliance Requirements", "Documentations Gaps", "Risk Factors"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-700 font-medium"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> {item}</li>
              ))}
            </ul>
          </motion.div>
          <motion.div whileHover={{ y: -10 }} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 transition-all hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500 hover:shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-center">Automated Bid-Ready Documentation</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">Upload basic company data once. The platform generates:</p>
            <ul className="space-y-3">
              {["Structured technical documentation", "Compliance-aligned bid formats", "Error minimized documentation", "Organized submission-ready files"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-700 font-medium"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> {item}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="relative w-full min-h-screen lg:h-screen bg-white flex flex-col lg:items-center lg:justify-center overflow-hidden py-20 lg:py-0">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-[#5842f4]/5 rounded-full blur-[80px] lg:blur-[120px]" />
        </div>
        <motion.div initial={{ scale: 1.1, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="inline-block px-4 py-1.5 mb-6 text-[10px] lg:text-[11px] font-bold tracking-[0.2em] text-[#5842f4] uppercase bg-[#5842f4]/10 rounded-full">The Growth Multiplier</motion.span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6 lg:mb-8">Apply to More. <br /><span className="text-[#0b80c6]">Win More.</span></h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-lg lg:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto">The only AI-driven tender platform built specifically for Indian MSME Manufacturers.</motion.p>
        </motion.div>
        <div className="lg:hidden mt-12 px-6 w-full z-20 grid grid-cols-1 gap-4">
          {benefits.map((item, i) => (
            <motion.div key={`mobile-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]">
              <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 font-medium">{item.text}</p>
            </motion.div>
          ))}
        </div>
        {benefits.map((item, i) => (
          <motion.div key={`desktop-${i}`} className={`absolute z-20 hidden lg:block ${item.pos}`} initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.2 + (i * 0.1), duration: 0.7, type: "spring", stiffness: 70 }}>
            <motion.div animate={{ y: [0, -15, 0], rotate: [0, i % 2 === 0 ? 0.5 : -0.5, 0] }} transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }} className="w-72 p-7 rounded-[2rem] bg-white/95 backdrop-blur-md border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:shadow-[#5842f4]/15 hover:scale-105 transition-all duration-500 relative overflow-hidden group cursor-default">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#5842f4]/20" /><div className="absolute top-0 left-0 right-0 h-[3px] bg-[#5842f4] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight tracking-tight">{item.title}</h3>
              <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{item.text}</p>
            </motion.div>
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_white_85%)] pointer-events-none" />
      </section>

      {/* INDIAN MSMEs SECTION */}
      <section className="py-20 bg-[#1b1464] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0b80c6]/10 blur-[120px] rounded-full -ml-64 -mb-64" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4">India-First Platform</h2>
                <h3 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">Built Specially for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Indian MSMEs</span></h3>
                <p className="text-slate-400 text-lg mb-10 max-w-xl">Unlike generic global portals, we’ve engineered this specifically for the nuances of Indian PSU procurement and MSME compliance.</p>
                <div className="space-y-6">
                  {[
                    { title: "Designed for Indian PSU procurement processes", icon: <Globe className="text-indigo-400" size={24} /> },
                    { title: "Structured around real compliance required", icon: <LayoutDashboard className="text-indigo-400" size={24} /> },
                    { title: "Simplified interface (no enterprise complexity)", icon: <CheckCircle className="text-indigo-400" size={24} /> }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                      <div className="shrink-0">{item.icon}</div>
                      <div><h4 className="font-bold text-white mb-1">{item.title}</h4></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            <div className="flex-1 w-full">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-[2.5rem] p-8 md:p-6 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><ShieldCheck size={120} strokeWidth={1} /></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30"><Lock className="text-indigo-400" /></div>
                    <h4 className="text-2xl font-bold text-white mb-4">Foundational Security</h4>
                    <p className="text-slate-400 leading-relaxed mb-8">Your proprietary bid data and trade secrets are <span className="text-white font-semibold">never made public.</span> We treat data privacy as a non-negotiable legal commitment.</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-700/50"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span className="text-sm font-medium text-slate-300 italic">Aligned with Indian Data Protection Laws</span></div>
                      <div className="flex items-center gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-700/50"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-sm font-medium text-slate-300 italic">Encrypted Technical Documentation</span></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">How it Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">We've automated the complex PSU procurement lifecycle so you can focus on manufacturing excellence.</p>
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="hidden lg:block absolute top-24 left-0 w-full h-1 bg-slate-200">
            <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} viewport={{ once: true }} className="h-full bg-gradient-to-r from-[#0b80c6] via-indigo-500 to-purple-600 origin-left" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
            {steps.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 40, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.25, ease: "backOut" }} whileHover={{ y: -8 }} className="group relative">
                <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col items-center text-center transition-all group-hover:shadow-indigo-100 group-hover:border-indigo-200">
                  <div className={`relative w-20 h-20 mb-8 flex items-center justify-center rounded-2xl ${item.color} text-white shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-300`}>
                    <span className="absolute -top-4 -right-4 bg-slate-900 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">{item.step}</span>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-[#0b80c6] transition-colors">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER SECTION */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-slate-50 border border-slate-200 rounded-[3rem] overflow-hidden grid lg:grid-cols-2 relative shadow-2xl shadow-slate-200/50">
            <div className="p-8 md:p-16 relative z-10 bg-white/50 backdrop-blur-sm">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-tight">Empowering MSMEs to <br /> <span className="text-[#0b80c6] font-black">Scale without Limits.</span></h2>
              <div className="space-y-6 mb-10">
                {[
                  { t: "No upfront cost", d: "6 months free for early access manufacturers." },
                  { t: "No commitment", d: "Cancel anytime if it doesn't fit your workflow." },
                  { t: "R̶s̶.̶ ̶1̶8̶0̶0̶0 Rs. 0", d: "Limited time offer for PSU suppliers." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="bg-green-100 p-1 rounded-full mt-1"><CheckCircle className="text-green-600 w-5 h-5" /></div>
                    <div><h4 className="font-bold text-slate-900 leading-none mb-1">{item.t}</h4><p className="text-slate-500 text-sm">{item.d}</p></div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/signup")}
                className="group w-full sm:w-auto px-10 py-5 bg-[#0b80c6] text-white rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3">
                Claim 6 Months Free Access <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative flex items-center justify-center p-12 overflow-hidden bg-[#1b1464]">
              {/* ANIMATED MESH GRADIENT BACKDROP */}
              <div className="absolute inset-0 mesh-gradient opacity-60"></div>

              <div className="relative z-10 w-full max-w-sm">
                <motion.div
                  initial={{ rotateY: 15, rotateX: -5 }}
                  animate={{ rotateY: 0, rotateX: 0 }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                  className="relative bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden text-white"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-20"><Zap size={100} strokeWidth={1} /></div>
                  <h4 className="text-xl font-bold mb-4">AI Bid Generation</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <FileCheck className="text-green-400" />
                      <div><p className="text-xs font-bold opacity-60 uppercase">Technical Bid</p><p className="font-bold">Technical_Bid_Final.pdf</p></div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl border border-white/20">
                      <Sparkles className="text-indigo-400" />
                      <div><p className="text-xs font-bold opacity-60 uppercase">Compliance Health</p><p className="font-bold text-green-400">98% Compliance Score</p></div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                    <div><p className="text-[10px] font-bold opacity-50 uppercase mb-1">Time Saved</p><p className="text-2xl font-black">~4.5 Hours</p></div>
                    <TrendingUp className="text-green-400 w-8 h-8" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Everything You Need to <span className="text-[#0b80c6]">Know</span></h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Have questions about how AI fits into your bidding process? We've gathered answers from MSME manufacturers across India.</p>
        </div>
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
            {faqData.map((item, index) => (
              <SmartAccordion key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 lg:py-32 bg-[#1b1464] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to Win more PSU Business?</h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">Stop manually chasing tenders. Start scaling systematically with AI built for Indian manufacturing.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/signup")}
                className="px-12 py-6 bg-white text-[#1b1464] rounded-2xl font-black text-2xl hover:scale-105 transition-all shadow-2xl">
                Claim Your 6 Months Free
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .mesh-gradient {
          background-color: #1b1464;
          background-image: 
            radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
            radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
            radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%), 
            radial-gradient(at 0% 50%, hsla(225,39%,30%,1) 0, transparent 50%), 
            radial-gradient(at 50% 50%, hsla(253,16%,7%,1) 0, transparent 50%), 
            radial-gradient(at 100% 50%, hsla(225,39%,30%,1) 0, transparent 50%), 
            radial-gradient(at 0% 100%, hsla(339,49%,30%,1) 0, transparent 50%), 
            radial-gradient(at 50% 100%, hsla(225,39%,30%,1) 0, transparent 50%), 
            radial-gradient(at 100% 100%, hsla(253,16%,7%,1) 0, transparent 50%);
          background-size: 200% 200%;
          animation: mesh 15s ease infinite;
        }

        @keyframes mesh {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>

      {/* FOOTER - Retained from current version */}
      <footer className="bg-slate-50 text-slate-700 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/assets/logo.jpg" alt="Logo" className="h-12 w-auto max-w-[220px] object-contain bg-white" />
              </div>
              <p className="text-sm text-slate-600">Empowering businesses with smart opportunities and capital.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Links</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><a href="https://in.linkedin.com/company/qistonpe" target="_blank" rel="noreferrer noopener" className="hover:text-indigo-600 transition-colors">LinkedIn</a></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-semibold text-slate-900 mb-4">Contact</h4>
              <p className="text-sm text-slate-700 mb-3">Write to info@qistonpe.com</p>
              <p className="text-sm text-slate-500">Copyright © 2026 Ambition10T Innovations Private Limited<br />All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
