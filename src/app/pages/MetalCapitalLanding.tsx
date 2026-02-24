import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Building2, ArrowRight, CheckCircle2, ShieldCheck, Users, Sparkles } from "lucide-react";

export default function MetalCapitalLanding() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", number: "" });

  // helper to scroll an element to the center of the viewport
  const scrollToCenter = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const top = rect.top + scrollTop - Math.max(0, (window.innerHeight - rect.height) / 2);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // scroll element so its top is just below the fixed navbar
  const scrollToStart = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const navHeight = 80; // matches navbar height (h-20)
    const top = rect.top + scrollTop - navHeight - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div id="top" className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toggle Button for OpportunityX / MetalCapital */}
      <div className="w-full flex justify-center bg-slate-50" style={{ paddingTop: 96, paddingBottom: 8 }}>
        <div className="flex rounded-full overflow-hidden border border-blue-200 shadow-md" style={{ minWidth: 320 }}>
          <button
            onClick={() => navigate("/")}
            className={`px-8 py-3 text-lg font-semibold transition-all focus:outline-none border-r border-blue-200 ${window.location.pathname === "/" ? "bg-blue-600 text-white" : window.location.pathname.startsWith("/metalcapital") ? "bg-white text-blue-700" : "bg-white text-blue-700 hover:bg-blue-50"}`}
            aria-pressed={window.location.pathname === "/"}
          >
            OpportunityX
          </button>
          <button
            onClick={() => navigate("/metalcapital")}
            className={`px-8 py-3 text-lg font-semibold transition-all focus:outline-none border-l border-blue-200 ${window.location.pathname.startsWith("/metalcapital") ? "bg-blue-600 text-white" : "bg-white text-blue-700 hover:bg-blue-50"}`}
            aria-pressed={window.location.pathname.startsWith("/metalcapital")}
          >
            MetalCapital
          </button>
        </div>
      </div>
      {/* Navbar (copied from main landing) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/assets/logo.jpg" alt="Qistonpe Logo" className="h-14 w-auto max-w-[220px] object-contain bg-white" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToStart('hero'); }} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Home</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToCenter('about'); }} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">About</a>
            <div className="relative group">
              <button aria-haspopup="true" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1 focus:outline-none">
                Products
                <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity z-50">
                <a
                  href="/"
                  className={`block px-5 py-3 text-sm rounded-lg font-semibold transition-colors ${window.location.pathname === "/" ? "bg-blue-700 text-white" : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"}`}
                  aria-current={window.location.pathname === "/" ? "page" : undefined}
                >
                  OpportunityX
                </a>
                <a
                  href="/metalcapital"
                  className={`block px-5 py-3 text-sm rounded-lg font-semibold transition-colors ${window.location.pathname.startsWith("/metalcapital") ? "bg-blue-700 text-white" : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"}`}
                  aria-current={window.location.pathname.startsWith("/metalcapital") ? "page" : undefined}
                >
                  MetalCapital
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">Log in</a>
            <a href="/signup" className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5">Start Now</a>
          </div>
        </div>
      </nav>

      {/* Hero Section with Abstract Background and Side-by-Side Layout */}
      <section id="hero" className="relative pt-8 pb-20 lg:pt-16 lg:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden -z-10 bg-white">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-50 blur-3xl opacity-60 mix-blend-multiply animate-blob" />
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-50 blur-3xl opacity-60 mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute -bottom-[20%] left-[20%] w-[70%] h-[70%] rounded-full bg-amber-50 blur-3xl opacity-60 mix-blend-multiply animate-blob animation-delay-4000" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1"
          >
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 max-w-2xl leading-[1.1] mx-auto lg:mx-0">
              Scale Your<br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Manufacturing</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Empower India's small manufacturers to access growth capital, modernize operations, and scale sustainably via <strong className="text-slate-900">QistonPe MetalCapital</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
                onClick={() => setShowPopup(true)}
              >
                Start Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full max-w-lg mx-auto lg:mx-0"
          >
              <div className="relative rounded-3xl bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-900/90 backdrop-blur-xl border border-blue-900 shadow-2xl p-10 text-white flex flex-col gap-6 overflow-hidden"
                style={{ boxShadow: '0 8px 32px 0 rgba(32, 80, 200, 0.25), 0 0 0 4px rgba(59,130,246,0.08)' }}>
              <div className="absolute -inset-1.5 rounded-3xl pointer-events-none"
                   style={{ background: 'linear-gradient(120deg,rgba(59,130,246,0.18),rgba(99,102,241,0.12),rgba(16,185,129,0.10))', filter: 'blur(16px)', zIndex: 0 }} />
              <div className="relative z-10 flex items-center gap-4 mb-2">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                  <Building2 className="w-9 h-9 text-white drop-shadow" />
                </span>
                <span className="text-3xl font-extrabold tracking-wide text-white drop-shadow">MetalCapital</span>
              </div>
              <ul className="relative z-10 text-base space-y-3 mb-2">
                <li className="flex items-center gap-3"><span className="inline-block w-3 h-3 rounded-full bg-white/70 shadow"></span><span className="font-medium">Order-backed raw material financing for MSMEs</span></li>
                <li className="flex items-center gap-3"><span className="inline-block w-3 h-3 rounded-full bg-white/70 shadow"></span>Zero collateral, direct supplier payment</li>
                <li className="flex items-center gap-3"><span className="inline-block w-3 h-3 rounded-full bg-white/70 shadow"></span>Up to <b>₹3 Cr</b>, 45–120 days tenure</li>
                <li className="flex items-center gap-3"><span className="inline-block w-3 h-3 rounded-full bg-white/70 shadow"></span>Business cycle-aligned repayment</li>
              </ul>
              <div className="relative z-10 flex flex-wrap gap-3 mt-2">
                <span className="inline-block bg-white/30 text-white border border-white/40 px-4 py-1.5 rounded-full text-xs font-bold shadow">Verified POs</span>
                <span className="inline-block bg-white/30 text-white border border-white/40 px-4 py-1.5 rounded-full text-xs font-bold shadow">No Collateral</span>
                <span className="inline-block bg-white/30 text-white border border-white/40 px-4 py-1.5 rounded-full text-xs font-bold shadow">Direct to Supplier</span>
              </div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl z-0" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Start Now Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
            <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl" onClick={() => { setShowPopup(false); setSubmitted(false); setForm({ name: '', number: '' }); }}>&times;</button>
            {!submitted ? (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Request a Callback</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input type="tel" required pattern="[0-9]{10,}" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all">Submit</button>
              </form>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-xl font-bold mb-2 text-blue-600">Thank you!</h3>
                <p className="text-slate-700 mb-2">Our team will get back to you soon!</p>
                <button className="mt-4 px-6 py-2 bg-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-300" onClick={() => { setShowPopup(false); setSubmitted(false); setForm({ name: '', number: '' }); }}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Empowered by Global Standards Section (with 3 logos) */}
      {/* Empowered by Global Standards section removed as requested */}

      {/* Start Now Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
            <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl" onClick={() => { setShowPopup(false); setSubmitted(false); setForm({ name: '', number: '' }); }}>&times;</button>
            {!submitted ? (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Request a Callback</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input type="tel" required pattern="[0-9]{10,}" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all">Submit</button>
              </form>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-xl font-bold mb-2 text-blue-600">Thank you!</h3>
                <p className="text-slate-700 mb-2">Our team will get back to you soon!</p>
                <button className="mt-4 px-6 py-2 bg-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-300" onClick={() => { setShowPopup(false); setSubmitted(false); setForm({ name: '', number: '' }); }}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* $150B+ Opportunity Section in a Box */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-3xl bg-white/30 backdrop-blur-xl border border-blue-200 shadow-2xl p-10 text-center overflow-hidden"
            style={{ boxShadow: '0 8px 32px 0 rgba(32, 80, 200, 0.18), 0 0 0 4px rgba(59,130,246,0.08)' }}>
            <div className="absolute -inset-1.5 rounded-3xl pointer-events-none"
              style={{ background: 'linear-gradient(120deg,rgba(59,130,246,0.10),rgba(99,102,241,0.08),rgba(16,185,129,0.07))', filter: 'blur(16px)', zIndex: 0 }} />
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl z-0" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Stop Borrowing at 24%. <span className="text-blue-700">Start Growing at Scale.</span></h2>
              <div className="text-lg md:text-2xl text-slate-900 font-normal mb-4 max-w-3xl mx-auto">
                <p>India’s small manufacturers are sitting on massive potential but zero cash. With a $150 billion credit gap, most businesses are forced to choose between turning down big orders or taking high-interest debt that eats their margins.</p>
              </div>

              <div className="text-slate-700 text-lg md:text-2xl max-w-2xl mx-auto space-y-4 mt-4">
                  <p>MetalCapital solves the <strong className="text-blue-700 font-bold">Upfront Gap.</strong> We fund your purchase orders and pay your suppliers directly. You keep the production line moving, keep your profits, and finally say <strong className="text-blue-700 font-bold">&quot;yes&quot;</strong> to the big contracts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      // ...existing code...

      {/* OpportunityX & MetalCapital Entry Points - Redesigned */}
      <section id="entrypoints" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-bold text-slate-900 mb-3">The Ecosystem Entry Points</h3>
            <p className="text-slate-700 max-w-3xl mx-auto">QistonPe combines bid discovery and order-backed finance to make MSMEs credit-ready and operationally efficient.</p>
          </div>

            <div className="grid gap-8 md:grid-cols-2">
            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </span>
                <h4 className="text-2xl font-bold text-indigo-900 mb-0">OpportunityX</h4>
              </div>
              <p className="text-slate-600 mb-4">AI-curated tender alerts and step-by-step participation guidance using GeM and PSU data.</p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>HSN & keyword matching</li>
                <li>Instant BoM & bid templates</li>
                <li>Daily curated matches</li>
              </ul>
              <button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow hover:from-indigo-700 hover:to-blue-700 transition">Start Now <ArrowRight className="w-4 h-4 inline-block ml-2" /></button>
            </div>

            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-700 flex items-center justify-center shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </span>
                <h4 className="text-2xl font-bold text-slate-900 mb-0">QistonPe MetalCapital</h4>
              </div>
              <p className="text-slate-600 mb-4">Order-backed finance routed to suppliers, designed for MSMEs to execute and fulfill larger orders.</p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>Zero collateral, supplier-direct disbursals</li>
                <li>Loans from ₹5L to ₹3Cr</li>
                <li>Tenure aligned to OEM cycles</li>
              </ul>
              <button onClick={() => setShowPopup(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition">Request Callback <ArrowRight className="w-4 h-4 inline-block ml-2" /></button>
            </div>
          </div>
        </div>
      </section>

      // ...existing code...
      {/* Footer */}
      <footer className="bg-slate-50 text-slate-700 py-12 border-t border-slate-200">
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
              <p className="text-sm text-slate-500">Copyright © 2026 Ambition10T Innovations Private Limited<br/>All rights reserved</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 text-sm text-slate-500 text-center">
            <span>© 2026 Ambition10T Innovations Private Limited — All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
