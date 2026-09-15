import React, { useState } from "react";
import {
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  Sparkles,
  Camera,
  UtensilsCrossed,
  Store,
  Layers,
  Search,
  ExternalLink,
} from "lucide-react";
import { MenuItem, MenuCategory, GalleryItem, RestaurantSettings } from "../../types";
import { ImagePickerModal } from "./ImagePickerModal";
import {
  updateAdminMenuItem,
  updateAdminGalleryItem,
  updateAdminSettings,
  createAdminGalleryItem,
  deleteAdminGalleryItem,
} from "../../services/api";

interface AdminMediaTabProps {
  settings: RestaurantSettings;
  menuItems: MenuItem[];
  categories: MenuCategory[];
  gallery: GalleryItem[];
  onRefreshData: () => Promise<void>;
}

type ImageTargetType =
  | { type: "hero" }
  | { type: "about" }
  | { type: "logo" }
  | { type: "menuItem"; item: MenuItem }
  | { type: "galleryItem"; item: GalleryItem }
  | { type: "newGallery" };

export const AdminMediaTab: React.FC<AdminMediaTabProps> = ({
  settings,
  menuItems,
  categories,
  gallery,
  onRefreshData,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<ImageTargetType | null>(null);
  const [activeSection, setActiveSection] = useState<"all" | "banners" | "menu" | "gallery">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleApplyImage = async (newImageUrl: string) => {
    if (!selectedTarget) return;

    if (selectedTarget.type === "hero") {
      await updateAdminSettings({ ...settings, heroImage: newImageUrl });
      showNotification("Hero banner photo updated successfully!");
    } else if (selectedTarget.type === "about") {
      await updateAdminSettings({ ...settings, aboutImage: newImageUrl });
      showNotification("About section Himalayan kitchen photo updated successfully!");
    } else if (selectedTarget.type === "logo") {
      await updateAdminSettings({ ...settings, logo: newImageUrl });
      showNotification("Brand logo photo updated successfully!");
    } else if (selectedTarget.type === "menuItem") {
      await updateAdminMenuItem(selectedTarget.item.id, { image: newImageUrl });
      showNotification(`Updated photo for "${selectedTarget.item.name}"!`);
    } else if (selectedTarget.type === "galleryItem") {
      await updateAdminGalleryItem(selectedTarget.item.id, { image: newImageUrl });
      showNotification("Gallery photo updated successfully!");
    } else if (selectedTarget.type === "newGallery") {
      await createAdminGalleryItem({
        image: newImageUrl,
        caption: "Himalayan Flames House of Momo Delicacy",
        active: true,
        displayOrder: gallery.length + 1,
      });
      showNotification("New photo added to gallery!");
    }

    await onRefreshData();
    setSelectedTarget(null);
  };

  // Filtered menu items for search
  const filteredMenuItems = menuItems.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGallery = gallery.filter((g) =>
    g.caption.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentTargetImage = (): string => {
    if (!selectedTarget) return "";
    switch (selectedTarget.type) {
      case "hero":
        return settings.heroImage || "";
      case "about":
        return settings.aboutImage || "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=900&auto=format&fit=crop";
      case "logo":
        return settings.logo || "";
      case "menuItem":
        return selectedTarget.item.image;
      case "galleryItem":
        return selectedTarget.item.image;
      case "newGallery":
        return "";
    }
  };

  const getCurrentTargetTitle = (): string => {
    if (!selectedTarget) return "Change Photo";
    switch (selectedTarget.type) {
      case "hero":
        return "Change Hero Showcase Photo";
      case "about":
        return "Change Himalayan Kitchen (About) Photo";
      case "logo":
        return "Change Restaurant Logo";
      case "menuItem":
        return `Change Photo for "${selectedTarget.item.name}"`;
      case "galleryItem":
        return `Change Gallery Photo`;
      case "newGallery":
        return "Add New Photo to Gallery";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Camera className="w-6 h-6 text-amber-500" />
            <span>All Website Photos & Media Manager</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Change, upload or customize every single picture on the restaurant website from one place.
          </p>
        </div>

        <button
          onClick={() => setSelectedTarget({ type: "newGallery" })}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2 self-start cursor-pointer transition active:scale-95"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Gallery Photo</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl bg-neutral-900/80 border border-neutral-800">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "all", label: "All Images", icon: Layers },
            { id: "banners", label: "Website Banners & B-Roll", icon: Store },
            { id: "menu", label: `Menu Dishes (${menuItems.length})`, icon: UtensilsCrossed },
            { id: "gallery", label: `Gallery (${gallery.length})`, icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  isActive
                    ? "bg-amber-600 text-white shadow-md shadow-amber-950/40"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search dish or photo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* 1. WEBSITE BANNERS & BRAND IMAGES */}
      {(activeSection === "all" || activeSection === "banners") && !searchQuery && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
            <Store className="w-4 h-4" />
            <span>1. Website Banners & Story Showcase</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Hero Main Banner */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Hero Food Showcase</span>
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Front Header
                  </span>
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-video bg-neutral-950 border border-neutral-800">
                  <img
                    src={settings.heroImage}
                    alt="Hero Banner"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <p className="text-[11px] text-neutral-400">
                  The primary food visual that appears when visitors land on the website.
                </p>
              </div>

              <button
                onClick={() => setSelectedTarget({ type: "hero" })}
                className="mt-4 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Change Hero Photo</span>
              </button>
            </div>

            {/* About / Himalayan Kitchen Banner */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Himalayan Kitchen Photo</span>
                  <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                    About Section
                  </span>
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-video bg-neutral-950 border border-neutral-800">
                  <img
                    src={
                      settings.aboutImage ||
                      "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=900&auto=format&fit=crop"
                    }
                    alt="About Section Kitchen"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <p className="text-[11px] text-neutral-400">
                  Displays in the "About Us & Himalayan Heritage" section.
                </p>
              </div>

              <button
                onClick={() => setSelectedTarget({ type: "about" })}
                className="mt-4 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-bold text-xs border border-neutral-700 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Change About Photo</span>
              </button>
            </div>

            {/* Logo / Brand Emblem */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Brand Logo / Avatar</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Branding
                  </span>
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-video bg-neutral-950 border border-neutral-800 flex items-center justify-center p-3">
                  <img
                    src={settings.logo}
                    alt="Logo"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>
                <p className="text-[11px] text-neutral-400">
                  Square/circle emblem displayed in social previews and schema data.
                </p>
              </div>

              <button
                onClick={() => setSelectedTarget({ type: "logo" })}
                className="mt-4 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-bold text-xs border border-neutral-700 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Change Brand Logo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MENU ITEMS IMAGES */}
      {(activeSection === "all" || activeSection === "menu") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
              <UtensilsCrossed className="w-4 h-4" />
              <span>2. Menu Dish Photos ({filteredMenuItems.length})</span>
            </div>
            <span className="text-[11px] text-neutral-400">
              Click "Change Photo" on any dish to upload or pick a picture
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMenuItems.map((item) => {
              const category = categories.find((c) => c.id === item.categoryId);
              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden flex flex-col justify-between group hover:border-neutral-700 transition"
                >
                  <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/20" />

                    {/* Price badge */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-amber-400 font-bold text-xs border border-amber-500/30">
                      ₹{item.price}
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-md text-[10px] font-semibold text-neutral-300 border border-neutral-700">
                      {category?.name || "Dish"}
                    </div>

                    {/* Quick hover trigger */}
                    <div
                      onClick={() => setSelectedTarget({ type: "menuItem", item })}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer p-2"
                    >
                      <span className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        {item.description || "Authentic freshly prepared recipe"}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedTarget({ type: "menuItem", item })}
                      className="w-full py-2 rounded-xl bg-neutral-800/80 hover:bg-amber-600 text-neutral-300 hover:text-white font-semibold text-xs border border-neutral-700/80 hover:border-amber-500 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change Dish Image</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. GALLERY & AMBIANCE PHOTOS */}
      {(activeSection === "all" || activeSection === "gallery") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
              <ImageIcon className="w-4 h-4" />
              <span>3. Gallery & Kitchen Ambiance Photos ({filteredGallery.length})</span>
            </div>
            <button
              onClick={() => setSelectedTarget({ type: "newGallery" })}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden flex flex-col justify-between group hover:border-neutral-700 transition"
              >
                <div className="relative aspect-video bg-neutral-950 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-neutral-300 font-medium line-clamp-2">
                    {item.caption || "Himalayan Flames Delicacy"}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTarget({ type: "galleryItem", item })}
                      className="flex-1 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white font-bold text-xs border border-amber-500/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm("Remove this photo from the gallery?")) {
                          await deleteAdminGalleryItem(item.id);
                          showNotification("Gallery photo deleted.");
                          await onRefreshData();
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 text-xs border border-neutral-700 transition"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POPUP IMAGE PICKER MODAL */}
      <ImagePickerModal
        isOpen={selectedTarget !== null}
        onClose={() => setSelectedTarget(null)}
        currentImage={getCurrentTargetImage()}
        title={getCurrentTargetTitle()}
        description="Choose a picture from your phone/computer, pick from our curated momo photo library, or paste any web link."
        onSelectImage={handleApplyImage}
      />
    </div>
  );
};
