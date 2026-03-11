import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/useLogout";
import { motion } from "motion/react";
import {
  Search,
  Calendar,
  Building2,
  TrendingUp,
  AlertCircle,
  Clock,
  ChevronDown,
  BarChart3,
  FileText,
  LayoutGrid,
  List,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Bookmark,
  LayoutDashboard,
  Settings,
  Bell,
  ChevronUp
} from "lucide-react";
import { getMatchedBids, getAllTenders, BidResult, TenderResult } from "../api/bids";
import {
  FilterBar,
  HeaderWithNotifications,
  CompanyInfoPopup,
  SharedSidebar,
  sampleNotifications,
  Notification,
  CompanyInfo
} from "../components/SharedComponents";

interface Tender {
  id: string;
  tenderNumber: string;
  buyerName: string;
  organization: string;
  ministry: string;
  location: string;
  quantity: string;
  tenderValue: string;
  submissionDate: string;
  postedDate: string;
  timeAgo: string;
  status: "past-24hrs" | "active" | "closing-soon" | "expired";
  category: string;
  matchPercentage: number;
  items: string;
  rawBid: any;
  _rawEndDate: number;
  _rawStartDate: number;
}

/**
 * Parses API date correctly to support status calculations.
 */
function parseApiDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;

  // Try DD-MM-YYYY HH:MM AM/PM format (e.g. "30-01-2026 6:00 PM")
  const match = dateStr.match(/^(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    const [, day, month, year, hourStr, minute, ampm] = match;
    let hour = parseInt(hourStr, 10);
    if (ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
    if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour, parseInt(minute));
  }

  // Early ISO formats or others
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? null : fallback;
}

export function TenderListing() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<"all" | "matched">("matched");
  const LIMIT = 10;

  // --- All Tenders tab state ---
  const [allTenders, setAllTenders] = useState<Tender[]>([]);
  const [allCurrentPage, setAllCurrentPage] = useState(1);
  const [allTotalPages, setAllTotalPages] = useState(1);
  const [allLoading, setAllLoading] = useState(false);
  const [allError, setAllError] = useState<string | null>(null);

  // --- Matched (My) Tenders tab state ---
  const [matchedTenders, setMatchedTenders] = useState<Tender[]>([]);
  const [matchedLoading, setMatchedLoading] = useState(false);
  const [matchedError, setMatchedError] = useState<string | null>(null);

  // --- Shared filter / UI state ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedMinistry, setSelectedMinistry] = useState<string>("all");
  const [selectedBuyer, setSelectedBuyer] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("posted-date-desc");
  const [showDailySummary, setShowDailySummary] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // --- Saved Tenders State ---
  const [savedTendersMap, setSavedTendersMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("savedTenders");
      if (saved) {
        const parsed: Tender[] = JSON.parse(saved);
        const map: Record<string, boolean> = {};
        parsed.forEach(t => map[t.id] = true);
        setSavedTendersMap(map);
      }
    } catch (e) {
      console.error("Failed to load saved tenders:", e);
    }
  }, []);

  const toggleSaveTender = (e: React.MouseEvent, tender: Tender) => {
    e.stopPropagation();
    try {
      const currentSavedStr = localStorage.getItem("savedTenders");
      let currentSaved: Tender[] = currentSavedStr ? JSON.parse(currentSavedStr) : [];
      let newMap = { ...savedTendersMap };

      if (newMap[tender.id]) {
        // Remove from saved
        currentSaved = currentSaved.filter(t => t.id !== tender.id);
        delete newMap[tender.id];
      } else {
        // Add to saved
        currentSaved.push(tender);
        newMap[tender.id] = true;
      }

      localStorage.setItem("savedTenders", JSON.stringify(currentSaved));
      setSavedTendersMap(newMap);
    } catch (err) {
      console.error("Failed to toggle save tender:", err);
    }
  };

  /** Helper: compute tender status from parsed dates */
  function computeStatus(startDate: Date | null, endDate: Date | null): Tender["status"] {
    const now = new Date();
    let status: Tender["status"] = "active";
    if (endDate) {
      const daysDiff = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      if (daysDiff < 0) status = "expired";
      else if (daysDiff <= 3) status = "closing-soon";
    }
    if (startDate && status !== "expired" && status !== "closing-soon") {
      const hoursDiff = (now.getTime() - startDate.getTime()) / (1000 * 3600);
      if (hoursDiff >= 0 && hoursDiff <= 24) status = "past-24hrs";
    }
    return status;
  }

  /** Map a TenderResult (all-tenders API) to the frontend Tender shape */
  function mapTenderResult(t: TenderResult): Tender {
    const endDate = parseApiDate(t.endDate);
    const startDate = parseApiDate(t.startDate);
    return {
      id: String(t.id),
      tenderNumber: t.bidNumber,
      buyerName: t.departmentName || t.organisationName || "Unknown Buyer",
      organization: t.organisationName || "Unknown Organization",
      ministry: t.ministryName || "Unknown Ministry",
      location: "Pan India",
      quantity: t.quantity ? `${t.quantity} units` : "TBA",
      tenderValue: "TBA",
      submissionDate: endDate ? endDate.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
      postedDate: startDate ? startDate.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
      timeAgo: startDate ? "Recently" : "N/A",
      status: computeStatus(startDate, endDate),
      category: t.items?.substring(0, 40) || "General",
      matchPercentage: 0,
      items: t.items || "N/A",
      rawBid: t,
      _rawEndDate: endDate ? endDate.getTime() : 0,
      _rawStartDate: startDate ? startDate.getTime() : 0,
    };
  }

  /** Map a BidResult (matched-bids API) to the frontend Tender shape */
  function mapBidResult(bid: BidResult): Tender {
    const endDate = parseApiDate(bid.endDate);
    const startDate = parseApiDate(bid.startDate);
    return {
      id: String(bid.id),
      tenderNumber: bid.bidNumber,
      buyerName: bid.department || bid.organization || "Unknown Buyer",
      organization: bid.organization || "Unknown Organization",
      ministry: bid.ministry || "Unknown Ministry",
      location: "Pan India",
      quantity: bid.quantity ? `${bid.quantity} units` : "TBA",
      tenderValue: "TBA",
      submissionDate: endDate ? endDate.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
      postedDate: startDate ? startDate.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
      timeAgo: startDate ? "Recently" : "N/A",
      status: computeStatus(startDate, endDate),
      category: bid.matchedKeyword || bid.items?.substring(0, 30) || "General",
      matchPercentage: Math.min(100, Math.round((bid.finalScore || 0) * 5) || 50),
      items: bid.items || "N/A",
      rawBid: bid,
      _rawEndDate: endDate ? endDate.getTime() : 0,
      _rawStartDate: startDate ? startDate.getTime() : 0,
    };
  }

  // ── Fetch All Tenders (paginated) ──
  useEffect(() => {
    if (activeTab !== "all") return;
    const fetchAll = async () => {
      setAllLoading(true);
      setAllError(null);
      try {
        const res = await getAllTenders(allCurrentPage, LIMIT);
        setAllTenders((res.data || []).map(mapTenderResult));
        setAllTotalPages(res.totalPages || Math.ceil(res.total / LIMIT) || 1);
      } catch (err) {
        console.error("Failed to fetch all tenders", err);
        setAllError("Failed to load tenders. Please try again.");
      } finally {
        setAllLoading(false);
      }
    };
    fetchAll();
  }, [activeTab, allCurrentPage]);

  // ── Fetch Matched (My) Tenders ──
  useEffect(() => {
    if (activeTab !== "matched") return;
    if (matchedTenders.length > 0) return;
    const fetchMatched = async () => {
      setMatchedLoading(true);
      setMatchedError(null);
      try {
        const bids = await getMatchedBids();
        setMatchedTenders(bids.map(mapBidResult));
      } catch (err) {
        console.error("Failed to fetch matched bids", err);
        setMatchedError("Failed to load your matched tenders. Please try again.");
      } finally {
        setMatchedLoading(false);
      }
    };
    fetchMatched();
  }, [activeTab]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "past-24hrs":
        return { label: "New (24hrs)", bg: "bg-green-100", text: "text-green-700", border: "border-green-200" };
      case "active":
        return { label: "Live", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" };
      case "closing-soon":
        return { label: "Closing Soon", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" };
      case "expired":
        return { label: "Expired", bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
      default:
        return { label: "Unknown", bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  // ── Derived: pick the right dataset for the active tab ──
  const tenders = activeTab === "all" ? allTenders : matchedTenders;
  const isLoading = activeTab === "all" ? allLoading : matchedLoading;
  const error = activeTab === "all" ? allError : matchedError;

  // Get unique ministries and buyers from active dataset
  const ministries = ["all", ...Array.from(new Set(tenders.map(t => t.ministry)))];
  const buyers = ["all", ...Array.from(new Set(tenders.map(t => t.organization)))];

  // Filter tenders (client-side for current page data)
  const filteredTenders = tenders.filter(tender => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      tender.category.toLowerCase().includes(q) ||
      tender.buyerName.toLowerCase().includes(q) ||
      tender.tenderNumber.toLowerCase().includes(q) ||
      tender.ministry.toLowerCase().includes(q) ||
      tender.organization.toLowerCase().includes(q) ||
      tender.location.toLowerCase().includes(q);
    const matchesStatus = selectedStatus === "all" || tender.status === selectedStatus;
    const matchesMinistry = selectedMinistry === "all" || tender.ministry === selectedMinistry;
    const matchesBuyer = selectedBuyer === "all" || tender.organization === selectedBuyer;

    return matchesSearch && matchesStatus && matchesMinistry && matchesBuyer;
  }).sort((a, b) => {
    switch (sortOption) {
      case "posted-date-desc":
        return b._rawStartDate - a._rawStartDate;
      case "posted-date-asc":
        return a._rawStartDate - b._rawStartDate;
      case "submission-date-asc":
        return a._rawEndDate - b._rawEndDate;
      case "submission-date-desc":
        return b._rawEndDate - a._rawEndDate;
      default:
        return 0;
    }
  });

  // Daily Summary Stats (from matched tenders only)
  const past24HoursTenders = matchedTenders.filter(t => t.status === "past-24hrs");
  const avgMatchPercentage = past24HoursTenders.length > 0
    ? past24HoursTenders.reduce((sum, t) => sum + t.matchPercentage, 0) / past24HoursTenders.length
    : 0;
  const topMinistry = past24HoursTenders.length > 0
    ? past24HoursTenders.reduce((acc, t) => {
      acc[t.ministry] = (acc[t.ministry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
    : {};
  const mostActiveMinistry = Object.entries(topMinistry).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  useEffect(() => {
    if (location.state && location.state.filter) {
      setSelectedStatus(location.state.filter as string);
    }
    // Handle activeTab from navigation state (when clicking sidebar submenu)
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab as "all" | "matched");
    }
  }, [location.state]);

  const handleTabChange = (tab: "all" | "matched") => {
    setActiveTab(tab);
    if (tab === "all") setAllCurrentPage(1);
    setSelectedStatus("all");
    setSelectedMinistry("all");
    setSelectedBuyer("all");
    setSearchQuery("");
    setShowDailySummary(false);
  };

  const { user } = useAuth();
  const initials = user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleLogout = useLogout();

  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Company Info state
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);
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

  // Clear filters handler
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedMinistry("all");
    setSelectedBuyer("all");
    setShowDailySummary(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Sidebar Navigation with Tenders Dropdown */}
      <SharedSidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        companyName={companyInfo.name}
        onCompanyClick={() => setShowCompanyInfo(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-[220px]">
        {/* Header with Notifications */}
        <HeaderWithNotifications
          title="B2B Tender Insights"
          subtitle="Welcome back, Chief Procurement Officer"
          initials={initials}
          userName={user?.fullName || "Chief Procurement Officer"}
          onProfileClick={() => navigate("/profile")}
          onLogout={handleLogout}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllRead={handleMarkAllRead}
        />

        {/* Page Content */}
        <div className="p-6">
          {/* ── Horizontal Filter Bar ── */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={(value) => {
              setSelectedStatus(value);
              if (value !== "past-24hrs") setShowDailySummary(false);
            }}
            selectedMinistry={selectedMinistry}
            onMinistryChange={setSelectedMinistry}
            ministries={ministries}
            selectedBuyer={selectedBuyer}
            onBuyerChange={setSelectedBuyer}
            buyers={buyers}
            sortOption={sortOption}
            onSortChange={setSortOption}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showDailySummary={showDailySummary}
            onToggleDailySummary={() => setShowDailySummary(!showDailySummary)}
            onClearFilters={handleClearFilters}
          />

          {/* Company Info Popup */}
          <CompanyInfoPopup
            isOpen={showCompanyInfo}
            onClose={() => setShowCompanyInfo(false)}
            company={companyInfo}
          />

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">

          {/* Active filter summary */}
          {(searchQuery || selectedStatus !== "all" || selectedMinistry !== "all" || selectedBuyer !== "all") && (
            <div className="flex justify-between items-center px-1 mb-4">
              <span className="text-sm font-medium text-gray-500">
                Showing matches for your filters ({filteredTenders.length} results)
              </span>
            </div>
          )}

          {/* Daily Summary Component */}
          {showDailySummary && selectedStatus === "past-24hrs" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl shadow-xl p-8 mb-6 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 translate-y-24" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Daily Summary</h2>
                    <p className="text-blue-100 text-sm">Past 24 hours insights</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-100" />
                      <p className="text-blue-100 text-sm">Past 24 Hours</p>
                    </div>
                    <p className="text-4xl font-bold">{past24HoursTenders.length}</p>
                    <p className="text-xs text-blue-100 mt-1">Posted recently</p>
                  </div>

                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-100" />
                      <p className="text-blue-100 text-sm">Avg Match</p>
                    </div>
                    <p className="text-4xl font-bold">{avgMatchPercentage.toFixed(0)}%</p>
                    <p className="text-xs text-blue-100 mt-1">Your compatibility</p>
                  </div>

                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-blue-100" />
                      <p className="text-blue-100 text-sm">Top Ministry</p>
                    </div>
                    <p className="text-lg font-bold leading-tight">{mostActiveMinistry.replace("Ministry of ", "")}</p>
                    <p className="text-xs text-blue-100 mt-1">Most active</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tender Cards */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "space-y-6"}>
            {isLoading ? (
              <div className={`col-span-1 md:col-span-2 bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100 flex flex-col items-center`}>
                <Loader2 className="w-10 h-10 text-indigo-500 mb-4 animate-spin" />
                <p className="text-lg font-semibold text-gray-900 mb-1">Fetching Tenders...</p>
                <p className="text-sm text-gray-500">Connecting to GEM portal and fetching your data</p>
              </div>
            ) : error ? (
              <div className={`col-span-1 md:col-span-2 bg-white rounded-2xl shadow-sm p-12 text-center border border-red-100`}>
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-red-600 mb-1">Error</p>
                <p className="text-sm text-red-500">{error}</p>
              </div>
            ) : filteredTenders.length === 0 ? (
              <div className={`col-span-1 md:col-span-2 bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100`}>
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-1">No tenders found</p>
                <p className="text-sm text-gray-500">Adjust your filters or try a different search</p>
              </div>
            ) : viewMode === "list" ? (
              filteredTenders.map((tender, index) => {
                const statusConfig = getStatusConfig(tender.status);
                return (
                  <motion.div
                    key={`${tender.id}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.3) }}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                  >
                    <div className="flex items-start gap-4 flex-col sm:flex-row">
                      <div className="bg-indigo-500 rounded-xl p-3 flex-shrink-0 mt-1 sm:self-start">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="mb-3">
                              <span className="text-xs font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-2 inline-block">
                                {tender.tenderNumber}
                              </span>
                              <div className="text-[15px] font-extrabold text-emerald-800 line-clamp-1" title={tender.items}>
                                Items: {tender.items}
                              </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">Buyer: {tender.organization}</h3>
                          </div>
                          <span className={`self-start px-3 py-1 ${statusConfig.bg} ${statusConfig.text} text-[11px] font-bold tracking-wide uppercase rounded-lg border ${statusConfig.border}`}>
                            {statusConfig.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pb-6 border-b border-gray-100">
                          <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Keyword</p>
                            <p className="text-sm font-semibold text-gray-900 truncate pr-4" title={tender.category}>{tender.category}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Quantity</p>
                            <p className="text-sm font-semibold text-gray-900">{tender.quantity}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">HSN Code</p>
                            <p className="text-sm font-semibold text-gray-900">{tender.rawBid?.hsnCode?.toString().replace(/\.0$/, "") || "N/A"}</p>
                          </div>

                          <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Submission Date</p>
                            <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                              <Calendar className="w-4 h-4 text-indigo-500" />
                              <p className="text-sm">{tender.submissionDate}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            {tender.status === 'closing-soon' ? (
                              <>
                                <Clock className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-semibold text-amber-500">Closing in 2-3 days</span>
                              </>
                            ) : tender.status === 'active' ? (
                              <>
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-semibold text-blue-500">Open for bidding</span>
                              </>
                            ) : tender.status === 'past-24hrs' ? (
                              <>
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-semibold text-green-500">Recently opened</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-semibold text-gray-500">Bidding closed</span>
                              </>
                            )}
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={(e) => toggleSaveTender(e, tender)}
                              className={`p-2.5 rounded-xl border transition-colors flex shrink-0 items-center justify-center ${savedTendersMap[tender.id]
                                ? "bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100"
                                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                }`}
                              title={savedTendersMap[tender.id] ? "Remove from Saved" : "Save Tender"}
                            >
                              <Bookmark className="w-5 h-5" fill={savedTendersMap[tender.id] ? "currentColor" : "none"} />
                            </button>
                            <button
                              onClick={() => navigate(`/analysis1/${encodeURIComponent(tender.id)}`, { state: { tender } })}
                              className="flex-1 sm:flex-none sm:w-auto bg-[#4F46E5] text-white px-6 py-2.5 rounded-xl hover:bg-[#4338CA] transition-colors font-semibold text-sm shadow-sm flex items-center justify-center gap-2"
                            >
                              View Tender
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              filteredTenders.map((tender, index) => {
                const statusConfig = getStatusConfig(tender.status);
                return (
                  <motion.div
                    key={`${tender.id}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.3) }}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col cursor-pointer group hover:border-indigo-200"
                    onClick={() => navigate(`/analysis1/${encodeURIComponent(tender.id)}`, { state: { tender } })}
                  >
                    <div className="p-5 pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="text-[10px] font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md inline-block mb-1.5">
                            {tender.tenderNumber}
                          </span>
                          <div className="text-[14px] font-extrabold text-emerald-800 line-clamp-1 mt-0.5" title={tender.items}>
                            Items: {tender.items}
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 ${statusConfig.bg} ${statusConfig.text} text-[10px] font-bold uppercase tracking-wider rounded-md border ${statusConfig.border} flex-shrink-0`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex items-start gap-3 mt-1">
                        <div className="bg-indigo-500 rounded-lg p-2.5 flex-shrink-0 shadow-sm shadow-indigo-200">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                            Buyer: {tender.organization}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-4 border-t border-gray-50 bg-gray-50/50 flex-1">
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Keyword</p>
                          <p className="text-xs font-semibold text-gray-800 truncate" title={tender.category}>{tender.category}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Quantity</p>
                          <p className="text-xs font-semibold text-gray-800">{tender.quantity}</p>
                        </div>

                        <div className="pt-2 border-t border-gray-200/60">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">HSN Code</p>
                          <p className="text-xs font-semibold text-gray-800">{tender.rawBid?.hsnCode?.toString().replace(/\.0$/, "") || "N/A"}</p>
                        </div>

                        <div className="pt-2 border-t border-gray-200/60">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Deadline Date</p>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{tender.submissionDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-2xl">
                      <div className="flex items-center gap-1.5">
                        {tender.status === 'closing-soon' && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                        {tender.status === 'active' && <TrendingUp className="w-3.5 h-3.5 text-blue-500" />}
                        {tender.status === 'past-24hrs' && <TrendingUp className="w-3.5 h-3.5 text-green-500" />}
                        {tender.status === 'expired' && <AlertCircle className="w-3.5 h-3.5 text-gray-400" />}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => toggleSaveTender(e, tender)}
                          className={`p-1.5 rounded-lg border transition-colors ${savedTendersMap[tender.id]
                            ? "bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100"
                            : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                            }`}
                          title={savedTendersMap[tender.id] ? "Remove from Saved" : "Save Tender"}
                        >
                          <Bookmark className="w-4 h-4" fill={savedTendersMap[tender.id] ? "currentColor" : "none"} />
                        </button>
                        <span className="text-xs font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors flex items-center gap-1">
                          View Details <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Pagination Controls — only for "All Tenders" tab */}
          {!isLoading && filteredTenders.length > 0 && activeTab === "all" && allTotalPages > 1 && (
            <div className="mt-8 flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
              <button
                onClick={() => setAllCurrentPage(p => Math.max(1, p - 1))}
                disabled={allCurrentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${allCurrentPage === 1
                  ? "text-gray-400 cursor-not-allowed bg-gray-50"
                  : "text-indigo-600 hover:bg-indigo-50"
                  }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="text-sm font-medium text-gray-600">
                Page <span className="font-bold text-gray-900">{allCurrentPage}</span> of <span className="font-bold text-gray-900">{allTotalPages}</span>
              </div>
              <button
                onClick={() => setAllCurrentPage(p => Math.min(allTotalPages, p + 1))}
                disabled={allCurrentPage === allTotalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${allCurrentPage === allTotalPages
                  ? "text-gray-400 cursor-not-allowed bg-gray-50"
                  : "text-indigo-600 hover:bg-indigo-50"
                  }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>{/* end flex-1 main content */}
        </div>{/* end page content padding */}
      </div>{/* end main content area */}
    </div>
  );
}
