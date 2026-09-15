import React, { useState, useRef } from "react";
import {
  Upload,
  Link as LinkIcon,
  Sparkles,
  X,
  Check,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export interface PresetImage {
  id: string;
  name: string;
  category: "momos" | "soups" | "drinks" | "ambiance";
  url: string;
}

export const MOMO_PHOTO_PRESETS: PresetImage[] = [
  {
    id: "preset-steamed-classic",
    name: "Classic Steamed Momos in Bamboo Steamer",
    category: "momos",
    url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-kurkure-crunch",
    name: "Golden Kurkure Crispy Fried Momos",
    category: "momos",
    url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-jhol-broth",
    name: "Kathmandu Himalayan Jhol Momo in Sesame Broth",
    category: "momos",
    url: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-chilli-garlic",
    name: "Fiery Chilli Garlic Wok-Tossed Momos",
    category: "momos",
    url: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-paneer-cheese",
    name: "Melted Cheese & Herb Stuffed Momos",
    category: "momos",
    url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-tandoori-char",
    name: "Charcoal Clay-Oven Tandoori Momos",
    category: "momos",
    url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-pan-fried-kothey",
    name: "Crispy Bottom Himalayan Kothey Momos",
    category: "momos",
    url: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-gravy-momo",
    name: "Spicy Schezwan Gravy Momos",
    category: "momos",
    url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-thukpa-noodles",
    name: "Himalayan Mountain Vegetable Thukpa",
    category: "soups",
    url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-hot-sour-soup",
    name: "Spicy Tibetan Hot & Sour Soup",
    category: "soups",
    url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-manchow-soup",
    name: "Crispy Wonton Vegetable Manchow Soup",
    category: "soups",
    url: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-fresh-mint-mojito",
    name: "Himalayan Fresh Mint & Lime Cooler",
    category: "drinks",
    url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-mango-lassi",
    name: "Rich Chilled Mango Lassi",
    category: "drinks",
    url: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-iced-tea",
    name: "Darjeeling Mountain Lemon Iced Tea",
    category: "drinks",
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-kitchen-steamer",
    name: "Handcrafted Momo Making & Bamboo Steamers",
    category: "ambiance",
    url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-street-wok",
    name: "Fiery Street Food Wok Toss & Spices",
    category: "ambiance",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-dining-ambiance",
    name: "Warm Asian Street Food Restaurant Vibes",
    category: "ambiance",
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "preset-dumpling-prep",
    name: "Fresh Dough Kneading & Handcrafting Momos",
    category: "ambiance",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
  },
];

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
  title?: string;
  description?: string;
  onSelectImage: (newImageUrl: string) => Promise<void> | void;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  currentImage = "",
  title = "Change Photo",
  description = "Upload a new photo from your device, choose from our momo library, or enter a URL.",
  onSelectImage,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "presets" | "url">("upload");
  const [selectedUrl, setSelectedUrl] = useState<string>(currentImage);
  const [customUrlInput, setCustomUrlInput] = useState<string>(currentImage);
  const [presetCategory, setPresetCategory] = useState<string>("all");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Compress & convert file to optimized base64 Data URL using HTML5 canvas
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas context unavailable");

          // Cap dimensions at 1200px while maintaining aspect ratio
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Export as optimized JPEG (0.85 quality)
          const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setSelectedUrl(optimizedDataUrl);
          setIsProcessing(false);
        } catch (err) {
          // Fallback to original data URL if canvas fails
          setSelectedUrl(String(e.target?.result || ""));
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setErrorMessage("Could not load the selected image file.");
        setIsProcessing(false);
      };
      img.src = String(e.target?.result);
    };
    reader.onerror = () => {
      setErrorMessage("Error reading file from disk.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) {
      setErrorMessage("Please enter an image URL.");
      return;
    }
    setErrorMessage(null);
    setSelectedUrl(customUrlInput.trim());
  };

  const handleSave = async () => {
    if (!selectedUrl) {
      setErrorMessage("Please select or upload an image first.");
      return;
    }
    setIsProcessing(true);
    try {
      await onSelectImage(selectedUrl);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredPresets =
    presetCategory === "all"
      ? MOMO_PHOTO_PRESETS
      : MOMO_PHOTO_PRESETS.filter((p) => p.category === presetCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">{title}</h3>
              <p className="text-xs text-neutral-400">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-4 border-b border-neutral-800 flex items-center gap-2 bg-neutral-950/30">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 flex items-center gap-2 transition ${
              activeTab === "upload"
                ? "border-amber-500 text-amber-400 bg-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload from Device</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("presets")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 flex items-center gap-2 transition ${
              activeTab === "presets"
                ? "border-amber-500 text-amber-400 bg-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Momo Library Presets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 flex items-center gap-2 transition ${
              activeTab === "url"
                ? "border-amber-500 text-amber-400 bg-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Paste Web URL</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: UPLOAD FROM DEVICE */}
          {activeTab === "upload" && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                  dragActive
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-neutral-700 hover:border-amber-500/60 bg-neutral-950/40 hover:bg-neutral-950/60"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-500 shadow-inner">
                  {isProcessing ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Click to select from Computer or Phone
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Or drag and drop your image file here (JPG, PNG, WebP)
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-neutral-700 transition pointer-events-none"
                >
                  Browse Device Files
                </button>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>⚡ Automatically compresses images for lightning-fast website loading</span>
                <span className="font-mono text-amber-400 font-medium">Auto-Optimized</span>
              </div>
            </div>
          )}

          {/* TAB 2: CURATED MOMO PRESETS */}
          {activeTab === "presets" && (
            <div className="space-y-4">
              {/* Category pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "All Photos" },
                  { id: "momos", label: "Momos" },
                  { id: "soups", label: "Soups & Mains" },
                  { id: "drinks", label: "Coolers & Drinks" },
                  { id: "ambiance", label: "Kitchen & Ambiance" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setPresetCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      presetCategory === cat.id
                        ? "bg-amber-600 text-white shadow-md shadow-amber-950/40"
                        : "bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                {filteredPresets.map((preset) => {
                  const isSelected = selectedUrl === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedUrl(preset.url)}
                      className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all aspect-video sm:aspect-square bg-neutral-950 ${
                        isSelected
                          ? "border-amber-500 ring-2 ring-amber-500/30 scale-[0.98]"
                          : "border-neutral-800 hover:border-neutral-600"
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                        <span className="text-[10px] font-medium text-white line-clamp-1 leading-tight">
                          {preset.name}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM IMAGE URL */}
          {activeTab === "url" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Direct Image URL (HTTP / HTTPS)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white border border-neutral-700 transition"
                  >
                    Preview
                  </button>
                </div>
              </div>
              <p className="text-xs text-neutral-500">
                You can paste image links from Unsplash, Google Images, Cloudinary, or any CDN host.
              </p>
            </div>
          )}

          {/* LIVE PREVIEW BOX */}
          <div className="pt-4 border-t border-neutral-800">
            <label className="block text-xs font-bold text-neutral-300 mb-2">
              Selected Photo Preview
            </label>
            {selectedUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 aspect-video max-h-48 shadow-lg flex items-center justify-center">
                <img
                  src={selectedUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                  <Check className="w-3 h-3" />
                  <span>Ready to Apply</span>
                </div>
                {selectedUrl !== currentImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUrl(currentImage);
                      setCustomUrlInput(currentImage);
                    }}
                    className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-neutral-900/80 hover:bg-neutral-800 text-[10px] font-semibold text-neutral-300 border border-neutral-700 transition flex items-center gap-1"
                    title="Reset to current photo"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-6 text-center text-xs text-neutral-500">
                No image selected yet. Select a photo above.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!selectedUrl || isProcessing}
            onClick={handleSave}
            id="modal-apply-photo-btn"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Applying...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save New Photo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
