import React from "react";

import { useNavigate } from "react-router";

export default function AboutPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/assets/logo.jpg" alt="Qistonpe Logo" className="h-14 w-auto max-w-[220px] object-contain bg-white" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" onClick={e => { e.preventDefault(); navigate("/"); }} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Home</a>
            <a href="/about" className="text-sm font-medium text-indigo-700 transition-colors">About</a>
            <div className="relative group">
              <button className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1 focus:outline-none">
                Products
                <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity z-50">
                <a href="/metalcapital" className="block px-5 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg">Metal Capital</a>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/login") } className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
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
      <div className="max-w-7xl mx-auto pt-24 px-6">
        <section id="about" className="py-24 bg-gradient-to-br from-indigo-50 via-blue-50 to-white text-slate-900 rounded-3xl shadow-2xl border border-blue-100">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-700 to-blue-700 bg-clip-text text-transparent drop-shadow">About QistonPe</h2>
            <p className="text-xl text-blue-900 mb-6 leading-relaxed font-medium">
              QistonPe is on a mission to empower Indian MSMEs with cutting-edge AI tools for growth, efficiency, and success in government and private procurement.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left mb-10">
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-7">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">Our Vision</h3>
                <p className="text-slate-700">To democratize access to business opportunities and working capital for every small manufacturer in India, enabling them to compete and thrive in the digital economy.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-7">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">What We Do</h3>
                <ul className="list-disc pl-5 text-slate-700 space-y-2">
                  <li>Curated tender discovery and instant eligibility checks</li>
                  <li>Automated bid documentation and compliance</li>
                  <li>Order-backed raw material financing</li>
                  <li>Smart procurement and supplier orchestration</li>
                  <li>Analytics and insights for business growth</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-7 md:col-span-2">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">Why QistonPe?</h3>
                <ul className="list-disc pl-5 text-slate-700 space-y-2">
                  <li>Built for Indian MSMEs, by a team passionate about manufacturing and technology</li>
                  <li>AI-driven, secure, and always up-to-date with the latest compliance standards</li>
                  <li>Trusted by manufacturers across power, railways, heavy engineering, and more</li>
                  <li>Committed to data privacy and regulatory compliance</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold">Built for Indian MSMEs</span>
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">AI-Driven</span>
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold">Data Secure</span>
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">Compliance First</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
