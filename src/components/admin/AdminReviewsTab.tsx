import React, { useState } from "react";
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Sparkles,
  Clock,
  ShieldCheck,
  Check,
} from "lucide-react";
import { CustomerReview } from "../../types";
import {
  updateAdminReviewStatus,
  toggleAdminReviewFeatured,
  deleteAdminReview,
} from "../../services/api";

interface AdminReviewsTabProps {
  reviews: CustomerReview[];
  onRefreshData: () => Promise<void>;
}

export const AdminReviewsTab: React.FC<AdminReviewsTabProps> = ({
  reviews,
  onRefreshData,
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<"pending" | "approved" | "rejected">(
    "pending"
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleStatusChange = async (id: string, newStatus: "pending" | "approved" | "rejected") => {
    try {
      await updateAdminReviewStatus(id, newStatus);
      showNotification(`Review marked as ${newStatus}`);
      await onRefreshData();
    } catch (err: any) {
      alert("Failed to update review status");
    }
  };

  const handleToggleFeatured = async (review: CustomerReview) => {
    try {
      await toggleAdminReviewFeatured(review.id, !review.featured);
      showNotification(`Review ${!review.featured ? "featured" : "unfeatured"}`);
      await onRefreshData();
    } catch (err: any) {
      alert("Failed to toggle featured status");
    }
  };

  const handleDelete = async (review: CustomerReview) => {
    if (!window.confirm(`Delete review from "${review.customerName}"?`)) return;

    try {
      await deleteAdminReview(review.id);
      showNotification("Review deleted");
      await onRefreshData();
    } catch (err: any) {
      alert("Failed to delete review");
    }
  };

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const rejectedCount = reviews.filter((r) => r.status === "rejected").length;

  const currentReviews = reviews.filter((r) => r.status === selectedStatusTab);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
          Review Moderation
        </h2>
        <p className="text-xs text-neutral-400">
          Vetting portal for customer reviews. Only approved reviews appear on the live restaurant website.
        </p>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Sub-tabs: Pending, Approved, Rejected */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => setSelectedStatusTab("pending")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedStatusTab === "pending"
              ? "bg-amber-600 text-white shadow"
              : "bg-neutral-900 text-neutral-400 hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Moderation</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              selectedStatusTab === "pending"
                ? "bg-neutral-950 text-amber-300"
                : "bg-neutral-800 text-neutral-300"
            }`}
          >
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setSelectedStatusTab("approved")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedStatusTab === "approved"
              ? "bg-emerald-600 text-white shadow"
              : "bg-neutral-900 text-neutral-400 hover:text-white"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approved Public</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              selectedStatusTab === "approved"
                ? "bg-neutral-950 text-emerald-300"
                : "bg-neutral-800 text-neutral-300"
            }`}
          >
            {approvedCount}
          </span>
        </button>

        <button
          onClick={() => setSelectedStatusTab("rejected")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedStatusTab === "rejected"
              ? "bg-red-700 text-white shadow"
              : "bg-neutral-900 text-neutral-400 hover:text-white"
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Rejected</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              selectedStatusTab === "rejected"
                ? "bg-neutral-950 text-red-300"
                : "bg-neutral-800 text-neutral-300"
            }`}
          >
            {rejectedCount}
          </span>
        </button>
      </div>

      {/* Reviews List */}
      {currentReviews.length === 0 ? (
        <div className="text-center py-16 px-4 bg-neutral-900/30 rounded-2xl border border-dashed border-neutral-800 text-neutral-500 text-xs">
          No reviews in "{selectedStatusTab}" status.
        </div>
      ) : (
        <div className="space-y-3">
          {currentReviews.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= r.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-neutral-700 fill-neutral-800"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="font-bold text-sm text-white">{r.customerName}</span>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>

                  {r.featured && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase border border-amber-500/30">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-300 italic">"{r.review}"</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {r.status !== "approved" && (
                  <button
                    onClick={() => handleStatusChange(r.id, "approved")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                {r.status === "approved" && (
                  <button
                    onClick={() => handleToggleFeatured(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      r.featured
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        : "bg-neutral-800 text-neutral-300 hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{r.featured ? "Unfeature" : "Feature"}</span>
                  </button>
                )}

                {r.status !== "rejected" && (
                  <button
                    onClick={() => handleStatusChange(r.id, "rejected")}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-bold transition cursor-pointer"
                  >
                    Reject
                  </button>
                )}

                <button
                  onClick={() => handleDelete(r)}
                  className="p-1.5 rounded-xl bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-neutral-400 transition cursor-pointer"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
