import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/useLogout";
import {
  Bookmark,
  Edit3,
  Eye,
  Trash2,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

import {
  HeaderWithNotifications,
  SharedSidebar,
  sampleNotifications,
  Notification,
  CompanyInfoPopup,
  CompanyInfo
} from "../components/SharedComponents";

// Status Badge
function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    draft: "bg-gray-100 text-gray-600",
    submitted: "bg-blue-100 text-blue-600",
    won: "bg-green-100 text-green-600",
    lost: "bg-red-100 text-red-600",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status.toLowerCase()]}`}>
      {status}
    </span>
  );
}

export function SavedBids() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const bidsData = [
    {
      id: "#BD-8821",
      tenderName: "City Smart Grid Expansion",
      organization: "Public Utility Board",
      status: "Draft",
      lastUpdated: "Oct 24, 2023",
    },
    {
      id: "#BD-8750",
      tenderName: "Regional Solar Farm Phase 2",
      organization: "Energy Authority",
      status: "Submitted",
      lastUpdated: "Oct 20, 2023",
    },
    {
      id: "#BD-8612",
      tenderName: "Municipal Waste Management",
      organization: "City Council",
      status: "Won",
      lastUpdated: "Oct 12, 2023",
    },
    {
      id: "#BD-8590",
      tenderName: "Public Library IT Upgrade",
      organization: "State Education Dept",
      status: "Lost",
      lastUpdated: "Sep 28, 2023",
    },
    {
      id: "#BD-8442",
      tenderName: "Bridge Reinforcement Project",
      organization: "Infrastructure Ministry",
      status: "Submitted",
      lastUpdated: "Sep 15, 2023",
    },
  ];

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleLogout = useLogout();

  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

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

        {/* Header */}
        <HeaderWithNotifications
          title="B2B Tender Insights"
          subtitle="Welcome back"
          initials={initials}
          userName={user?.fullName || "Chief Procurement Officer"}
          onProfileClick={() => navigate("/profile")}
          onLogout={handleLogout}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllRead={handleMarkAllRead}
        />

        {/* Page Content */}
        <main className="p-8">
          {/* Company Info Popup */}
          <CompanyInfoPopup
            isOpen={showCompanyInfo}
            onClose={() => setShowCompanyInfo(false)}
            company={companyInfo}
          />

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Saved Bids</h1>
            <p className="text-gray-600 text-sm">
              Manage and track your saved tender applications.
            </p>
          </div>

          {/* Filter Button */}
          <div className="flex justify-end mb-6">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter By Date
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <table className="w-full">

              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Bid ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tender Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Last Updated</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {bidsData.map((bid) => (
                  <tr key={bid.id} className="hover:bg-gray-50">

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {bid.id}
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{bid.tenderName}</p>
                      <p className="text-xs text-gray-500">{bid.organization}</p>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={bid.status} />
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {bid.lastUpdated}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">

                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>

                        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Bookmark className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between">

              <p className="text-xs text-gray-500">
                Showing 1 to 5 of 24 results
              </p>

              <div className="flex items-center gap-1">

                <button className="px-3 py-1 text-xs text-gray-400 flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <button className="w-8 h-8 bg-violet-600 text-white rounded-lg text-xs font-medium">
                  1
                </button>

                <button className="w-8 h-8 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-medium">
                  2
                </button>

                <button className="px-3 py-1 text-xs text-gray-600 flex items-center gap-1">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>
            </div>

          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs text-gray-500 mb-2">Total Bid Value</p>
              <p className="text-3xl font-bold text-gray-900">$2.4M</p>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">+12% from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs text-gray-500 mb-2">Win Rate</p>
              <p className="text-3xl font-bold text-gray-900">68%</p>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">Top 5% in industry</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs text-gray-500 mb-2">Upcoming Deadlines</p>
              <p className="text-3xl font-bold text-gray-900">04</p>
              <div className="flex items-center gap-1 text-orange-600">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Next: 2 days left</span>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default SavedBids;