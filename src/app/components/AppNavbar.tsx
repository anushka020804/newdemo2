import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Search,
  TrendingUp,
  Sparkles,
  Bookmark,
  LogOut,
  Home,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/useLogout";

export function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const handleLogout = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8 flex-1 min-w-0">
          <h1
            className="text-xl sm:text-2xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent shrink-0 cursor-pointer font-bold"
            onClick={() => navigate("/dashboard")}
          >
            OpportunityX
          </h1>

          {/* Global Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="Search for tenders, HSN codes, keywords, companies..."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate("/tenders", { state: { search: e.currentTarget.value } });
                }
              }}
            />
          </div>

          <nav className="hidden lg:flex items-center gap-6 shrink-0">
            <button
              onClick={() => navigate("/dashboard", { state: { filter: "all" } })}
              className={`transition-colors flex items-center gap-2 ${isActive("/dashboard") ? "text-indigo-600 font-semibold" : "text-gray-700 hover:text-indigo-600"
                }`}
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            {/* <button
              onClick={() => navigate("/tenders", { state: { filter: "all" } })}
              className={`transition-colors flex items-center gap-2 ${
                isActive("/tenders") ? "text-indigo-600 font-semibold" : "text-gray-700 hover:text-indigo-600"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              My Tenders
            </button> */}
            {/* <button
              onClick={() => navigate("/tenders", { state: { filter: "active" } })}
              className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Matched Tenders
            </button> */}
            <button
              onClick={() => navigate("/saved-bids")}
              className={`transition-colors flex items-center gap-2 ${isActive("/saved-bids") ? "text-indigo-600 font-semibold" : "text-gray-700 hover:text-indigo-600"
                }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved Tenders
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2 sm:ml-4">
          <button
            onClick={handleLogout}
            title="Logout"
            className="hidden sm:flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 border border-red-200 px-3 py-1.5 rounded-lg transition-all hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <span className="text-white text-xs sm:text-sm font-semibold">{initials}</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <span className="font-bold text-lg text-gray-900">Menu</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => {
              navigate("/dashboard", { state: { filter: "all" } });
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 ${
              isActive("/dashboard")
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Home className="w-5 h-5" />
            Home
          </button>
          <button
            onClick={() => {
              navigate("/saved-bids");
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 ${
              isActive("/saved-bids")
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Bookmark className="w-5 h-5" />
            Saved Tenders
          </button>
          <button
            onClick={() => {
              navigate("/profile");
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 ${
              isActive("/profile")
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-semibold">{initials}</span>
            </div>
            Profile
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 border border-red-200 px-4 py-3 rounded-xl transition-all hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
