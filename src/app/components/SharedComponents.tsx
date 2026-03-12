import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  List,
  LayoutGrid,
  BarChart3,
  Building2,
  FileText,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Info,
  Filter,
  LayoutDashboard,
  Bookmark,
  Settings,
  LogOut,
  User
} from "lucide-react";

// ==================== NOTIFICATION TYPES ====================
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "tender";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// Sample notifications for demo
export const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "tender",
    title: "New Tender Available",
    message: "Ministry of Railways posted a new tender matching your profile",
    time: "5 mins ago",
    read: false
  },
  {
    id: "2",
    type: "warning",
    title: "Tender Closing Soon",
    message: "Tender #GEM/2024/B/1234567 closes in 24 hours",
    time: "1 hour ago",
    read: false
  },
  {
    id: "3",
    type: "success",
    title: "Bid Submitted Successfully",
    message: "Your bid for tender #GEM/2024/B/9876543 was submitted",
    time: "2 hours ago",
    read: true
  },
  {
    id: "4",
    type: "info",
    title: "Profile Update Required",
    message: "Please update your company documents to continue bidding",
    time: "1 day ago",
    read: true
  },
  {
    id: "5",
    type: "tender",
    title: "5 New Tenders Today",
    message: "Check out 5 new tenders matching your HSN codes",
    time: "Today",
    read: false
  }
];

// ==================== NOTIFICATION POPUP ====================
interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function NotificationPopup({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllRead
}: NotificationPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const getIcon = (type: string) => {
    switch (type) {
      case "tender":
        return <FileText className="w-4 h-4 text-indigo-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popupRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              <h3 className="font-bold text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-white text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mark all read */}
          {unreadCount > 0 && (
            <div className="px-5 py-2 border-b border-gray-100 bg-gray-50">
              <button
                onClick={onMarkAllRead}
                className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => onMarkAsRead(notification.id)}
                  className={`px-5 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? "bg-indigo-50/50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      notification.type === "tender" ? "bg-indigo-100" :
                      notification.type === "success" ? "bg-green-100" :
                      notification.type === "warning" ? "bg-amber-100" : "bg-blue-100"
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-semibold text-gray-900 ${!notification.read ? "font-bold" : ""}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <button className="w-full text-center text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition-colors py-1">
              View All Notifications
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==================== COMPANY INFO POPUP ====================
export interface CompanyInfo {
  name: string;
  registrationNumber: string;
  gstNumber: string;
  panNumber: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  hsnCodes: string[];
  status: "verified" | "pending" | "unverified";
}

interface CompanyInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyInfo | null;
}

export function CompanyInfoPopup({ isOpen, onClose, company }: CompanyInfoPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleEditProfile = () => {
    onClose();
    navigate("/profile");
  };

  if (!company) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
          >
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-[#1f7fb3] to-[#0e5a7e] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{company.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        company.status === "verified" ? "bg-green-400/20 text-green-100" :
                        company.status === "pending" ? "bg-amber-400/20 text-amber-100" :
                        "bg-red-400/20 text-red-100"
                      }`}>
                        {company.status === "verified" ? "✓ Verified" : 
                         company.status === "pending" ? "⏳ Pending" : "✗ Unverified"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Registration Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Registration No.</p>
                  <p className="text-sm font-bold text-gray-900">{company.registrationNumber}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">GST Number</p>
                  <p className="text-sm font-bold text-gray-900">{company.gstNumber}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">PAN Number</p>
                  <p className="text-sm font-bold text-gray-900">{company.panNumber}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Contact Person</p>
                  <p className="text-sm font-bold text-gray-900">{company.contactPerson}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Contact Information</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700"><span className="font-semibold">Email:</span> {company.email}</p>
                  <p className="text-sm text-gray-700"><span className="font-semibold">Phone:</span> {company.phone}</p>
                  <p className="text-sm text-gray-700"><span className="font-semibold">Address:</span> {company.address}</p>
                </div>
              </div>

              {/* HSN Codes */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Registered HSN Codes</p>
                <div className="flex flex-wrap gap-2">
                  {company.hsnCodes.map((code, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-lg"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleEditProfile}
                className="px-5 py-2.5 bg-[#1f7fb3] text-white text-sm font-semibold rounded-xl hover:bg-[#1a6a96] transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ==================== FILTER BAR COMPONENT ====================
export interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedMinistry: string;
  onMinistryChange: (value: string) => void;
  ministries: string[];
  selectedBuyer: string;
  onBuyerChange: (value: string) => void;
  buyers: string[];
  sortOption: string;
  onSortChange: (value: string) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  showDailySummary?: boolean;
  onToggleDailySummary?: () => void;
  onClearFilters: () => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedMinistry,
  onMinistryChange,
  ministries,
  selectedBuyer,
  onBuyerChange,
  buyers,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  showDailySummary,
  onToggleDailySummary,
  onClearFilters
}: FilterBarProps) {
  const hasActiveFilters = selectedStatus !== "all" || selectedMinistry !== "all" || selectedBuyer !== "all" || searchQuery;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tenders by buyer, organization, or category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-medium text-gray-700 pr-10 min-w-[140px] cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="past-24hrs">New (24hrs)</option>
            <option value="active">Live</option>
            <option value="closing-soon">Closing Soon</option>
            <option value="expired">Expired</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Ministry Filter */}
        <div className="relative">
          <select
            value={selectedMinistry}
            onChange={(e) => onMinistryChange(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-medium text-gray-700 pr-10 min-w-[160px] max-w-[200px] cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <option value="all">All Ministries</option>
            {ministries.filter(m => m !== "all").map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Buyer Filter */}
        <div className="relative">
          <select
            value={selectedBuyer}
            onChange={(e) => onBuyerChange(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-medium text-gray-700 pr-10 min-w-[140px] max-w-[180px] cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <option value="all">All Buyers</option>
            {buyers.filter(b => b !== "all").map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-medium text-gray-700 pr-10 min-w-[160px] cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <option value="posted-date-desc">Newest First</option>
            <option value="posted-date-asc">Oldest First</option>
            <option value="submission-date-asc">Deadline (Soonest)</option>
            <option value="submission-date-desc">Deadline (Latest)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>

        {/* Daily Summary Toggle (when past-24hrs selected) */}
        {selectedStatus === "past-24hrs" && onToggleDailySummary && (
          <button
            onClick={onToggleDailySummary}
            className="px-4 py-2.5 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-all font-medium flex items-center gap-2 text-sm"
          >
            <BarChart3 className="w-4 h-4" />
            {showDailySummary ? "Hide" : "Show"} Summary
          </button>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2.5 text-sm text-indigo-600 font-semibold hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}

// ==================== HEADER WITH NOTIFICATIONS ====================
interface HeaderWithNotificationsProps {
  title: string;
  subtitle: string;
  initials: string;
  userName?: string;
  onProfileClick: () => void;
  onLogout: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function HeaderWithNotifications({
  title,
  subtitle,
  initials,
  userName = "Manufacturers",
  onProfileClick,
  onLogout,
  notifications,
  onMarkAsRead,
  onMarkAllRead
}: HeaderWithNotificationsProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileDropdown]);

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <NotificationPopup
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              onMarkAsRead={onMarkAsRead}
              onMarkAllRead={onMarkAllRead}
            />
          </div>
          {/* User Avatar with Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <div
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
            >
              <span className="text-white text-sm font-semibold">{initials}</span>
            </div>
            
            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                >
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">{initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                        <p className="text-xs text-gray-500">View Profile</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onProfileClick();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

// ==================== SHARED SIDEBAR COMPONENT ====================
interface SharedSidebarProps {
  activeTab?: "all" | "matched";
  onTabChange?: (tab: "all" | "matched") => void;
  companyName?: string;
  onCompanyClick?: () => void;
}

export function SharedSidebar({ activeTab = "all", onTabChange, companyName, onCompanyClick }: SharedSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isTendersPage = location.pathname === "/tenders";
  
  // Dropdown state - closed by default
  const [tendersExpanded, setTendersExpanded] = useState(false);

  // Keep dropdown open when on tenders page
  useEffect(() => {
    if (isTendersPage) {
      setTendersExpanded(true);
    }
  }, [isTendersPage]);

  const isActive = (path: string) => location.pathname === path;

  const handleTendersClick = () => {
    // Toggle dropdown
    setTendersExpanded(!tendersExpanded);
  };

  const handleSubMenuClick = (tab: "all" | "matched") => {
    if (isTendersPage) {
      // Already on tenders page, just change tab
      if (onTabChange) {
        onTabChange(tab);
      }
    } else {
      // Navigate to tenders page with tab state
      navigate("/tenders", { state: { activeTab: tab } });
    }
  };

  return (
    <div className="w-[220px] bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1f7fb3]">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col justify-center leading-none">
            <h1 className="text-lg font-bold text-[#1f7fb3]">
              OpportunityX
            </h1>
            <p className="text-[11px] text-gray-500 font-medium tracking-wide mt-0.5">
              QuestionPe
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1">
        {/* Dashboard */}
        <button
          onClick={() => {
            navigate("/dashboard");
            setTendersExpanded(false); // Close dropdown when navigating away
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            isActive("/dashboard")
              ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </button>

        {/* Tenders with Dropdown */}
        <div>
          <button
            onClick={handleTendersClick}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isTendersPage
                ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5" />
              Tenders
            </div>
            {tendersExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {/* Sub-menu for Tenders - Shows when expanded */}
          <AnimatePresence>
            {tendersExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-4 mt-1 space-y-1 overflow-hidden"
              >
                <button
                  onClick={() => handleSubMenuClick("all")}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    isTendersPage && activeTab === "all"
                      ? "bg-violet-100 text-violet-700 border-l-4 border-violet-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  All Tenders
                </button>
                <button
                  onClick={() => handleSubMenuClick("matched")}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    isTendersPage && activeTab === "matched"
                      ? "bg-violet-100 text-violet-700 border-l-4 border-violet-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  My Tenders
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Saved */}
        <button
          onClick={() => {
            navigate("/saved-bids");
            setTendersExpanded(false); // Close dropdown when navigating away
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            isActive("/saved-bids")
              ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Bookmark className="w-5 h-5" />
          Saved
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            navigate("/profile");
            setTendersExpanded(false); // Close dropdown when navigating away
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            isActive("/profile")
              ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </nav>

      {/* Company Info at Bottom */}
      {companyName && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onCompanyClick}
            className="flex items-center gap-3 px-4 py-2.2 bg-gradient-to-r from-[#1f7fb3]/10 to-violet-500/10 rounded-xl hover:from-[#1f7fb3]/20 hover:to-violet-500/20 transition-all group w-full"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-[#1f7fb3] to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Company</p>
              <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-700 transition-colors truncate" title={companyName}>{companyName}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          </button>
        </div>
      )}
    </div>
  );
}