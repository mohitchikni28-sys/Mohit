import React, { useState } from "react";
import {
  Star,
  MessageSquarePlus,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  Award,
  Loader2,
  Info,
} from "lucide-react";
import { CustomerReview, RestaurantSettings } from "../types";
import { submitCustomerReview } from "../services/api";

interface ReviewsSectionProps {
  settings: RestaurantSettings;
  reviews: CustomerReview[];
  onReviewSubmitted?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  settings,
  reviews,
  onReviewSubmitted,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !reviewText.trim()) {
      setErrorMessage("Please fill out your name and review.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await submitCustomerReview({
        customerName: customerName.trim(),
        rating,
        review: reviewText.trim(),
        photo: photoUrl.trim() || undefined,
      });

      setSubmitSuccess(true);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSubmitSuccess(false);
    setErrorMessage("");
    setCustomerName("");
    setReviewText("");
    setPhotoUrl("");
    setRating(5);
  };

  return (
    <section id="reviews" className="py-20 bg-neutral-900/40 relative border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Rating Summary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">
              <Award className="w-4 h-4" />
              <span>Verified Patron Experiences</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Customer Love & Reviews
            </h2>
            <p className="text-neutral-400 text-sm mt-2 max-w-xl">
              Authentic reviews from momo lovers across Bapunagar, Ahmedabad. Ranked 4.9★ for hygiene,
              bold flavours, and quick service.
            </p>
          </div>

          {/* Rating Snapshot & Write Review Button */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-lg">
              <div className="text-2xl font-black text-amber-400">{settings.ratingValue}</div>
              <div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div className="text-[11px] text-neutral-400 font-medium mt-0.5">
                  Based on {settings.reviewCount} reviews
                </div>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              id="write-review-btn"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={`p-6 rounded-2xl bg-neutral-950/80 border transition-all duration-300 flex flex-col justify-between ${
                r.featured
                  ? "border-amber-500/50 shadow-lg shadow-amber-950/20"
                  : "border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <div className="space-y-3">
                {/* Rating stars and featured badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= r.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-neutral-700 fill-neutral-800"
                        }`}
                      />
                    ))}
                  </div>
                  {r.featured && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      Featured Review
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed italic">
                  "{r.review}"
                </p>
              </div>

              {/* Author & Verification info */}
              <div className="pt-4 mt-4 border-t border-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-xs text-amber-400">
                    {r.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{r.customerName}</h4>
                    <span className="text-[10px] text-neutral-500">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Write a Review Form */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-5 bg-neutral-900/60 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <MessageSquarePlus className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-base text-white">
                    Share Your Dining Experience
                  </h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {submitSuccess ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-display font-bold text-lg text-white">
                      Thank You For Your Review!
                    </h4>
                    <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                      Your feedback has been submitted to the Himalayan Flames team. To maintain our
                      strict quality standards, new reviews go into our verification panel as{" "}
                      <strong className="text-amber-400">Pending</strong> before appearing publicly.
                    </p>
                    <button
                      onClick={handleCloseModal}
                      className="mt-4 px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Star Rating selector */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-2">
                        Your Rating <span className="text-amber-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1.5 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                star <= (hoverRating || rating)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-neutral-700"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-xs font-bold text-amber-400">
                          {hoverRating || rating} / 5 Stars
                        </span>
                      </div>
                    </div>

                    {/* Customer Name */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Full Name <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Bhavik Patel"
                        id="review-input-name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Review text */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Your Review <span className="text-amber-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="How were the momos, chutneys, flavour, hygiene, or service?"
                        id="review-input-text"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
                      />
                    </div>

                    {/* Optional Photo URL */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Photo URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="https://example.com/my-momo-photo.jpg"
                        id="review-input-photo"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        Note: Reviews are vetted for authentic dining experience by our management
                        team before publishing to maintain community integrity.
                      </span>
                    </div>

                    {errorMessage && (
                      <div className="p-3 rounded-lg bg-red-950/70 border border-red-800 text-red-300 text-xs">
                        {errorMessage}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        id="submit-review-modal-btn"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Submit for Verification</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
