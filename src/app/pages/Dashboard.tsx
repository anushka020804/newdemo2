import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  Sparkles,
  FileText,
  TrendingUp,
  Search,
  Bookmark,
  User,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  LogOut,
  FileSearch,
  FileBadge
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/useLogout";


export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleLogout = useLogout();

  // User initials for avatar
  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  // Welcome message
  const welcomeTitle = "Welcome Back !!";
  const welcomeSubtitle = "Ready to find new matched tenders ?";

  const kpiCards = [
    {
      title: "Latest Tenders",
      value: "47",
      icon: TrendingUp,
      gradient: "from-blue-500 to-indigo-500",
      action: () => navigate("/tenders")
    },
    {
      title: "Matched Tenders",
      value: "12",
      icon: Sparkles,
      gradient: "from-purple-500 to-pink-500",
      action: () => navigate("/tenders", { state: { filter: "active" } })
    },
    {
      title: "Analyse Tender",
      value: "8",
      icon: FileSearch,
      gradient: "from-emerald-500 to-teal-500",
      action: () => navigate("/tenders")
    },
    {
      title: "Generated Bid Documents",
      value: "3",
      icon: FileBadge,
      gradient: "from-rose-500 to-pink-500",
      action: () => navigate("/saved-bids")
    },
    {
      title: "Saved Tenders",
      value: "5",
      icon: Bookmark,
      gradient: "from-amber-500 to-orange-500",
      action: () => navigate("/saved-bids")
    },
  ];

  const recentActivities = [
    {
      id: "3",
      type: "match",
      icon: Sparkles,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      title: "New tender matched your items",
      description: "DC MAGNET - HMT MACHINE TOOLS LIMITED",
      time: "1 hour ago",
      actionText: "View Tender",
      action: () => navigate("/tenders")
    },
    {
      id: "1",
      type: "match",
      icon: Sparkles,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      title: "New tender matched in the past 24 hrs",
      description: "Industrial Valves - Karnataka PWD",
      time: "2 hours ago",
      actionText: "View Tender",
      action: () => navigate("/tenders")
    },
    {
      id: "4",
      type: "match",
      icon: Sparkles,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
      title: "New high-match tender found",
      description: "Chemical for water treatment - BHILAI STEEL PLANT",
      time: "3 hours ago",
      actionText: "View Tender",
      action: () => navigate("/tenders")
    },
    {
      id: "2",
      type: "view",
      icon: Eye,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      title: "Bid viewed",
      description: "Steel Fasteners Supply - NHAI",
      time: "5 hours ago",
      actionText: "Open Bid",
      action: () => navigate("/saved-bids")
    }
  ];

  const closingSoonTenders = [
    {
      items: "DC MAGNET",
      organization: "HMT MACHINE TOOLS LIMITED",
      closingIn: "Closing in 2 days",
    },
    {
      items: "Chemical for water treatment",
      organization: "BHILAI STEEL PLANT",
      closingIn: "Closing in 4 days",
    },
    {
      items: "LABEL PRINTER, SPARE TAPE, INK RIBBON",
      organization: "INDIAN AIR FORCE",
      closingIn: "Closing in 5 days",
    },
    {
      items: "Jib crane installation",
      organization: "HPCL RAJASTHAN REFINERY LIMITED",
      closingIn: "Closing in 6 days",
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8 flex-1">
            <h1 className="text-2xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent shrink-0">
              OpportunityX
            </h1>

            {/* Global Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for tenders, HSN codes, keywords, companies..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate('/tenders', { state: { search: e.currentTarget.value } });
                  }
                }}
              />
            </div>

            <nav className="hidden lg:flex items-center gap-6 shrink-0">
              <button
                onClick={() => navigate("/tenders", { state: { filter: "all" } })}
                className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Latest Tenders
              </button>
              <button
                onClick={() => navigate("/tenders", { state: { filter: "active" } })}
                className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Matched Tenders
              </button>
              <button
                onClick={() => navigate("/saved-bids")}
                className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                Saved Tenders
              </button>
              {/* Profile Link removed from here as per "give the same option 3 options" request, but maybe good to keep icon? User said "give the same option 3 options", implying 3. I'll stick to 3 main ones + Profile icon is separate in right header usually.*/}
            </nav>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-4">
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 border border-red-200 px-3 py-1.5 rounded-lg transition-all hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/profile")}>
              <span className="text-white text-sm font-semibold">{initials}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl mb-2">{welcomeTitle}</h2>
          <p className="text-gray-600">{welcomeSubtitle}</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {kpiCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={card.action}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 cursor-pointer hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{card.title}</p>
              <p className="text-4xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Recent Activity - Timeline Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex-1"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">Recent Activity</h3>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    onClick={activity.action}
                    className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all cursor-pointer border border-transparent hover:border-indigo-100"
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 ${activity.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {activity.title}
                        </p>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      <button className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                        {activity.actionText} →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Match Quality Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-xl mb-6">Match Quality Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-green-700">High Match (&gt;90%)</span>
                    <span className="text-sm font-bold text-green-700">8 Tenders</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-xs text-green-600">Based on HSN Code + Keywords</p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-700">Medium Match (70-90%)</span>
                    <span className="text-sm font-bold text-blue-700">4 Tenders</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <p className="text-xs text-blue-600">Based on Keywords only</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full flex flex-col"
          >
            <h3 className="text-xl mb-6">Quick Actions</h3>

            <div className="space-y-3">
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Tenders Closing Soon</p>
                  <button
                    onClick={() => navigate("/tenders", { state: { filter: "closing-soon" } })}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    View All
                  </button>
                </div>

                {closingSoonTenders.map((tender, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors cursor-pointer" onClick={() => navigate("/tenders")}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">{tender.closingIn}</span>
                      <span className="text-xs text-gray-500">TBA</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-1" title={tender.items}>{tender.items}</p>
                    <p className="text-xs text-gray-500 line-clamp-1" title={tender.organization}>{tender.organization}</p>
                  </div>
                ))}

                <button
                  onClick={() => navigate("/tenders")}
                  className="w-full bg-indigo-50 text-indigo-700 px-4 py-3 rounded-xl hover:bg-indigo-100 transition-all text-sm font-medium flex items-center justify-center gap-2 mt-auto"
                >
                  <Search className="w-4 h-4" />
                  <span>Browse All Tenders</span>
                </button>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                <p className="text-sm text-gray-900 mb-1">Need working capital?</p>
                <p className="text-xs text-gray-600 mb-3">Boost your bidding power with Metal Capital</p>
                <button
                  onClick={() => navigate("/")}
                  className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  Learn More →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}