import React, { useState } from "react";
import {
  Save,
  CheckCircle2,
  Store,
  MapPin,
  Phone,
  MessageSquare,
  Instagram,
  Clock,
  Star,
  DollarSign,
  Image as ImageIcon,
  Loader2,
  Camera,
  Upload,
} from "lucide-react";
import { RestaurantSettings } from "../../types";
import { updateAdminSettings } from "../../services/api";
import { ImagePickerModal } from "./ImagePickerModal";

interface AdminSettingsTabProps {
  settings: RestaurantSettings;
  onRefreshData: () => Promise<void>;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  onRefreshData,
}) => {
  const [formData, setFormData] = useState<RestaurantSettings>({
    ...settings,
    aboutImage: settings.aboutImage || "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=900&auto=format&fit=crop",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [imageModalTarget, setImageModalTarget] = useState<"hero" | "about" | "logo" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateAdminSettings(formData);
      setFeedback("Restaurant settings updated successfully! Website updated immediately.");
      await onRefreshData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      alert("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Restaurant Information & Settings
          </h2>
          <p className="text-xs text-neutral-400">
            Control business profile, phone numbers, WhatsApp, coordinates, and hours.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          id="admin-save-settings-btn"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2 self-start transition cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Publish Changes</span>
            </>
          )}
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. Brand Identity */}
      <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
          <Store className="w-4 h-4" />
          <span>Brand Profile & Identity</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Restaurant Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-1">
            Short Description
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Price Range Display
            </label>
            <input
              type="text"
              value={formData.priceRange}
              onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Rating Score (Out of 5.0)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.ratingValue}
              onChange={(e) =>
                setFormData({ ...formData, ratingValue: Number(e.target.value) || 4.9 })
              }
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Google Reviews Count
            </label>
            <input
              type="number"
              value={formData.reviewCount}
              onChange={(e) =>
                setFormData({ ...formData, reviewCount: Number(e.target.value) || 48 })
              }
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Contact & Social Channels */}
      <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
          <Phone className="w-4 h-4" />
          <span>Contact Channels & WhatsApp</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Calling Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              WhatsApp Number (Country code without +)
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Opening Hours
            </label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-1">
            Instagram URL
          </label>
          <input
            type="url"
            value={formData.instagram}
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* 3. Address & Maps */}
      <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
          <MapPin className="w-4 h-4" />
          <span>Location & Maps Integration</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-1">
            Full Restaurant Address
          </label>
          <textarea
            rows={2}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Google Maps Plus Code
            </label>
            <input
              type="text"
              value={formData.plusCode}
              onChange={(e) => setFormData({ ...formData, plusCode: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Google Maps Navigation Link
            </label>
            <input
              type="url"
              value={formData.googleMapsUrl}
              onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 4. Media & Website Banners */}
      <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
            <ImageIcon className="w-4 h-4" />
            <span>Website Photos & Section Banners</span>
          </div>
          <span className="text-xs text-neutral-400">
            Click any picture to replace with your device photo or presets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Hero Food Banner */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Hero Food Image</span>
              <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                Front Top Banner
              </span>
            </div>
            <div
              onClick={() => setImageModalTarget("hero")}
              className="relative group rounded-xl overflow-hidden aspect-video bg-neutral-900 border border-neutral-800 cursor-pointer"
            >
              <img
                src={formData.heroImage}
                alt="Hero banner"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <span className="px-3 py-1.5 rounded-lg bg-amber-600 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setImageModalTarget("hero")}
              className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold border border-neutral-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload / Pick Hero Image</span>
            </button>
          </div>

          {/* About / Himalayan Kitchen Image */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">About Section Photo</span>
              <span className="text-[10px] text-orange-400 font-semibold px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                Himalayan Story
              </span>
            </div>
            <div
              onClick={() => setImageModalTarget("about")}
              className="relative group rounded-xl overflow-hidden aspect-video bg-neutral-900 border border-neutral-800 cursor-pointer"
            >
              <img
                src={formData.aboutImage}
                alt="About section banner"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <span className="px-3 py-1.5 rounded-lg bg-amber-600 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setImageModalTarget("about")}
              className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold border border-neutral-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload / Pick About Image</span>
            </button>
          </div>

          {/* Brand Logo */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Brand Logo / Emblem</span>
              <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Brand Emblem
              </span>
            </div>
            <div
              onClick={() => setImageModalTarget("logo")}
              className="relative group rounded-xl overflow-hidden aspect-video bg-neutral-900 border border-neutral-800 cursor-pointer flex items-center justify-center p-3"
            >
              <img
                src={formData.logo}
                alt="Brand logo"
                className="max-h-full max-w-full object-contain rounded-lg"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <span className="px-3 py-1.5 rounded-lg bg-amber-600 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change Logo</span>
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setImageModalTarget("logo")}
              className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold border border-neutral-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Brand Logo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Picker Modal for Settings */}
      <ImagePickerModal
        isOpen={imageModalTarget !== null}
        onClose={() => setImageModalTarget(null)}
        currentImage={
          imageModalTarget === "hero"
            ? formData.heroImage
            : imageModalTarget === "about"
            ? formData.aboutImage
            : formData.logo
        }
        title={
          imageModalTarget === "hero"
            ? "Change Hero Section Photo"
            : imageModalTarget === "about"
            ? "Change Himalayan Kitchen (About) Photo"
            : "Change Restaurant Logo"
        }
        description="Select an image file from your device/phone, pick from momo presets, or paste an image link."
        onSelectImage={(newUrl) => {
          if (imageModalTarget === "hero") {
            setFormData((prev) => ({ ...prev, heroImage: newUrl }));
          } else if (imageModalTarget === "about") {
            setFormData((prev) => ({ ...prev, aboutImage: newUrl }));
          } else if (imageModalTarget === "logo") {
            setFormData((prev) => ({ ...prev, logo: newUrl }));
          }
        }}
      />
    </form>
  );
};
