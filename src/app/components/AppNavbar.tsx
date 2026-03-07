import { useNavigate, useLocation } from "react-router";
import {
  Search,
  TrendingUp,
  Sparkles,
  Bookmark,
  LogOut,
  Home,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/useLogout";

export function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const handleLogout = useLogout();

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8 flex-1">
          <h1
            className="text-2xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent shrink-0 cursor-pointer font-bold"
            onClick={() => navigate("/dashboard")}
          >
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

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 border border-red-200 px-3 py-1.5 rounded-lg transition-all hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
          <div
            className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <span className="text-white text-sm font-semibold">{initials}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
