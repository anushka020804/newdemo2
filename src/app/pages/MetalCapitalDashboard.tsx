import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Building2,
  IndianRupee,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  CreditCard,
  FileText,
  Wallet,
  BarChart3,
  ArrowUpRight,
  AlertCircle,
  Sparkles,
  PiggyBank,
  Receipt,
  Home
} from "lucide-react";

interface Loan {
  id: string;
  contractName: string;
  loanAmount: string;
  disbursedAmount: string;
  remainingAmount: string;
  interestRate: string;
  tenure: string;
  disbursedDate: string;
  nextDueDate: string;
  status: "active" | "pending" | "completed";
}

interface PaymentSchedule {
  id: string;
  dueDate: string;
  principalAmount: string;
  interestAmount: string;
  totalAmount: string;
  status: "paid" | "upcoming" | "overdue";
}

export function MetalCapitalDashboard() {
  const navigate = useNavigate();
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  // Mock data for loans
  const loans: Loan[] = [
    {
      id: "MC-001",
      contractName: "Industrial Valves Supply - Karnataka PWD",
      loanAmount: "₹35,00,000",
      disbursedAmount: "₹35,00,000",
      remainingAmount: "₹28,00,000",
      interestRate: "12.5%",
      tenure: "6 months",
      disbursedDate: "Feb 12, 2026",
      nextDueDate: "Mar 15, 2026",
      status: "active"
    },
    {
      id: "MC-002",
      contractName: "Railway Equipment Supply - Indian Railways",
      loanAmount: "₹25,00,000",
      disbursedAmount: "₹15,00,000",
      remainingAmount: "₹10,00,000",
      interestRate: "11.8%",
      tenure: "4 months",
      disbursedDate: "Feb 3, 2026",
      nextDueDate: "Mar 10, 2026",
      status: "active"
    },
    {
      id: "MC-003",
      contractName: "Steel Components - NHAI Project",
      loanAmount: "₹20,00,000",
      disbursedAmount: "₹20,00,000",
      remainingAmount: "₹0",
      interestRate: "12.0%",
      tenure: "3 months",
      disbursedDate: "Jan 8, 2026",
      nextDueDate: "Completed",
      status: "completed"
    }
  ];

  const paymentSchedule: PaymentSchedule[] = [
    {
      id: "1",
      dueDate: "Mar 15, 2026",
      principalAmount: "₹5,83,333",
      interestAmount: "₹36,458",
      totalAmount: "₹6,19,791",
      status: "upcoming"
    },
    {
      id: "2",
      dueDate: "Mar 10, 2026",
      principalAmount: "₹3,75,000",
      interestAmount: "₹14,750",
      totalAmount: "₹3,89,750",
      status: "upcoming"
    },
    {
      id: "3",
      dueDate: "Feb 15, 2026",
      principalAmount: "₹5,83,333",
      interestAmount: "₹36,458",
      totalAmount: "₹6,19,791",
      status: "paid"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
            Paid
          </span>
        );
      case "upcoming":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200">
            Upcoming
          </span>
        );
      case "overdue":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full border border-red-200">
            Overdue
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                <Building2 className="w-6 h-6 text-amber-600" />
                Metal Capital Dashboard
              </h1>
              <p className="text-sm text-gray-600">Manage your working capital and credit facilities</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md text-sm flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Credit Limit */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Credit Limit</p>
            <p className="text-4xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">₹80L</p>
            <p className="text-xs text-gray-500 mt-2">Approved limit</p>
          </div>

          {/* Available Credit */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Available Credit</p>
            <p className="text-4xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">₹20L</p>
            <p className="text-xs text-gray-500 mt-2">Ready to disburse</p>
          </div>

          {/* Active Loans */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Active Loans</p>
            <p className="text-4xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">2</p>
            <p className="text-xs text-gray-500 mt-2">In progress</p>
          </div>

          {/* Outstanding Amount */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Outstanding Amount</p>
            <p className="text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">₹38L</p>
            <p className="text-xs text-gray-500 mt-2">Total repayable</p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8"
        >
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <ArrowUpRight className="w-5 h-5" />
              <span>Request Disbursement</span>
            </button>
            <button className="bg-white text-amber-600 px-6 py-4 rounded-xl hover:bg-amber-50 transition-all border border-amber-200 flex items-center justify-center gap-2">
              <Receipt className="w-5 h-5" />
              <span>Make Payment</span>
            </button>
            <button className="bg-white text-indigo-600 px-6 py-4 rounded-xl hover:bg-indigo-50 transition-all border border-indigo-200 flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              <span>Download Statement</span>
            </button>
          </div>
        </motion.div>

        {/* Active Loans Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-600" />
            Your Loans
          </h2>

          <div className="space-y-6">
            {loans.map((loan, index) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <PiggyBank className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl">{loan.contractName}</h3>
                          {getStatusBadge(loan.status)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-sm font-mono">{loan.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-xs text-gray-600 mb-1">Loan Amount</p>
                    <p className="text-xl text-amber-700">{loan.loanAmount}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <p className="text-xs text-gray-600 mb-1">Disbursed</p>
                    <p className="text-xl text-green-700">{loan.disbursedAmount}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-xs text-gray-600 mb-1">Outstanding</p>
                    <p className="text-xl text-purple-700">{loan.remainingAmount}</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-xs text-gray-600 mb-1">Interest Rate</p>
                    <p className="text-xl text-blue-700">{loan.interestRate}</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>Disbursed: {loan.disbursedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Tenure: {loan.tenure}</span>
                  </div>
                  {loan.status === "active" && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-green-600" />
                      <span>Next Due: {loan.nextDueDate}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar (for active loans) */}
                {loan.status === "active" && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>Repayment Progress</span>
                      <span>
                        {Math.round(
                          ((parseFloat(loan.loanAmount.replace(/[₹,]/g, "")) -
                            parseFloat(loan.remainingAmount.replace(/[₹,]/g, ""))) /
                            parseFloat(loan.loanAmount.replace(/[₹,]/g, ""))) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.round(
                            ((parseFloat(loan.loanAmount.replace(/[₹,]/g, "")) -
                              parseFloat(loan.remainingAmount.replace(/[₹,]/g, ""))) /
                              parseFloat(loan.loanAmount.replace(/[₹,]/g, ""))) *
                              100
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                {loan.status === "active" && (
                  <div className="flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                      <Receipt className="w-4 h-4" />
                      <span>Make Payment</span>
                    </button>
                    <button className="flex-1 bg-white text-amber-600 px-4 py-2.5 rounded-xl hover:bg-amber-50 transition-all border border-amber-200 flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>Download Statement</span>
                    </button>
                  </div>
                )}

                {loan.status === "completed" && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700">
                      This loan has been fully repaid. Thank you for your timely payments!
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Payment Schedule Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-2xl mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-600" />
            Upcoming Payment Schedule
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Due Date</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Principal</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Interest</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Total Amount</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {paymentSchedule.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{payment.dueDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">{payment.principalAmount}</td>
                    <td className="py-4 px-4 text-sm">{payment.interestAmount}</td>
                    <td className="py-4 px-4 text-sm font-semibold">{payment.totalAmount}</td>
                    <td className="py-4 px-4">{getPaymentStatusBadge(payment.status)}</td>
                    <td className="py-4 px-4">
                      {payment.status === "upcoming" && (
                        <button className="text-amber-600 hover:text-amber-700 text-sm flex items-center gap-1">
                          <Receipt className="w-4 h-4" />
                          Pay Now
                        </button>
                      )}
                      {payment.status === "paid" && (
                        <button className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 translate-y-24" />
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Need Help?
            </h3>
            <p className="text-blue-50 text-lg mb-6">
              Our Metal Capital support team is here to assist you with any questions about your loans, payments, or credit facilities.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                <span>Contact Support</span>
              </button>
              <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2">
                <span>View FAQs</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}