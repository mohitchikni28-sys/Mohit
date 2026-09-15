import React, { useState } from "react";
import {
  Plus,
  Trash2,
  X,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Camera,
  Upload,
  Edit2,
  Check,
} from "lucide-react";
import { GalleryItem } from "../../types";
import {
  createAdminGalleryItem,
  updateAdminGalleryItem,
  deleteAdminGalleryItem,
} from "../../services/api";
import { ImagePickerModal } from "./ImagePickerModal";

interface AdminGalleryTabProps {
  gallery: GalleryItem[];
  onRefreshData: () => Promise<void>;
}

export const AdminGalleryTab: React.FC<AdminGalleryTabProps> = ({
  gallery,
  onRefreshData,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Dedicated picker states
  const [photoModalTarget, setPhotoModalTarget] = useState<GalleryItem | null>(null);
  const [openPickerForModal, setOpenPickerForModal] = useState<boolean>(false);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setImage("https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop");
    setCaption("");
    setModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setImage(item.image);
    setCaption(item.caption);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateAdminGalleryItem(editingItem.id, {
          image: image.trim(),
          caption: caption.trim() || "Himalayan Flames House of Momo Delicacy",
        });
        showNotification("Gallery photo updated successfully!");
      } else {
        await createAdminGalleryItem({
          image: image.trim(),
          caption: caption.trim() || "Himalayan Flames House of Momo Delicacy",
          active: true,
          displayOrder: gallery.length + 1,
        });
        showNotification("New photo added to gallery!");
      }
      await onRefreshData();
      setModalOpen(false);
      setEditingItem(null);
      setImage("");
      setCaption("");
    } catch (err: any) {
      alert(err.message || "Failed to save image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this image from the gallery?")) return;

    try {
      await deleteAdminGalleryItem(id);
      showNotification("Image removed from gallery");
      await onRefreshData();
    } catch (err: any) {
      alert("Failed to delete image");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Gallery Management
          </h2>
          <p className="text-xs text-neutral-400">
            Showcase restaurant ambience, kitchen craftsmanship, and momo dishes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2 self-start cursor-pointer transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-neutral-900/70 border border-neutral-800 overflow-hidden shadow-lg flex flex-col justify-between group hover:border-neutral-700 transition"
          >
            <div className="relative h-48 bg-neutral-950 overflow-hidden">
              <img
                src={item.image}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Hover quick change button */}
              <div
                onClick={() => setPhotoModalTarget(item)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer p-4"
              >
                <span className="px-3.5 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-lg flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span>Change Photo</span>
                </span>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <p className="text-xs text-neutral-300 font-medium line-clamp-2">
                {item.caption || "Himalayan Flames House of Momo Delicacy"}
              </p>

              <div className="flex items-center gap-2 pt-1 border-t border-neutral-800/80">
                <button
                  onClick={() => setPhotoModalTarget(item)}
                  className="flex-1 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white text-xs font-semibold border border-amber-500/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
                  title="Edit Caption"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-neutral-400 transition cursor-pointer"
                  title="Delete Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Photo Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white">
                {editingItem ? "Edit Gallery Photo" : "Add Photo to Gallery"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-neutral-300">
                    Gallery Photo *
                  </label>
                  <button
                    type="button"
                    onClick={() => setOpenPickerForModal(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload or Pick Preset</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    onClick={() => setOpenPickerForModal(true)}
                    className="relative group w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700 shrink-0 cursor-pointer"
                    title="Click to change photo"
                  >
                    <img
                      src={image || "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=200&auto=format&fit=crop"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Camera className="w-4 h-4" />
                    </div>
                  </div>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://... or click Upload / Pick Preset"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Caption / Description
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Fresh Steamed Himalayan Momos with spicy chutney"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !image.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? "Update Photo" : "Add to Gallery"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PHOTO MODAL FOR INDIVIDUAL GALLERY CARD */}
      <ImagePickerModal
        isOpen={photoModalTarget !== null}
        onClose={() => setPhotoModalTarget(null)}
        currentImage={photoModalTarget?.image || ""}
        title="Change Gallery Photo"
        description="Select or upload a new photo from your phone, computer, or momo library."
        onSelectImage={async (newUrl) => {
          if (!photoModalTarget) return;
          try {
            await updateAdminGalleryItem(photoModalTarget.id, { image: newUrl });
            showNotification("Gallery photo updated successfully!");
            await onRefreshData();
          } catch (err: any) {
            alert("Failed to update photo");
          }
        }}
      />

      {/* PICKER FOR ADD/EDIT MODAL */}
      <ImagePickerModal
        isOpen={openPickerForModal}
        onClose={() => setOpenPickerForModal(false)}
        currentImage={image}
        title="Select Gallery Photo"
        description="Choose a photo from your device, pick from momo presets, or paste a link."
        onSelectImage={(newUrl) => {
          setImage(newUrl);
        }}
      />
    </div>
  );
};
