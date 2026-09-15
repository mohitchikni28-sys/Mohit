import React from "react";
import {
  UtensilsCrossed,
  CheckCircle2,
  Clock,
  Star,
  ShoppingBag,
  Sparkles,
  IndianRupee,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { AdminStats, OrderInquiry, CustomerReview } from "../../types";
import { AdminTab } from "./AdminLayout";

interface AdminDashboardTabProps {
  stats: AdminStats;
  recentOrders: OrderInquiry[];
  pendingReviews: CustomerReview[];
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  stats,
  recentOrders,
  pendingReviews,
  onNavigateTab,
}) => {
  const statCards = [
    {
      title: "Total Menu Items",
      value: stats.totalMenuItems,
      subtext: `${stats.activeMenuItems} Active on website`,
      icon: UtensilsCrossed,
      color: "from-blue-600/20 to-blue-900/10 border-blue-800/40 text-blue-400",
      tab: "menu" as AdminTab,
    },
    {
      title: "Active Menu Items",
      value: stats.activeMenuItems,
      subtext: "Currently visible to patrons",
      icon: CheckCircle2,
      color: "from-emerald-600/20 to-emerald-900/10 border-emerald-800/40 text-emerald-400",
      tab: "menu" as AdminTab,
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      subtext: stats.pendingReviews > 0 ? "Requires owner approval" : "All reviews reviewed",
      icon: Clock,
      color: "from-amber-600/20 to-amber-900/10 border-amber-800/40 text-amber-400",
      tab: "reviews" as AdminTab,
      highlight: stats.pendingReviews > 0,
    },
    {
      title: "Approved Reviews",
      value: stats.approvedReviews,
      subtext: "4.9★ Aggregate rating",
      icon: Star,
      color: "from-purple-600/20 to-purple-900/10 border-purple-800/40 text-purple-400",
      tab: "reviews" as AdminTab,
    },
    {
      title: "Total Enquiries",
      value: stats.totalOrders,
      subtext: "WhatsApp orders recorded",
      icon: ShoppingBag,
      color: "from-teal-600/20 to-teal-900/10 border-teal-800/40 text-teal-400",
      tab: "orders" as AdminTab,
    },
    {
      title: "Featured Items",
      value: stats.featuredItems,
      subtext: "Bestsellers & Chef Picks",
      icon: Sparkles,
      color: "from-orange-600/20 to-orange-900/10 border-orange-800/40 text-orange-400",
      tab: "menu" as AdminTab,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/80 via-neutral-900 to-neutral-900 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Operational Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Real-time control over menu prices, customer reviews, WhatsApp inquiries, and restaurant settings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab("menu")}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-md"
          >
            Manage Menu Items →
          </button>
        </div>
      </div>

      {/* 6 Required Dashboard Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.tab)}
              className={`p-5 rounded-2xl bg-neutral-900/70 border ${
                card.highlight ? "border-amber-500 shadow-lg shadow-amber-950/30" : "border-neutral-800/80"
              } hover:border-neutral-700 transition cursor-pointer flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} border`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-extrabold text-white tracking-tight">
                  {card.value}
                </div>
                <div className="text-xs text-neutral-400 mt-1 flex items-center justify-between">
                  <span>{card.subtext}</span>
                  <ArrowRight className="w-3 h-3 text-neutral-600 group-hover:text-amber-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Reviews Alert Banner */}
      {pendingReviews.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {pendingReviews.length} Customer {pendingReviews.length === 1 ? "Review" : "Reviews"} Awaiting Moderation
              </h4>
              <p className="text-xs text-neutral-300">
                New patron reviews are withheld from the public website until you verify and approve them.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("reviews")}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shrink-0 transition"
          >
            Review Now
          </button>
        </div>
      )}

      {/* Recent Orders / Enquiries Snapshot */}
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Recent WhatsApp Order Enquiries
            </h3>
            <p className="text-xs text-neutral-400">
              Inquiries initiated through the customer website order builder
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("orders")}
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            View All Enquiries →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-xs text-neutral-500">
            No order inquiries recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-neutral-800">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{order.customerName}</div>
                  <div className="text-neutral-400 text-[11px]">
                    {order.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  <span className="font-extrabold text-amber-400 text-sm">₹{order.total}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      order.status === "New"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : order.status === "Contacted"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
