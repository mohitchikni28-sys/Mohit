import React, { useState } from "react";
import {
  ShoppingBag,
  Clock,
  Phone,
  MessageSquare,
  IndianRupee,
  CheckCircle2,
  Calendar,
  Search,
} from "lucide-react";
import { OrderInquiry } from "../../types";
import { updateAdminOrderStatus } from "../../services/api";

interface AdminOrdersTabProps {
  orders: OrderInquiry[];
  onRefreshData: () => Promise<void>;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({ orders, onRefreshData }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: "New" | "Contacted" | "Completed" | "Cancelled"
  ) => {
    try {
      await updateAdminOrderStatus(orderId, newStatus);
      showNotification(`Order status updated to ${newStatus}`);
      await onRefreshData();
    } catch (err: any) {
      alert("Failed to update order status");
    }
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.customerName.toLowerCase().includes(q) ||
        o.phone?.toLowerCase().includes(q) ||
        o.notes?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
          Orders & WhatsApp Enquiries
        </h2>
        <p className="text-xs text-neutral-400">
          Track pickup and dine-in pre-orders submitted through the digital cart.
        </p>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, or notes..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Statuses ({orders.length})</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 px-4 bg-neutral-900/30 rounded-2xl border border-dashed border-neutral-800 text-neutral-500 text-xs">
          No order inquiries found matching your filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-md"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display font-bold text-base text-white">
                    {order.customerName}
                  </h3>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                  {order.phone && (
                    <a
                      href={`tel:${order.phone}`}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      {order.phone}
                    </a>
                  )}
                </div>

                {/* Items breakdown */}
                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Ordered Dishes
                  </div>
                  <div className="divide-y divide-neutral-900">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-1 flex items-center justify-between text-xs text-neutral-300"
                      >
                        <div>
                          <span className="font-medium text-white">{item.name}</span>
                          <span className="text-neutral-500 ml-2">× {item.quantity}</span>
                        </div>
                        <span className="font-mono text-amber-400">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                  {order.notes && (
                    <div className="pt-2 text-[11px] text-neutral-400 italic">
                      Special Note: "{order.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Total & Status Selector */}
              <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-800">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Estimated Total
                  </span>
                  <span className="text-xl font-black text-amber-400">₹{order.total}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusUpdate(
                        order.id,
                        e.target.value as "New" | "Contacted" | "Completed" | "Cancelled"
                      )
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                      order.status === "New"
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                        : order.status === "Contacted"
                        ? "bg-blue-950/80 text-blue-300 border-blue-800"
                        : order.status === "Completed"
                        ? "bg-purple-950/80 text-purple-300 border-purple-800"
                        : "bg-neutral-800 text-neutral-400 border-neutral-700"
                    }`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
