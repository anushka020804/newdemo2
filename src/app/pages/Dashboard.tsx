import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/useLogout";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Bookmark,
  Settings,
  Plus,
  Search,
  Bell,
  TrendingUp,
  Clock,
  FileCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Eye,
  Send,
  Trophy,
  ThumbsDown,
  FilePenLine,
} from "lucide-react";
import {
  HeaderWithNotifications,
  SharedSidebar,
  sampleNotifications,
  Notification,
  CompanyInfoPopup,
  CompanyInfo
} from "../components/SharedComponents";

// Animated Counter Component
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{count}</>;
}

// Stats Card Component with Animation
function StatsCard({
  icon: Icon,
  iconBg,
  iconColor,
  badge,
  badgeColor,
  title,
  value,
  subtitle,
  valueSecondary,
  delay = 0,
  onClick,
}: {
  icon: any;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
  title: string;
  value: string;
  subtitle: string;
  valueSecondary?: string;
  delay?: number;
  onClick?: () => void;
}) {
  const numericValue = parseInt(value);
  const numericSecondary = valueSecondary ? parseInt(valueSecondary) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -8, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 }
      }}
      onClick={onClick}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm cursor-pointer relative overflow-hidden group"
    >
      {/* Animated gradient overlay on hover */}
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        whileHover={{ opacity: 0.05, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-violet-600 to-transparent pointer-events-none"
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className={`p-2.5 rounded-xl ${iconBg}`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </motion.div>
          {badge && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: delay + 0.3 }}
              className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor}`}
            >
              {badge}
            </motion.span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">
            {!isNaN(numericValue) ? <AnimatedCounter value={numericValue} /> : value}
          </span>
          {valueSecondary && (
            <>
              <span className="text-gray-400 text-lg font-medium">|</span>
              <span className="text-xl font-bold text-orange-500">
                {numericSecondary !== null ? <AnimatedCounter value={numericSecondary} /> : valueSecondary}
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>
    </motion.div>
  );
}

// Circular Progress Component
function CircularProgress({ percentage, size = 100, strokeWidth = 8 }: { percentage: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
      </div>
    </div>
  );
}

// Main Dashboard Component
export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleLogout = useLogout();
  const [activeTab, setActiveTab] = useState("Weekly");
  const [timeFilter, setTimeFilter] = useState("Last 1 week");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) {
        setShowTimeDropdown(false);
      }
    }
    if (showStatusDropdown || showTimeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showStatusDropdown, showTimeDropdown]);

  // Chart data points for the line chart - different data for each filter
  const getChartData = () => {
    if (activeTab === "Daily") {
      return {
        labels: ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM", "12AM"],
        wonData: [5, 8, 12, 15, 18, 14, 10],
        lostData: [3, 5, 8, 10, 12, 9, 6],
      };
    } else if (activeTab === "Monthly") {
      return {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        wonData: [180, 220, 195, 250],
        lostData: [140, 160, 155, 180],
      };
    } else {
      // Weekly (default)
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        wonData: [40, 65, 45, 70, 55, 80, 60],
        lostData: [30, 45, 35, 50, 40, 55, 45],
      };
    }
  };

  const chartData = getChartData();

  // Recent bids data
  const recentBids = [
    {
      id: "TEN-2023-0584",
      title: "Smart City Infrastructure Phase II",
      region: "EU Region",
      eligibility: 96,
      technicalEval: "Approved",
      financialEval: "In Progress",
      status: "ACTIVE",
      statusColor: "bg-green-100 text-green-600",
      action: "Analyze",
      actionColor: "bg-violet-600 hover:bg-violet-700 text-white",
    },
    {
      id: "TEN-2023-0542",
      title: "Cloud Data Migration Services",
      region: "NA Region",
      eligibility: 88,
      technicalEval: "Pending",
      financialEval: "Pending",
      status: "SAVED",
      statusColor: "bg-blue-100 text-blue-600",
      action: "View Bid",
      actionColor: "bg-white border border-violet-600 text-violet-600 hover:bg-violet-50",
    },
    {
      id: "TEN-2023-0519",
      title: "Renewable Energy Supply Chain",
      region: "APAC Region",
      eligibility: 92,
      technicalEval: "Failed",
      financialEval: "N/A",
      status: "EXPIRED",
      statusColor: "bg-red-100 text-red-600",
      action: "Closed",
      actionColor: "bg-gray-100 text-gray-500 cursor-not-allowed",
    },
    {
      id: "TEN-2023-0498",
      title: "Healthcare Equipment Supply",
      region: "EU Region",
      eligibility: 94,
      technicalEval: "Approved",
      financialEval: "Approved",
      status: "PENDING",
      statusColor: "bg-yellow-100 text-yellow-600",
      action: "Submit",
      actionColor: "bg-violet-600 hover:bg-violet-700 text-white",
    },
    {
      id: "TEN-2023-0476",
      title: "Office Furniture Procurement",
      region: "APAC Region",
      eligibility: 90,
      technicalEval: "In Progress",
      financialEval: "Pending",
      status: "ACTIVE",
      statusColor: "bg-green-100 text-green-600",
      action: "Continue",
      actionColor: "bg-violet-600 hover:bg-violet-700 text-white",
    },
  ];

  // Filter bids based on status
  const filteredBids = statusFilter === "All Status" 
    ? recentBids 
    : recentBids.filter(bid => bid.status === statusFilter.toUpperCase());

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "CP";

  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Company Info
  const companyInfo: CompanyInfo = {
    name: (user as any)?.companyName || user?.fullName || "Your Company",
    registrationNumber: "CIN-U72200MH2020PTC123456",
    gstNumber: "27AABCU9603R1ZM",
    panNumber: "AABCU9603R",
    address: "123 Business Park, Sector 5, Mumbai, Maharashtra - 400001",
    contactPerson: user?.fullName || "Contact Person",
    email: user?.email || "contact@company.com",
    phone: "+91 98765 43210",
    hsnCodes: ["84713010", "84714100", "85176290", "85044090"],
    status: "verified"
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <SharedSidebar 
        companyName={companyInfo.name}
        onCompanyClick={() => setShowCompanyInfo(true)}
      />

      {/* Main Content */}
      <div className="flex-1 ml-[220px]">
        {/* Header with Notifications */}
        <HeaderWithNotifications
          title="B2B Tender Insights"
          subtitle="Welcome back, Manufacturers"
          initials={initials}
          userName={user?.fullName || "Manufacturers"}
          onProfileClick={() => navigate("/profile")}
          onLogout={handleLogout}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllRead={handleMarkAllRead}
        />

        {/* Dashboard Content */}
        <main className="p-8">
          {/* Company Info Popup */}
          <CompanyInfoPopup
            isOpen={showCompanyInfo}
            onClose={() => setShowCompanyInfo(false)}
            company={companyInfo}
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            <StatsCard
              icon={BarChart3}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              badge="+2%"
              badgeColor="bg-green-100 text-green-600"
              title="My Tenders"
              value="48"
              subtitle="Across 4 regions"
              delay={0.1}
            />
               
            <StatsCard
              icon={FileText}
              iconBg="bg-violet-100"
              iconColor="text-violet-600"
              badge="+15%"
              badgeColor="bg-green-100 text-green-600"
              title="Today's Tenders"
              value="12"
              subtitle="Matched in last 24h"
              delay={0}
              
            />
            <StatsCard
              icon={Clock}
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
              badge="Today"
              badgeColor="bg-orange-100 text-orange-600"
              title="Expiring Bids"
              value="5"
              subtitle="Requires immediate attention"
              delay={0.2}
            />
            <StatsCard
              icon={FileCheck}
              iconBg="bg-green-100"
              iconColor="text-green-600"
              badge="Target: 48"
              badgeColor="bg-gray-100 text-gray-600"
              title="Docs: Ready / Pending"
              value="24"
              valueSecondary="8"
              subtitle="Generation cycle: 14h"
              delay={0.3}
            />
            <StatsCard
              icon={FileText}
              iconBg="bg-indigo-100"
              iconColor="text-indigo-600"
              badge="Live"
              badgeColor="bg-blue-100 text-blue-600"
              title="All Tenders"
              value="287"
              subtitle="View all available tenders"
              delay={0.4}
             
            />
          </div>

          {/* Quick Links & Sidebar Row */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900">Quick Links</h3>
                <span className="text-[10px] text-gray-400">Click to navigate</span>
              </div>
              
              {/* Row 1: Tender Navigation */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { 
                    icon: FileText, label: "Today's Tenders", 
                    desc: "Last 24h by 10 AM", 
                    bg: "bg-violet-50", iconColor: "text-violet-600", border: "border-violet-200",
                    hoverBg: "hover:bg-violet-100",
                    route: "/tenders", state: { activeTab: "all", filter: "today" }
                  },
                  { 
                    icon: Clock, label: "Expiring Tenders", 
                    desc: "Expiring within 3 days", 
                    bg: "bg-orange-50", iconColor: "text-orange-600", border: "border-orange-200",
                    hoverBg: "hover:bg-orange-100",
                    route: "/tenders", state: { activeTab: "all", filter: "expiring" }
                  },
                  { 
                    icon: BarChart3, label: "Analyzed Tenders", 
                    desc: "User specific", 
                    bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-200",
                    hoverBg: "hover:bg-blue-100",
                    route: "/tenders", state: { activeTab: "matched", filter: "analyzed" }
                  },
                  { 
                    icon: Bookmark, label: "Saved Tenders", 
                    desc: "User specific", 
                    bg: "bg-green-50", iconColor: "text-green-600", border: "border-green-200",
                    hoverBg: "hover:bg-green-100",
                    route: "/saved-bids", state: {}
                  },
                ].map((item, i) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
                    whileHover={{ y: -3, transition: { duration: 0.15 } }}
                    onClick={() => navigate(item.route, { state: item.state })}
                    className={`${item.bg} ${item.hoverBg} border ${item.border} rounded-xl p-3.5 text-left transition-all group`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                      <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </div>
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{item.label}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                  </motion.button>
                ))}
              </div>

              {/* Row 2: Action Links */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { 
                    icon: CheckCircle, label: "Eligibility Check", 
                    desc: "If analyzed", 
                    bg: "bg-indigo-50", iconColor: "text-indigo-600", border: "border-indigo-200",
                    hoverBg: "hover:bg-indigo-100",
                    route: "/tenders", state: { activeTab: "matched", filter: "eligible" }
                  },
                  { 
                    icon: FileCheck, label: "Bid Doc Generated", 
                    desc: "Ready for submission", 
                    bg: "bg-emerald-50", iconColor: "text-emerald-600", border: "border-emerald-200",
                    hoverBg: "hover:bg-emerald-100",
                    route: "/tenders", state: { activeTab: "matched", filter: "bdg" }
                  },
                  { 
                    icon: TrendingUp, label: "Bid Status", 
                    desc: "User specific", 
                    bg: "bg-purple-50", iconColor: "text-purple-600", border: "border-purple-200",
                    hoverBg: "hover:bg-purple-100",
                    route: "/tenders", state: { activeTab: "matched", filter: "status" }
                  },
                ].map((item, i) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.82 + i * 0.08 }}
                    whileHover={{ y: -3, transition: { duration: 0.15 } }}
                    onClick={() => navigate(item.route, { state: item.state })}
                    className={`${item.bg} ${item.hoverBg} border ${item.border} rounded-xl p-3.5 text-left transition-all group`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                      <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </div>
                    <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                  </motion.button>
                ))}
              </div>

              {/* Row 3: Bid Status Quick Filters */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.05 }}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <p className="text-xs font-semibold text-gray-600 mb-3">Bid Status Quick Filters</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { label: "Viewed", icon: Eye, bg: "bg-gray-200", text: "text-gray-700", route: "/tenders", filter: "viewed" },
                    { label: "Analysed", icon: BarChart3, bg: "bg-blue-100", text: "text-blue-700", route: "/tenders", filter: "analysed" },
                    { label: "BDG Draft", icon: FilePenLine, bg: "bg-yellow-100", text: "text-yellow-700", route: "/tenders", filter: "bdg-draft" },
                    { label: "BDG Complete", icon: FileCheck, bg: "bg-emerald-100", text: "text-emerald-700", route: "/tenders", filter: "bdg-complete" },
                    { label: "Submitted", icon: Send, bg: "bg-violet-100", text: "text-violet-700", route: "/tenders", filter: "submitted" },
                    { label: "Won", icon: Trophy, bg: "bg-green-100", text: "text-green-700", route: "/tenders", filter: "won" },
                    { label: "Lost", icon: ThumbsDown, bg: "bg-red-100", text: "text-red-700", route: "/tenders", filter: "lost" },
                  ].map((status, i) => (
                    <motion.button
                      key={status.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 1.1 + i * 0.05 }}
                      whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
                      onClick={() => navigate(status.route, { state: { activeTab: "matched", filter: status.filter } })}
                      className={`${status.bg} ${status.text} px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:shadow-sm transition-all cursor-pointer`}
                    >
                      <status.icon className="w-3 h-3" />
                      <span>{status.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Eligibility & Submission */}
            <div className="space-y-6">
              {/* Eligibility Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 }
                }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm cursor-pointer relative overflow-hidden group"
              >
                {/* Animated gradient overlay on hover */}
                <motion.div
                  initial={{ opacity: 0, y: "100%" }}
                  whileHover={{ opacity: 0.03, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-violet-600 to-transparent pointer-events-none"
                />
                
                <div className="relative z-10">
                  <h3 className="font-semibold text-gray-900 mb-4">Eligibility Breakdown</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Eligible 100%</span>
                        <span className="font-semibold text-violet-600">64%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "64%" }}
                          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                          className="h-full bg-violet-500 rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Partially (50-70%)</span>
                        <span className="font-semibold text-orange-500">28%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "28%" }}
                          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                          className="h-full bg-orange-500 rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Not Eligible (&lt;50%)</span>
                        <span className="font-semibold text-red-500">8%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "8%" }}
                          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                          className="h-full bg-red-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Submission Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 }
                }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm cursor-pointer relative overflow-hidden group"
              >
                {/* Animated gradient overlay on hover */}
                <motion.div
                  initial={{ opacity: 0, y: "100%" }}
                  whileHover={{ opacity: 0.03, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-violet-600 to-transparent pointer-events-none"
                />
                
                <div className="relative z-10">
                  <h3 className="font-semibold text-gray-900 mb-4">Submission Status</h3>
                  <div className="flex items-center gap-6">
                    <CircularProgress percentage={82} size={90} strokeWidth={8} />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 uppercase">Submitted</span>
                        <span className="font-bold text-gray-900"><AnimatedCounter value={142} /></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 uppercase">Pending</span>
                        <span className="font-bold text-orange-500"><AnimatedCounter value={31} /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

       
          
        </main>
      </div>
    </div>
  );
}