import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import {
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  IndianRupee,
  Building2,
  TrendingUp,
  AlertCircle,
  Clock,
  MapPin,
  ChevronDown,
  Zap,
  BarChart3,
  TrendingDown,
  FileText
} from "lucide-react";

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
}

export function TenderListing() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("past-24hrs");
  const [selectedMinistry, setSelectedMinistry] = useState<string>("all");
  const [selectedBuyer, setSelectedBuyer] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("posted-date-desc");
  const [showDailySummary, setShowDailySummary] = useState(false);

  const tenders: Tender[] = [
    // Past 24 Hours Tenders
    {
      id: "1",
      tenderNumber: "TND-001",
      buyerName: "Karnataka Public Works Department",
      organization: "Karnataka PWD",
      ministry: "Ministry of Road Transport & Highways",
      location: "Karnataka",
      quantity: "5000 units",
      tenderValue: "₹45,00,000",
      submissionDate: "Feb 15, 2026",
      postedDate: "Feb 9, 2026",
      timeAgo: "2 hours ago",
      status: "past-24hrs",
      category: "Industrial Valves",
      matchPercentage: 95
    },
    {
      id: "2",
      tenderNumber: "TND-002",
      buyerName: "Indian Railways - Western Zone",
      organization: "Railway Board",
      ministry: "Ministry of Railways",
      location: "Pan India",
      quantity: "2500 units",
      tenderValue: "₹35,00,000",
      submissionDate: "Feb 20, 2026",
      postedDate: "Feb 9, 2026",
      timeAgo: "8 hours ago",
      status: "past-24hrs",
      category: "Railway Equipment",
      matchPercentage: 88
    },
    // Active Tenders - Ministry of Road Transport
    {
      id: "3",
      tenderNumber: "TND-003",
      buyerName: "National Highways Authority of India",
      organization: "NHAI",
      ministry: "Ministry of Road Transport & Highways",
      location: "Maharashtra",
      quantity: "10000 units",
      tenderValue: "₹82,50,000",
      submissionDate: "Feb 12, 2026",
      postedDate: "Feb 5, 2026",
      timeAgo: "4 days ago",
      status: "active",
      category: "Steel Fasteners",
      matchPercentage: 92
    },
    // Active Tenders - Ministry of Urban Affairs
    {
      id: "4",
      tenderNumber: "TND-004",
      buyerName: "Delhi Metro Rail Corporation",
      organization: "DMRC",
      ministry: "Ministry of Housing & Urban Affairs",
      location: "Delhi NCR",
      quantity: "7500 units",
      tenderValue: "₹62,00,000",
      submissionDate: "Feb 18, 2026",
      postedDate: "Feb 6, 2026",
      timeAgo: "3 days ago",
      status: "active",
      category: "Industrial Valves",
      matchPercentage: 85
    },
    // Closing Soon
    {
      id: "5",
      tenderNumber: "TND-005",
      buyerName: "Gujarat Road Development Corporation",
      organization: "GRDC",
      ministry: "Ministry of Road Transport & Highways",
      location: "Gujarat",
      quantity: "3500 units",
      tenderValue: "₹28,50,000",
      submissionDate: "Feb 10, 2026",
      postedDate: "Jan 20, 2026",
      timeAgo: "20 days ago",
      status: "closing-soon",
      category: "Pipeline Fittings",
      matchPercentage: 78
    },
    {
      id: "6",
      tenderNumber: "TND-006",
      buyerName: "Maharashtra State Electricity Board",
      organization: "MSEB",
      ministry: "Ministry of Power",
      location: "Maharashtra",
      quantity: "3000 units",
      tenderValue: "₹28,00,000",
      submissionDate: "Feb 5, 2026",
      postedDate: "Jan 15, 2026",
      timeAgo: "25 days ago",
      status: "expired",
      category: "Electrical Components",
      matchPercentage: 82
    },
    // New Examples from User Data
    {
      id: "7",
      tenderNumber: "GEM/2025/B/6864306",
      buyerName: "Ministry of Heavy Industries",
      organization: "HMT MACHINE TOOLS LIMITED",
      ministry: "Ministry of Heavy Industries",
      location: "India",
      quantity: "7 units",
      tenderValue: "₹TBA",
      submissionDate: "Dec 19, 2025",
      postedDate: "Nov 07, 2025",
      timeAgo: "2 hours ago",
      status: "past-24hrs",
      category: "DC MAGNET",
      matchPercentage: 38
    },
    {
      id: "8",
      tenderNumber: "GEM/2025/B/7006690",
      buyerName: "Ministry of Chemicals and Fertilizers",
      organization: "NIPER MOHALI",
      ministry: "Ministry of Chemicals and Fertilizers",
      location: "Mohali",
      quantity: "49 units",
      tenderValue: "₹TBA",
      submissionDate: "Jan 06, 2026",
      postedDate: "Dec 16, 2025",
      timeAgo: "1 day ago",
      status: "active",
      category: "Chemical 1, Chemical 2...",
      matchPercentage: 35
    },
    {
      id: "9",
      tenderNumber: "GEM/2025/B/6933082",
      buyerName: "Ministry of Defence",
      organization: "INDIAN AIR FORCE",
      ministry: "Ministry of Defence",
      location: "India",
      quantity: "5 units",
      tenderValue: "₹TBA",
      submissionDate: "Dec 18, 2025",
      postedDate: "Nov 26, 2025",
      timeAgo: "5 days ago",
      status: "active",
      category: "LABEL PRINTER, SPARE TAPE",
      matchPercentage: 26
    },
    {
      id: "10",
      tenderNumber: "GEM/2025/B/6927986",
      buyerName: "Ministry of Petroleum and Natural Gas",
      organization: "HPCL RAJASTHAN REFINERY LIMITED",
      ministry: "Ministry of Petroleum and Natural Gas",
      location: "Rajasthan",
      quantity: "14 units",
      tenderValue: "₹TBA",
      submissionDate: "Dec 16, 2025",
      postedDate: "Nov 25, 2025",
      timeAgo: "10 days ago",
      status: "closing-soon",
      category: "Jib crane installation",
      matchPercentage: 20
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "past-24hrs":
        return { label: "New (24hrs)", bg: "bg-green-100", text: "text-green-700", border: "border-green-200" };
      case "active":
        return { label: "Active", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" };
      case "closing-soon":
        return { label: "Closing Soon", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" };
      case "expired":
        return { label: "Expired", bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
      default:
        return { label: "Unknown", bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  // Get unique ministries and buyers
  const ministries = ["all", ...Array.from(new Set(tenders.map(t => t.ministry)))];
  const buyers = ["all", ...Array.from(new Set(tenders.map(t => t.organization)))];

  // Filter tenders
  const filteredTenders = tenders.filter(tender => {
    const matchesSearch = tender.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.tenderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.ministry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || tender.status === selectedStatus;
    const matchesMinistry = selectedMinistry === "all" || tender.ministry === selectedMinistry;
    const matchesBuyer = selectedBuyer === "all" || tender.organization === selectedBuyer;

    return matchesSearch && matchesStatus && matchesMinistry && matchesBuyer;
  }).sort((a, b) => {
    switch (sortOption) {
      case "posted-date-desc":
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      case "submission-date-asc":
        return new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
      case "ministry-asc":
        return a.ministry.localeCompare(b.ministry);
      case "buyer-asc":
        return a.buyerName.localeCompare(b.buyerName);
      default:
        return 0;
    }
  });

  // Daily Summary Stats
  const past24HoursTenders = tenders.filter(t => t.status === "past-24hrs");
  const totalValue24hrs = past24HoursTenders.reduce((sum, t) =>
    sum + parseFloat(t.tenderValue.replace(/[₹,]/g, "")), 0
  );
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
    // Check if filter is passed from navigation
    if (location.state && location.state.filter) {
      setSelectedStatus(location.state.filter as string);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Browse Tenders
              </h1>
              <p className="text-sm text-gray-600">{filteredTenders.length} tenders available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Layout: Sidebar + Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => {
                    setSelectedStatus("all");
                    setSelectedMinistry("all");
                    setSelectedBuyer("all");
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Filters */}
              <div className="space-y-6">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
                  <div className="space-y-3">
                    {[
                      { id: "all", label: "All" },
                      { id: "past-24hrs", label: "New" },
                      { id: "active", label: "Active" },
                      { id: "closing-soon", label: "Closing Soon" },
                      { id: "expired", label: "Expired" }
                    ].map((status) => (
                      <label key={status.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-4 h-4">
                          <input
                            type="radio"
                            name="status"
                            value={status.id}
                            checked={selectedStatus === status.id}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="peer appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-indigo-600 checked:border-[4px] transition-all cursor-pointer"
                          />
                        </div>
                        <span className={`text-sm ${selectedStatus === status.id ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`}>
                          {status.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Daily Summary Button - Only show when Past 24 Hours is selected */}
                {selectedStatus === "past-24hrs" && (
                  <div>
                    <button
                      onClick={() => setShowDailySummary(!showDailySummary)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all shadow-md flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      {showDailySummary ? "Hide" : "Show"} Daily Summary
                    </button>
                  </div>
                )}

                {/* Ministry Filter */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Filter by Ministry</label>
                  <div className="relative">
                    <select
                      value={selectedMinistry}
                      onChange={(e) => setSelectedMinistry(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10"
                    >
                      <option value="all">All Ministries</option>
                      {ministries.filter(m => m !== "all").map(ministry => (
                        <option key={ministry} value={ministry}>{ministry}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Buyer Filter */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Filter by Buyer</label>
                  <div className="relative">
                    <select
                      value={selectedBuyer}
                      onChange={(e) => setSelectedBuyer(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10"
                    >
                      <option value="all">All Buyers</option>
                      {buyers.filter(b => b !== "all").map(buyer => (
                        <option key={buyer} value={buyer}>{buyer}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Sort By</label>
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10"
                    >
                      <option value="posted-date-desc">Newest First</option>
                      <option value="submission-date-asc">Submission Deadline (Soonest)</option>
                      <option value="ministry-asc">Ministry Name (A-Z)</option>
                      <option value="buyer-asc">Buyer Name (A-Z)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full relative">

            {/* Search Bar & Result Count */}
            <div className="mb-6 sticky top-24 z-40 bg-indigo-50/90 backdrop-blur-md pt-2 pb-2 -mt-2">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tenders by buyer, organization, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm"
                />
              </div>
              <p className="text-sm text-gray-600">Showing <span className="text-indigo-600 font-medium">{filteredTenders.length}</span> tenders</p>
            </div>
            {showDailySummary && selectedStatus === "past-24hrs" && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl shadow-2xl p-8 mb-6 text-white relative overflow-hidden"
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
                      <h2 className="text-2xl">Daily Summary</h2>
                      <p className="text-blue-100 text-sm">Past 24 hours insights</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* New Tenders */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-100" />
                        <p className="text-blue-100 text-sm">Past 24 Hours</p>
                      </div>
                      <p className="text-4xl">{past24HoursTenders.length}</p>
                      <p className="text-xs text-blue-100 mt-1">Posted today</p>
                    </div>

                    {/* Total Value */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                      <div className="flex items-center gap-2 mb-2">
                        <IndianRupee className="w-5 h-5 text-blue-100" />
                        <p className="text-blue-100 text-sm">Total Value</p>
                      </div>
                      <p className="text-4xl">₹{(totalValue24hrs / 100000).toFixed(1)}L</p>
                      <p className="text-xs text-blue-100 mt-1">Combined worth</p>
                    </div>

                    {/* Average Match */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-100" />
                        <p className="text-blue-100 text-sm">Avg Match</p>
                      </div>
                      <p className="text-4xl">{avgMatchPercentage.toFixed(0)}%</p>
                      <p className="text-xs text-blue-100 mt-1">Your compatibility</p>
                    </div>

                    {/* Top Ministry */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-blue-100" />
                        <p className="text-blue-100 text-sm">Top Ministry</p>
                      </div>
                      <p className="text-lg leading-tight">{mostActiveMinistry.replace("Ministry of ", "")}</p>
                      <p className="text-xs text-blue-100 mt-1">Most active</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tender Cards */}
            <div className="space-y-6">
              {filteredTenders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                  <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 mb-2">No tenders found</p>
                  <p className="text-gray-500">Try adjusting your filters or search query</p>
                </div>
              ) : (
                filteredTenders.map((tender, index) => {
                  const statusConfig = getStatusConfig(tender.status);
                  return (
                    <motion.div
                      key={tender.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="bg-indigo-500 rounded-lg p-3 flex-shrink-0 mt-1">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 w-full">
                          {/* Top Bar: Tender # and Badge */}
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md mb-2 inline-block">
                                {tender.tenderNumber}
                              </span>
                              <h3 className="text-lg font-bold text-gray-900 leading-tight">{tender.buyerName}</h3>
                              <p className="text-sm text-gray-500 mt-1">{tender.organization}</p>
                            </div>
                            <span className={`px-4 py-1.5 ${statusConfig.bg} ${statusConfig.text} text-xs font-medium rounded-full border ${statusConfig.border} whitespace-nowrap`}>
                              {statusConfig.label}
                            </span>
                          </div>

                          {/* Middle Data Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pb-6 border-b border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Category</p>
                              <p className="text-sm font-semibold text-gray-900 truncate pr-4" title={tender.category}>{tender.category}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Quantity</p>
                              <p className="text-sm font-semibold text-gray-900">{tender.quantity}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Tender Value</p>
                              <div className="flex items-center gap-1 font-semibold text-gray-900">
                                <IndianRupee className="w-3.5 h-3.5" />
                                <p className="text-sm">{tender.tenderValue}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Submission Date</p>
                              <div className="flex items-center gap-1 font-semibold text-gray-900">
                                <Calendar className="w-3.5 h-3.5" />
                                <p className="text-sm">{tender.submissionDate}</p>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Bar: Status Text and Button */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              {tender.status === 'closing-soon' ? (
                                <>
                                  <Clock className="w-4 h-4 text-amber-500" />
                                  <span className="text-sm font-medium text-amber-500">Closing in 2-3 days</span>
                                </>
                              ) : tender.status === 'active' ? (
                                <>
                                  <TrendingUp className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-medium text-blue-500">Open for bidding</span>
                                </>
                              ) : tender.status === 'past-24hrs' ? (
                                <>
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                  <span className="text-sm font-medium text-green-500">Not yet open for bidding</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-500">Bidding closed</span>
                                </>
                              )}
                            </div>
                            <button
                              onClick={() => navigate(`/analysis1/${tender.id}`)}
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium text-sm shadow-sm hover:shadow"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}