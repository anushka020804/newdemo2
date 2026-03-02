import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Building2, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Users, Phone, MessageCircle, TrendingUp, Target, Award, ClipboardCheck, Lock, Layout, UserPlus, Brain, SearchCheck, FileCheck } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/useLogout";

export function MarketingLandingPage() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", number: "" });
  const { isAuthenticated, user } = useAuth();
  const handleLogout = useLogout();

  const scrollToCenter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 80; // matches navbar height (h-20)
      const rect = el.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const top = rect.top + scrollTop - navHeight - 12; // 12px extra spacing
      window.scrollTo({ top, behavior: "smooth" });
      try { history.replaceState(null, "", `#${id}`); } catch (e) { /* ignore */ }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toggle Button for OpportunityX / MetalCapital */}
      <div className="w-full flex justify-center bg-slate-50" style={{ paddingTop: 96, paddingBottom: 0 }}>
        <div className="flex rounded-full overflow-hidden border border-blue-300 shadow-lg min-w-[320px]">
          <button
            onClick={() => navigate("/")}
            className={`px-8 py-3 text-lg font-semibold transition-all focus:outline-none border-r border-blue-300 ${window.location.pathname === "/" ? "bg-blue-600 text-white" : window.location.pathname.startsWith("/metalcapital") ? "bg-white text-blue-700" : "bg-white text-blue-700 hover:bg-blue-50"}`}
            aria-pressed={window.location.pathname === "/"}
          >
            OpportunityX
          </button>
          <button
            onClick={() => navigate("/metalcapital")}
            className={`px-8 py-3 text-lg font-semibold transition-all focus:outline-none border-l border-blue-300 ${window.location.pathname.startsWith("/metalcapital") ? "bg-blue-600 text-white" : "bg-white text-blue-700 hover:bg-blue-50"}`}
            aria-pressed={window.location.pathname.startsWith("/metalcapital")}
          >
            MetalCapital
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/assets/logo.jpg" alt="Qistonpe Logo" className="h-14 w-auto max-w-[220px] object-contain bg-white" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); try { history.replaceState(null, '', '#') } catch (e) { } }} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Home</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">About</a>
            {/* Solution link permanently removed from all routes as requested */}
            <div className="relative group">
              <button className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1 focus:outline-none">
                Products
                <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity z-50">
                <a
                  href="/"
                  onClick={e => { e.preventDefault(); navigate("/"); }}
                  className={`block px-5 py-3 text-sm rounded-lg font-semibold transition-colors ${window.location.pathname === "/" ? "bg-blue-700 text-white" : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"}`}
                  aria-current={window.location.pathname === "/" ? "page" : undefined}
                >
                  OpportunityX
                </a>
                <a
                  href="/metalcapital"
                  onClick={e => { e.preventDefault(); navigate("/metalcapital"); }}
                  className={`block px-5 py-3 text-sm rounded-lg font-semibold transition-colors ${window.location.pathname.startsWith("/metalcapital") ? "bg-blue-700 text-white" : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"}`}
                  aria-current={window.location.pathname.startsWith("/metalcapital") ? "page" : undefined}
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
                  {user?.fullName?.split(' ')[0] ?? 'Dashboard'}
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
                <button onClick={() => navigate("/login")} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
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

      {/* Hero Section (updated) */}
      <section className="relative pt-10 pb-8 lg:pt-14 lg:pb-10 overflow-hidden animate-fadein">
        {/* Soft background shapes */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white">
          <div className="absolute -left-32 -top-20 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute right-0 top-10 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <motion.div className="flex flex-col items-center text-center" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              INDIA'S 1ST AI TENDER AUTOMATOR
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight max-w-4xl mx-auto">
              AI Tender Automation Software for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block sm:inline">MSME Manufacturers</span> Supplying to PSU OEMs in India
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover relevant PSU tenders, check eligibility instantly, and generate bid-ready compliant documentation in minutes — using AI built specifically for Indian MSMEs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 w-full sm:w-auto">
              <button onClick={() => navigate('/signup')} aria-label="Start Free for 6 Months" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-transform text-lg">
                Start Free for 6 Months
              </button>

              <button
                onClick={() => scrollToCenter('how-it-works')}
                aria-label="How it works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-slate-200 rounded-xl bg-white text-slate-700 font-semibold shadow-sm hover:bg-slate-50 transition-colors text-lg"
              >
                How it Works
              </button>
            </div>

            {/* Feature Pills under buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 text-sm font-medium text-slate-700">
              <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-left">Curated tenders across 90+<br />PSU OEMs automatically</span>
              </div>
              <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-left">AI eligibility & risks in<br />minutes</span>
              </div>
              <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-left">Automated bid<br />documentation (save 95% preparation time)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted Compliance Separator */}
      <div className="w-full flex justify-center py-4 mb-4 px-6">
        <div className="bg-blue-600 text-white rounded-2xl shadow-lg border border-blue-500 py-6 px-8 md:px-12 w-full max-w-4xl">
          <div className="text-xs font-bold tracking-widest text-blue-200 uppercase mb-3 text-center">Trusted Compliance</div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 font-medium text-sm sm:text-base">
            <span>Built for Indian MSMEs</span>
            <span className="hidden sm:inline text-blue-300">|</span>
            <span>Governed by Indian Data & Privacy Laws</span>
          </div>
        </div>
      </div>


      {/* Problem Section: text on right, image placeholder on left */}
      {/* Problem Section */}
      <section id="problem-manual" className="py-12 bg-white animate-fadein">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 text-center">
            <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-3 max-w-4xl mx-auto">
              You're Not Losing Tenders to Competitors — <br className="hidden md:block" />
              <span className="text-red-500">You're Losing Them to Your Process.</span>
            </h3>
            <p className="text-slate-600 text-lg">Most MSME manufacturers supplying to PSU OEMs face the same challenges:</p>
          </div>

          <div className="relative grid md:grid-cols-2 gap-6 items-stretch max-w-5xl mx-auto">
            {/* Left: Problem */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
              <ul className="space-y-3 relative z-10">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-500 font-bold">×</span>
                  <span className="text-slate-700">Monitoring multiple tender portals manually</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-500 font-bold">×</span>
                  <span className="text-slate-700">Missing relevant bids due to manual tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-500 font-bold">×</span>
                  <span className="text-slate-700">Spending days preparing compliance heavy bid documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-500 font-bold">×</span>
                  <span className="text-slate-700">Facing technical rejections in PSU tenders due to minor errors</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-500 font-bold">×</span>
                  <span className="text-slate-700">Limited manpower to scale bidding efforts</span>
                </li>
              </ul>

              <div className="mt-6 pt-4 border-t border-slate-200 relative z-10">
                <p className="font-semibold text-slate-900">The opportunity exists.<br />But manual processes are slowing growth.</p>
                <p className="mt-1 text-slate-700 text-sm">Without a structured PSU tender management system, scaling becomes impossible.</p>
              </div>
            </motion.div>

            {/* Right: Agitate */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-red-50/30 rounded-3xl p-6 md:p-8 border border-red-100 shadow-sm relative overflow-hidden flex flex-col justify-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <h4 className="text-2xl font-bold text-slate-900 mb-4 line-clamp-2 leading-tight">Every Missed Tender <br /> Is <span className="text-red-500">Lost Revenue.</span></h4>
              <p className="text-slate-700 mb-3 font-medium">When tender discovery and bidding remain manual:</p>
              <ul className="space-y-3 relative z-10">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-400">-</span>
                  <span className="text-slate-700">Competitors apply to more tenders using automation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-400">-</span>
                  <span className="text-slate-700">Technical disqualifications waste weeks of effort</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-400">-</span>
                  <span className="text-slate-700">Compliance gaps go unnoticed until submission</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-400">-</span>
                  <span className="text-slate-700">Your team spends more time preparing bids than producing goods</span>
                </li>
              </ul>
            </motion.div>

          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 text-center max-w-3xl mx-auto px-6 pb-4"
          >
            <p className="text-lg md:text-xl text-slate-700 font-medium mb-1">In the PSU ecosystem, precision and speed determine who wins contracts.</p>
            <p className="text-lg md:text-xl text-slate-700 font-medium mb-4">Manual bidding does not scale for MSMEs.</p>
            <p className="text-2xl md:text-3xl text-indigo-600 font-extrabold tracking-tight">Automation does.</p>
          </motion.div>
        </div>
      </section>


      {/* Solution Section */}
      <section id="solution-cards" className="pt-24 pb-40 bg-slate-900 animate-fadein relative overflow-hidden">
        {/* Dark background for contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Introducing an AI-Powered PSU Tender Management & Bid Automation Platform
          </h2>
          <p className="text-indigo-200 text-lg mb-16 max-w-2xl mx-auto leading-relaxed">
            An AI-embedded platform designed specifically for MSME manufacturers supplying to PSU OEMs in India.
          </p>

          {/* Video Container Centered */}
          <div className="max-w-5xl mx-auto mb-20 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-700/50 relative">
            <video
              className="w-full h-auto object-cover bg-slate-800 block"
              autoPlay
              loop
              muted
              playsInline
              poster="/assets/logo.jpg"
            >
              <source src="/assets/vid.mp4" type="video/mp4" />
              <img src="/assets/logo.jpg" alt="Platform dashboard preview" className="w-full h-full object-contain" />
            </video>
          </div>

          <h3 className="text-3xl md:text-4xl font-bold text-white mt-8 mb-10 text-center">
            It does three critical things:
          </h3>

          {/* 3-Card Grid */}
          <div className="grid lg:grid-cols-3 gap-8 text-left">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Powered Tender Discovery Across 90+ PSU OEMs</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Automatically scans and curates relevant tenders from multiple PSU portals.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <span className="text-indigo-500 font-bold">-</span> No more switching portals.
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <span className="text-indigo-500 font-bold">-</span> No more missed opportunities.
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <span className="text-indigo-500 font-bold">-</span> No manual tracking spreadsheets.
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-sm font-semibold text-indigo-600">This is intelligent government tender discovery built for MSMEs.</p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Eligibility & Risk Checks in Minutes</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Our AI Engine Instantly analyzes:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <span className="text-indigo-500 font-bold">-</span> Technical disqualification criteria
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <span className="text-indigo-500 font-bold">-</span> Compliance Requirements
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <span className="text-indigo-500 font-bold">-</span> Documentation gaps
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <span className="text-indigo-500 font-bold">-</span> Risk Factors
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-600 mb-1">Before you invest time preparing the bid.</p>
                <p className="text-sm font-semibold text-indigo-600">Apply only where you have a real chance to win.</p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Automated Bid-Ready Documentation</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Upload basic company data once. The platform generates:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <span className="text-indigo-500 font-bold">-</span> Structured technical documentation
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <span className="text-indigo-500 font-bold">-</span> Compliance-aligned bid formats
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <span className="text-indigo-500 font-bold">-</span> Organized submission-ready files
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <span className="text-indigo-500 font-bold">-</span> Error minimized documentation
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-sm font-semibold text-slate-900 mb-1">Reduce bid preparation time by up to 95%</p>
                <p className="text-sm font-semibold text-indigo-600">This is automated government tender documentation software built for speed and accuracy.</p>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Bottom gradient to eliminate white gap (not blending to indigo) */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-slate-900 pointer-events-none" />
      </section>

      {/* Benefits Section */}
      <section className="min-h-screen flex flex-col justify-center bg-indigo-50 animate-fadein relative overflow-hidden pt-6 pb-2">
        <div className="max-w-6xl mx-auto px-6 text-center w-full">
          <div className="mb-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">
              Apply to More. <span className="text-indigo-600">Win More.</span>
            </h2>
            <p className="text-xl text-slate-600 font-medium">With automation:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left mx-auto mb-4 auto-rows-fr">

            {/* Main Highlight Card - Spans 2 cols */}
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }} className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-lg shadow-xl text-white relative overflow-hidden group flex flex-col justify-center min-h-[260px]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-3">
                  <TrendingUp className="w-12 h-12 text-blue-200 shrink-0" />
                  <h3 className="text-3xl sm:text-4xl font-bold drop-shadow-sm leading-tight">Apply to 3–5x more tenders</h3>
                </div>
                <p className="text-blue-100/90 text-lg sm:text-xl max-w-2xl ml-18">Scale your bidding volume exponentially without adding headcount.</p>
              </div>
            </motion.div>

            {/* Compliance Card */}
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-white p-8 rounded-lg shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-center min-h-[260px]">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">Improve compliance accuracy</h3>
              <p className="text-slate-500 text-lg leading-relaxed">Automated checks ensure no documentation is ever missed.</p>
            </motion.div>

            {/* Rejections Card */}
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-white p-8 rounded-lg shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-center min-h-[260px]">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300 shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">Reduce technical rejections</h3>
              <p className="text-slate-500 text-lg leading-relaxed">Pre-bid risk analysis protects your EMD and time.</p>
            </motion.div>

            {/* Team Card */}
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.4 }} className="bg-white p-8 rounded-lg shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-center min-h-[260px]">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">Free your team</h3>
              <p className="text-slate-500 text-lg leading-relaxed">Redirect resources to production & operations.</p>
            </motion.div>

            {/* Compete Card */}
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.5 }} className="bg-slate-900 p-8 rounded-lg shadow-xl text-white relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-center min-h-[260px] lg:col-span-1 md:col-span-2">
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <Award className="w-12 h-12 mb-4 text-indigo-400 shrink-0" />
                <h3 className="text-xl font-bold mb-2 leading-tight">Compete with larger players confidently</h3>
                <p className="text-slate-400 text-lg font-medium">Level the playing field with AI-driven precision.</p>
              </div>
            </motion.div>

          </div>

          <div className="mt-1 pt-1 border-t border-indigo-200/50 inline-block w-full max-w-4xl text-center">
            <p className="text-lg text-slate-800 font-semibold mb-0">This is just not software</p>
            <h4 className="text-xl md:text-2xl text-indigo-600 font-black tracking-tight uppercase italic">
              It's a growth multiplier for MSME Manufacturers.
            </h4>
          </div>
        </div>
        {/* Bottom gradient to blend into white section */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-white pointer-events-none" />
      </section>

      {/* MSME Specific Trust Section */}
      <section className="bg-white pt-2 pb-4 animate-fadein relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Built Specifically for Indian MSMEs</h2>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto font-medium">Unlike generic tender portals, this is a complete MSME tender automation platform built for your reality.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* PSU Procurement */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex gap-6 p-8 bg-blue-50/80 rounded-3xl border border-blue-100 hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Building2 className="w-7 h-7 text-indigo-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">PSU Procurement Optimized</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-lg">Designed specifically for Indian PSU and government procurement processes.</p>
              </div>
            </motion.div>

            {/* Compliance Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex gap-6 p-8 bg-blue-50/80 rounded-3xl border border-blue-100 hover:border-emerald-200 hover:bg-white hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <ClipboardCheck className="w-7 h-7 text-emerald-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Compliance Built-in</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-lg">Structured around the massive documentation and real compliance required for MSMEs.</p>
              </div>
            </motion.div>

            {/* Interface Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex gap-6 p-8 bg-blue-50/80 rounded-3xl border border-blue-100 hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Layout className="w-7 h-7 text-blue-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Simplified Interface</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-lg">No unnecessary enterprise complexity—just the tools you need to bid and win.</p>
              </div>
            </motion.div>

            {/* Data Sovereignty Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex gap-6 p-8 bg-blue-50/80 rounded-3xl border border-blue-100 hover:border-orange-200 hover:bg-white hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                <ShieldCheck className="w-7 h-7 text-orange-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Data Sovereignty</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-lg">Secured and strictly aligned with Indian data protection regulations.</p>
              </div>
            </motion.div>

            {/* High-Contrast Privacy Spotlight */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="md:col-span-2 mt-4 bg-slate-900 rounded-[1.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl group max-w-4xl mx-auto w-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-[60px] -ml-16 -mb-16"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-indigo-600 shadow-2xl shadow-indigo-500/50 rounded-2xl flex items-center justify-center shrink-0">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Your Data is Proprietary & Private</h3>
                  <p className="text-slate-300 text-base md:text-lg font-medium mb-4 leading-normal">
                    Unlike public portals, your preparatory bid data is <span className="text-white font-bold">never</span> made public. Security and compliance are not features—they are foundational.
                  </p>
                  <div className="inline-flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Zero-Knowledge Architecture Ready</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section >

      {/* How it Works & Security Section - below MSME section */}
      {/* How it Works Section */}
      <section id="how-it-works" className="bg-slate-50 min-h-screen flex flex-col justify-center py-12 animate-fadein relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl -ml-20 -mt-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -mr-20 -mb-20"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">How it Works</h2>
            <p className="text-slate-600 text-xl font-medium invisible h-0">Bidding isn't a gamble—it's a systematic machine for growth.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-stretch">
            {/* Steps Column - Span 2 */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 relative">
              {/* Animated Path/Connector (Visible on Desktop) */}
              <div className="hidden md:block absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-indigo-200 to-transparent"></div>
              </div>

              {/* Step 1 */}
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl shadow-slate-200/50 flex flex-col items-center text-center relative z-10 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-white shadow-inner rounded-2xl flex items-center justify-center mb-4 text-indigo-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <UserPlus className="w-8 h-8 relative z-10" />
                  <div className="absolute top-0 right-0 px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-bl-lg">01</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Step 1 – Create your company profile once</h3>
                <p className="text-slate-600 font-medium text-sm">Enter basic company and capability information once.</p>
              </motion.div>

              {/* Step 2 */}
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl shadow-slate-200/50 flex flex-col items-center text-center relative z-10 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-white shadow-inner rounded-2xl flex items-center justify-center mb-4 text-indigo-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Brain className="w-8 h-8 relative z-10" />
                  <div className="absolute top-0 right-0 px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-bl-lg">02</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Step 2 - AI Curates relevant tenders automatically</h3>
                <p className="text-slate-600 font-medium text-sm">Receive a filtered list based on your sector and eligibility</p>
              </motion.div>

              {/* Step 3 */}
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl shadow-slate-200/50 flex flex-col items-center text-center relative z-10 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-white shadow-inner rounded-2xl flex items-center justify-center mb-4 text-indigo-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <SearchCheck className="w-8 h-8 relative z-10" />
                  <div className="absolute top-0 right-0 px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-bl-lg">03</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Step 3 – Check eligibility & risks instantly</h3>
                <p className="text-slate-600 font-medium text-sm">Understand qualification gaps before bidding.</p>
              </motion.div>

              {/* Step 4 */}
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl shadow-slate-200/50 flex flex-col items-center text-center relative z-10 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-white shadow-inner rounded-2xl flex items-center justify-center mb-4 text-indigo-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FileCheck className="w-8 h-8 relative z-10" />
                  <div className="absolute top-0 right-0 px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-bl-lg">04</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Step 4 - Generate bid-ready documentation in minutes.</h3>
                <p className="text-slate-600 font-medium text-sm">Download structured, compliant documentation in minutes.</p>
              </motion.div>
            </div>

            {/* Security Vault Column - Span 1 */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="lg:col-span-1 bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-500">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Is my data Secure?</h3>
                  <p className="text-indigo-200/70 font-semibold mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    Yes.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Hosted under Indian compliance standards",
                      "Governed by applicable Indian data protection laws",
                      "No public sharing of proprietary company data",
                      "Secure access architecture"
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-slate-300 text-sm font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-6 border-t border-slate-800">
                  <p className="text-slate-400 text-xs italic font-medium mb-3">We understand the sensitivity of bid documents. Security is built into the platform from day one.</p>
                  <div className="bg-indigo-600 text-white p-3.5 rounded-xl shadow-lg mt-2">
                    <p className="font-bold text-base mb-1">Submit. Track. Repeat.</p>
                    <p className="text-[10px] opacity-90 leading-tight">This transforms your tender bidding process into a systematic growth engine.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Offer Section: Start Free for 6 Months (Full-Width Banner) */}
      <section className="bg-white overflow-hidden">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="w-full">
          <div className="w-full flex flex-col md:flex-row items-center gap-8 px-0 py-10 bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-y-2 border-blue-200">
            <div className="flex flex-col items-center md:items-start md:w-1/3 w-full pl-8 md:pl-16">
              <img src="/assets/circlelogo.png" alt="Company Logo" className="w-16 h-16 object-contain rounded-full mb-3 border-4 border-white shadow-lg" />
              <div className="text-3xl font-extrabold text-blue-900 mb-1 tracking-tight drop-shadow">Start free for 6 months.</div>
              <div className="text-base text-blue-700 mb-1">No upfront cost. <br /> No commitment.</div>
              <button
                onClick={() => navigate('/signup')}
                className="mt-3 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:scale-[1.04] transition-transform text-base"
              >
                Start Now <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start justify-between w-full pr-8 md:pr-16">
              <div className="flex flex-col gap-2 text-blue-900 text-lg font-medium md:w-1/2">
                <span>Test it on real tenders.</span>
                <span>See the difference in speed and compliance yourself.</span>
              </div>
              <div className="flex flex-col gap-2 text-blue-800 text-base md:w-1/2 font-medium">
                <span>If it doesn’t help you apply more and reduce rejection risk — you walk away.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Final CTA Section - High Contrast */}
      <section className="bg-slate-900 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mt-0 w-full py-24 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm">
              Ready to win more PSU Business?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Stop manually chasing tenders. <br /> Start scaling systematically with AI.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl font-bold hover:scale-[1.04] transition-transform text-lg shadow-xl shadow-indigo-500/20"
              >
                Start free for 6 months. <ArrowRight className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-8 text-sm text-slate-400 font-medium tracking-wide">
              Built for MSMEs. <span className="mx-2">•</span> Powered by AI. <span className="mx-2">•</span> Designed to help you win more PSU contracts.
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social proof removed per user request */}
      {/* Coverage Strength (improved card grid) */}
      {/* FAQ Section */}
      <section id="coverage-strength" className="py-20 bg-slate-50 animate-fadein">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">

            <h3 className="text-sm font-semibold text-indigo-700 tracking-widest uppercase">FAQ Section</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">Frequently Asked Questions</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {[{
                question: "What does this platform exactly do?",
                answer: "It is an AI-powered tender management software built for MSME manufacturers in India. It automates finding relevant PSU tenders, checking eligibility against technical criteria, and generating compliance-ready bid documents."
              }, {
                question: "How does it reduce technical rejections?",
                answer: "Our AI engine analyzes tender documents (NITs) against your company profile to flag compliance gaps, missing certifications, or turnover mismatches before you spend time preparing the bid."
              }, {
                question: "Is this for all types of tenders?",
                answer: "This platform is specifically optimized for manufacturing and supply tenders across Indian PSU OEMs (like Railways, Defense, Power, Space etc.). It is not built for civil construction or service contracts."
              }, {
                question: "Will my company data be shared?",
                answer: "No. Your proprietary data, certifications, and financials are securely encrypted, hosted under Indian data regulations, and never shared publicly or with competitors."
              }, {
                question: "How much time does it save?",
                answer: "On average, what takes 3 days of manual portal searching, risk analysis, and document preparation is compressed into less than 4 hours, allowing your team to apply to 3–5x more tenders."
              }].map((faq, idx) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`bg-blue-50 rounded-2xl shadow-lg border border-blue-100 p-7 flex flex-col h-full hover:shadow-2xl transition-all ${idx === 4 ? "md:col-span-2 md:w-2/3 md:mx-auto" : ""}`}
                >
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">{faq.question}</h4>
                  <p className="text-slate-700">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-slate-50 text-slate-700 py-16 border-t border-slate-200 animate-fadein">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/assets/logo.jpg" alt="Qistonpe Logo" className="h-12 w-auto max-w-[220px] object-contain bg-white" />
              </div>
              <p className="text-sm text-slate-600">Empowering businesses with smart opportunities and capital.</p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Links</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><a href="https://in.linkedin.com/company/qistonpe" target="_blank" rel="noreferrer noopener" className="hover:text-indigo-600 transition-colors">LinkedIn</a></li>
                <li><span className="text-slate-500 cursor-not-allowed" aria-disabled="true">Customer Agreement</span></li>
                <li><span className="text-slate-500 cursor-not-allowed" aria-disabled="true">Terms &amp; Conditions</span></li>
                <li><span className="text-slate-500 cursor-not-allowed" aria-disabled="true">Privacy Policy</span></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-semibold text-slate-900 mb-4">Contact</h4>
              <p className="text-sm text-slate-700 mb-3">Write to <a href="mailto:info@qistonpe.com" className="text-indigo-600 hover:underline">info@qistonpe.com</a> to get started and receive updates on QistonPe™ MetalCapital</p>
              <p className="text-sm text-slate-500">Copyright © 2026 Ambition10T Innovations Private Limited<br />All rights reserved</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 text-sm text-slate-500 text-center">
            <span>© 2026 Ambition10T Innovations Private Limited — All rights reserved</span>
          </div>
        </div>
      </footer>
    </div >
  );
}
