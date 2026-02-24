import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Building2, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Users, Phone, MessageCircle } from "lucide-react";
import React, { useState } from "react";

export function MarketingLandingPage() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", number: "" });

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
      <div className="w-full flex justify-center bg-slate-50" style={{ paddingTop: 96, paddingBottom: 8 }}>
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
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); try { history.replaceState(null, '', '#') } catch (e) {} }} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Home</a>
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
            <button onClick={() => navigate("/login")} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
              Log in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section (updated) */}
      <section className="relative pt-6 pb-16 lg:pt-16 lg:pb-28 overflow-hidden animate-fadein">
        {/* Soft background shapes */}
        <div className="absolute inset-0 -z-10 bg-white">
          <div className="absolute -left-32 -top-20 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute right-0 top-10 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="grid lg:grid-cols-2 gap-12 items-center" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* Left: Messaging */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                New: AI-Powered Tender Analysis
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                AI Tender Automation Software for <span className="text-blue-700">MSME Manufacturers</span> Supplying to PSU OEMs in India
              </h1>

              <p className="text-lg text-slate-600 mb-8 max-w-2xl">
                Discover relevant PSU tenders, check eligibility instantly, and generate bid-ready compliant documentation in minutes — using AI built specifically for Indian MSMEs.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button onClick={() => navigate('/signup')} aria-label="Start Free for 6 Months" className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition-transform">
                  Start Free for 6 Months
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollToCenter('how-it-works')}
                  aria-label="How it works?"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-xl bg-white text-slate-700 shadow-sm hover:shadow-md"
                >
                  How it works?
                </button>
              </div>

              <div className="mt-8">
                <div className="inline-flex items-center gap-3 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
                  Built for Indian MSMEs | Governed by Indian Data & Privacy Laws
                </div>
              </div>
            </div>

            {/* Right: Visual/Stats card */}
            <div className="relative">
              <div className="bg-blue-700 rounded-2xl p-6 shadow-2xl border border-blue-700">
                <div className="flex flex-col items-center justify-center py-8 px-4">
                  <div className="mb-6 text-3xl font-extrabold text-white tracking-tight drop-shadow-lg text-center">Key Benefits</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                    <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-shadow">
                      <span className="flex-shrink-0 relative mb-3">
                        <span className="absolute inset-0 w-12 h-12 bg-blue-100 rounded-full -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
                        <span className="bg-white p-3 rounded-full inline-flex items-center justify-center relative z-10">
                          <CheckCircle2 className="w-7 h-7 text-blue-900" />
                        </span>
                      </span>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-900 mb-1">Curated tenders across 90+ PSU OEMs</div>
                        <div className="text-xs text-blue-800">Automatically scanned and curated</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-shadow">
                      <span className="flex-shrink-0 relative mb-3">
                        <span className="absolute inset-0 w-12 h-12 bg-blue-100 rounded-full -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
                        <span className="bg-white p-3 rounded-full inline-flex items-center justify-center relative z-10">
                          <CheckCircle2 className="w-7 h-7 text-blue-900" />
                        </span>
                      </span>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-900 mb-1">AI eligibility & risk checks in minutes</div>
                        <div className="text-xs text-blue-800">Instant technical & compliance analysis</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-shadow">
                      <span className="flex-shrink-0 relative mb-3">
                        <span className="absolute inset-0 w-12 h-12 bg-blue-100 rounded-full -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
                        <span className="bg-white p-3 rounded-full inline-flex items-center justify-center relative z-10">
                          <CheckCircle2 className="w-7 h-7 text-blue-900" />
                        </span>
                      </span>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-900 leading-tight mb-1">
                          Automated<br />Bid documentation
                        </div>
                        <div className="text-xs text-blue-800">Save up to 95% preparation time</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Removed extra text as per request */}
              </div>

              {/* Help strip under the card */}
              <div className="mt-4 flex items-center gap-4 bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
                <div className="flex-1 text-sm text-slate-700 h-full flex flex-col justify-center">
                  Need help signing up? Call us or chat on WhatsApp — we're here to help.
                </div>
                <div className="flex items-center gap-2">
                  <a href="tel:+919876543210" className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm hover:bg-indigo-100 transition-colors">
                    <Phone className="w-4 h-4" />
                    +91 98765 43210
                  </a>
                  <a href="https://wa.me/919876543210?text=Hi%20I%20need%20help%20signing%20up" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Problem Section: text on right, image placeholder on left */}
      <section id="problem-manual" className="py-20 bg-blue-50 animate-fadein">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left: Image with accent bar */}
            <div className="order-1">
              <div className="relative overflow-hidden rounded-3xl shadow-xl border border-blue-100 bg-white">
                <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-blue-600 to-indigo-400 rounded-l-3xl" />
                <img src="/assets/problem-collage.png" alt="MSME tender paperwork collage" className="w-full h-64 object-cover block rounded-3xl" loading="lazy" />
              </div>
            </div>

            {/* Right: Problem text in card */}
            <div className="order-2">
              <div className="rounded-3xl shadow-xl border border-blue-100 bg-white/95 px-8 py-10 relative">
                <h3 className="text-2xl md:text-3xl font-extrabold mb-5 text-blue-900 leading-snug">You’re Not Losing Tenders to Competitors — You’re Losing Them to Your Process.</h3>
                <p className="text-blue-800 mb-5 text-base md:text-lg">Most MSME manufacturers supplying to PSU OEMs face the same challenges:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 shadow-sm"></span>
                    <span className="text-blue-900">Monitoring multiple tender portals manually</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 shadow-sm"></span>
                    <span className="text-blue-900">Missing relevant bids due to manual tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 shadow-sm"></span>
                    <span className="text-blue-900">Spending days preparing compliance heavy bid documents</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 shadow-sm"></span>
                    <span className="text-blue-900">Facing technical rejections in PSU tenders due to minor errors</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 shadow-sm"></span>
                    <span className="text-blue-900">Limited manpower to scale bidding efforts</span>
                  </li>
                </ul>

                <p className="text-blue-800 mb-2 text-base md:text-lg"><strong className="text-blue-900">The opportunity exists.</strong> But manual processes are slowing growth.</p>
                <p className="text-blue-800 text-base md:text-lg">Without a structured PSU tender management system, scaling becomes impossible.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agitate Section: emphasize revenue loss and automation benefits */}
      <section id="agitate" className="py-20 bg-slate-50 animate-fadein">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-10 shadow-md grid lg:grid-cols-2 gap-10 items-center">
            <div className="flex items-start">
              <div className="w-full">
                <h3 className="text-2xl font-bold text-red-700 mb-4">Every Missed Tender Is Lost Revenue.</h3>

                <p className="text-slate-700 mb-4">When tender discovery and bidding remain manual:</p>
                <ul className="list-disc pl-5 text-slate-600 space-y-2 mb-4">
                  <li>Competitors apply to more tenders using automation</li>
                  <li>Technical disqualifications waste weeks of effort</li>
                  <li>Compliance gaps go unnoticed until submission</li>
                  <li>Your team spends more time preparing bids than producing goods</li>
                </ul>

                <p className="text-slate-700 mb-2"><strong>In the PSU ecosystem, precision and speed determine who wins contracts.</strong></p>
                <p className="text-slate-700"><strong>Manual bidding does not scale for MSMEs. Automation does.</strong></p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="h-56 w-full bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl flex items-center justify-center text-indigo-400">
                 <img src="/assets/agitate-collage.png" alt="Agitate collage" className="w-full h-56 object-cover rounded-2xl block" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Problem / Solution Section (restyled, navy tones) */}
      <section id="problem-solution" className="py-24 bg-blue-50 animate-fadein">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight">Our Solution</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative">
              <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-2xl border border-slate-100 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-center mb-4">
                        {/* Removed Product Preview as per request */}
                  </div>

                  <div className="h-80 md:h-[28rem] bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg flex items-center justify-center text-indigo-600 overflow-hidden">
                    <video
                      className="w-full h-full object-contain"
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster="/assets/logo.jpg"
                    >
                      <source src="/assets/vid.mp4" type="video/mp4" />
                      {/* Fallback to image if video not supported */}
                      <img src="/assets/logo.jpg" alt="Platform dashboard preview" className="w-full h-full object-contain" />
                    </video>
                  </div>

                  {/* Growth Multiplier Card */}
                  <div className="mt-6 rounded-2xl bg-white/90 border border-blue-100 shadow p-6">
                    <h3 className="text-xl font-bold text-blue-800 mb-3">Apply to More. Win More.</h3>
                    <div className="text-blue-900 font-semibold mb-2">With automation:</div>
                    <ul className="list-disc pl-5 text-blue-900 space-y-1 mb-3">
                      <li>Apply to 3–5x more tenders</li>
                      <li>Reduce technical rejections</li>
                      <li>Improve compliance accuracy</li>
                      <li>Free your team for production & operations</li>
                      <li>Compete with larger players confidently</li>
                    </ul>
                    <div className="font-medium text-blue-700 mb-1">This is just not software</div>
                    <div className="text-blue-800 font-bold">It’s a growth multiplier for <span className="text-blue-600">MSME Manufacturers</span>.</div>
                  </div>
                </div>

                {/* Help strip under the card */}
                <div className="mt-4 flex items-center gap-4 bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
                  <div className="flex-1 text-sm text-slate-700 flex flex-col justify-center">
                    Need help signing up? Call us or chat on WhatsApp — we're here to help.
                  </div>
                  <div className="flex items-center gap-2">
                    <a href="tel:+919876543210" className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm hover:bg-indigo-100 transition-colors">
                      <Phone className="w-4 h-4" />
                      +91 98765 43210
                    </a>
                    <a href="https://wa.me/919876543210?text=Hi%20I%20need%20help%20signing%20up" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-2xl p-8 shadow-md border border-blue-100 bg-gradient-to-br from-white/80 to-blue-100 text-blue-900 h-full">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">Introducing an AI-Powered PSU Tender Management & Bid Automation Platform</h3>
                </div>

                <p className="text-blue-800 mb-4 leading-relaxed">An AI-embedded platform designed specifically for MSME manufacturers supplying to PSU OEMs in India.</p>

                <p className="text-blue-800 font-semibold mb-2">It does three critical things:</p>


                {/* Visual Timeline (Stepper) */}
                <div className="mb-4">
                  <ol className="relative border-l-4 border-blue-200 ml-2 pl-8 space-y-10">
                    <li className="group flex flex-col gap-2 relative">
                      <span className="absolute -left-8 top-1.5 flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-400 shadow-lg border-4 border-white group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
                      </span>
                      <h4 className="text-lg font-semibold text-blue-900 mb-1">AI Powered Tender Discovery Across 90+ PSU OEMs</h4>
                      <ul className="list-none pl-0 text-blue-800 space-y-1">
                        <li>Automatically scans and curates relevant tenders from multiple PSU portals.</li>
                        <li>No more switching portals. No more missed opportunities.</li>
                        <li>No manual tracking spreadsheets — intelligent government tender discovery built for MSMEs.</li>
                      </ul>
                    </li>
                    <li className="group flex flex-col gap-2 relative">
                      <span className="absolute -left-8 top-1.5 flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-400 shadow-lg border-4 border-white group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
                      </span>
                      <h4 className="text-lg font-semibold text-blue-900 mb-1">Eligibility & Risk Checks in Minutes</h4>
                      <p className="text-blue-800 mb-1">Our AI Engine instantly analyzes:</p>
                      <ul className="list-none pl-0 text-blue-800 space-y-1">
                        <li>Technical disqualification criteria</li>
                        <li>Compliance Requirements</li>
                        <li>Documentation gaps</li>
                        <li>Risk Factors</li>
                      </ul>
                      <p className="text-blue-800 mt-1">Apply only where you have a real chance to win.</p>
                    </li>
                    <li className="group flex flex-col gap-2 relative">
                      <span className="absolute -left-8 top-1.5 flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-400 shadow-lg border-4 border-white group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
                      </span>
                      <h4 className="text-lg font-semibold text-blue-900 mb-1">Automated Bid-Ready Documentation</h4>
                      <p className="text-blue-800 mb-1">Upload basic company data once. The platform generates:</p>
                      <ul className="list-none pl-0 text-blue-800 space-y-1">
                        <li>Structured technical documentation</li>
                        <li>Compliance-aligned bid formats</li>
                        <li>Organized submission-ready files</li>
                        <li>Error-minimized documentation — reduce bid preparation time by up to 95%</li>
                      </ul>
                      <p className="text-blue-800 mt-1">This is automated government tender documentation software built for speed and accuracy.</p>
                    </li>
                  </ol>
                </div>

                <div className="mt-6">
                  <button onClick={() => navigate('/signup')} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg font-semibold shadow-sm hover:bg-blue-900">Get Started</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
{/* MSME Specific Section - centered above coverage strength */}
      <div className="flex justify-center bg-white py-16 animate-fadein">
        <div className="w-full max-w-4xl px-6">
          <div className="rounded-2xl shadow-lg border border-blue-100 bg-white p-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Built Specifically for Indian MSMEs</h3>
            <p className="text-blue-800 mb-4">Unlike generic tender portals, this is a complete MSME tender automation platform:</p>
            <ul className="list-disc pl-5 text-blue-900 space-y-2 mb-4">
              <li>Designed for Indian PSU procurement processes</li>
              <li>Structured around real compliance required</li>
              <li>Simplified interface (no enterprise complexity)</li>
              <li>Secured and aligned with Indian data protection regulations</li>
              <li>Your preoperatory bid data is never made public</li>
            </ul>
            <div className="text-blue-700 font-semibold">Security and compliance are foundational to the platform.</div>
          </div>
        </div>
      </div>

      {/* How it Works & Security Section - below MSME section */}
      <div id="how-it-works" className="bg-white pb-16 animate-fadein">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* How it Works Box */}
            <div className="rounded-2xl shadow-lg border border-blue-200 bg-blue-50 p-8 flex flex-col justify-between">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">How it Works</h3>
              <ol className="list-decimal pl-5 text-blue-900 space-y-2 mb-4">
                <li><span className="font-semibold text-blue-800">Create your company profile once</span><br /><span className="text-blue-700">Enter basic company and capability information once.</span></li>
                <li><span className="font-semibold text-blue-800">AI Curates relevant tenders automatically</span><br /><span className="text-blue-700">Receive a filtered list based on your sector and eligibility</span></li>
                <li><span className="font-semibold text-blue-800">Check eligibility & risks instantly</span><br /><span className="text-blue-700">Understand qualification gaps before bidding.</span></li>
                <li><span className="font-semibold text-blue-800">Generate bid-ready documentation in minutes</span><br /><span className="text-blue-700">Download structured, compliant documentation in minutes.</span></li>
              </ol>
              <div className="text-blue-900 font-semibold mb-2">Submit. Track. Repeat.</div>
              <div className="text-blue-700">This transforms your tender bidding process into a systematic growth engine.</div>
            </div>
            {/* Security Box */}
            <div className="rounded-2xl shadow-lg border border-green-100 bg-green-50 p-8 flex flex-col justify-between">
              <h3 className="text-2xl font-bold text-green-900 mb-4">Is my data Secure?</h3>
              <div className="text-green-800 text-lg font-semibold mb-2">Yes.</div>
              <ul className="list-disc pl-5 text-green-900 space-y-2 mb-4">
                <li>Hosted under Indian compliance standards</li>
                <li>Governed by applicable Indian data protection laws</li>
                <li>No public sharing of proprietary company data</li>
                <li>Secure access architecture</li>
              </ul>
              <div className="text-green-900 mb-2">We understand the sensitivity of bid documents.</div>
              <div className="text-green-700 font-semibold">Security is built into the platform from day one.</div>
            </div>
          </div>
          {/* Offer Section: Start Free for 6 Months (Full-Width Banner) */}
          <div className="mt-12 w-full">
            <div className="w-full flex flex-col md:flex-row items-center gap-8 px-0 py-10 bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-y-2 border-blue-200">
              <div className="flex flex-col items-center md:items-start md:w-1/3 w-full pl-8 md:pl-16">
                <img src="/assets/circlelogo.png" alt="Company Logo" className="w-16 h-16 object-contain rounded-full mb-3 border-4 border-white shadow-lg" />
                <div className="text-3xl font-extrabold text-blue-900 mb-1 tracking-tight drop-shadow">Start Free for 6 Months</div>
                <div className="text-base text-blue-700 mb-1">No upfront cost. No commitment.</div>
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
                <div className="flex flex-col gap-2 text-blue-800 text-base md:w-1/2">
                  <span>• Apply more, reduce rejection risk</span>
                  <span>• Walk away if it doesn’t help you</span>
                  <span>• Built for MSMEs, powered by AI</span>
                  <span className="text-blue-700 font-semibold italic mt-2">Risk-free trial for Indian manufacturers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Final CTA Section - independent, below offer (Redesigned) */}
        <div className="mt-20 flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="relative flex flex-col md:flex-row items-stretch overflow-hidden rounded-3xl shadow-2xl border border-indigo-300 bg-gradient-to-br from-indigo-50 via-blue-100 to-white">
              {/* Left: Motivational headline */}
              <div className="flex flex-col justify-center px-8 py-10 md:w-1/2 w-full bg-gradient-to-br from-indigo-700 to-blue-700 text-white text-left">
                <div className="text-2xl font-extrabold mb-2 drop-shadow">Ready to win more PSU Business?</div>
                <div className="text-base font-medium mb-4">Stop manually chasing tenders.<br/>Start scaling systematically with AI.</div>
                <button
                  onClick={() => navigate('/signup')}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-xl font-semibold shadow-lg hover:bg-indigo-50 hover:text-indigo-900 transition-transform text-base"
                >
                  Start Free for 6 Months <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              {/* Right: Key points */}
              <div className="flex flex-col justify-center px-8 py-10 md:w-1/2 w-full bg-white/90 text-blue-900 text-left">
                <div className="text-base font-semibold mb-2">Built for MSMEs.<br/>Powered by AI.<br/>Designed to help you win more PSU contracts.</div>
                <ul className="list-disc pl-5 text-blue-800 space-y-2 mb-3">
                  <li>Automate tender discovery & documentation</li>
                  <li>Reduce manual errors and rejections</li>
                  <li>Grow your PSU business with confidence</li>
                </ul>
                <div className="text-indigo-700 font-semibold italic mt-2">Join the next wave of MSME growth</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social proof removed per user request */}
      {/* Coverage Strength (improved card grid) */}
      <section id="coverage-strength" className="py-20 bg-slate-50 animate-fadein">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">

            {/* FAQ Section */}
            <h3 className="text-sm font-semibold text-indigo-700 tracking-widest uppercase">FAQ Section</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">Frequently Asked Questions</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[{
                question: "What is AI tender automation software?",
                answer: "AI tender automation software helps MSME manufacturers automatically discover relevant PSU tenders, evaluate eligibility, and generate bid-ready documentation using artificial intelligence."
              }, {
                question: "How can MSMEs reduce technical rejection in PSU tenders?",
                answer: "By using automated compliance checks and AI-driven document preparation, MSMEs can eliminate common errors that cause technical disqualification."
              }, {
                question: "Is this platform suitable for government tender bidding in India?",
                answer: "Yes. The platform is specifically designed for Indian PSU OEM procurement processes across power, railways, heavy engineering, and defense sectors."
              }, {
                question: "Is my tender documentation data secure?",
                answer: "Yes. The platform operates under Indian data and privacy regulations and does not publicly share proprietary company information."
              }].map((faq, idx) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-blue-50 rounded-2xl shadow-lg border border-blue-100 p-7 flex flex-col h-full hover:shadow-2xl transition-all"
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
