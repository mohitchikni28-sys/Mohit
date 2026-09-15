import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Flame,
  Sparkles,
  Search,
  DollarSign,
  Layers,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Camera,
  Upload,
} from "lucide-react";
import { MenuItem, MenuCategory } from "../../types";
import {
  createAdminMenuItem,
  updateAdminMenuItem,
  deleteAdminMenuItem,
} from "../../services/api";
import { ImagePickerModal } from "./ImagePickerModal";

interface AdminMenuTabProps {
  items: MenuItem[];
  categories: MenuCategory[];
  onRefreshData: () => Promise<void>;
}

export const AdminMenuTab: React.FC<AdminMenuTabProps> = ({
  items,
  categories,
  onRefreshData,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [photoModalItem, setPhotoModalItem] = useState<MenuItem | null>(null);
  const [photoPickerForModal, setPhotoPickerForModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    categoryId: categories[0]?.id || "cat-momos",
    price: 149,
    description: "",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: false,
    recommended: false,
    active: true,
    displayOrder: 1,
  });

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      categoryId: categories[0]?.id || "cat-momos",
      price: 149,
      description: "",
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop",
      veg: true,
      bestseller: false,
      recommended: false,
      active: true,
      displayOrder: items.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      categoryId: item.categoryId,
      price: item.price,
      description: item.description,
      image: item.image,
      veg: item.veg,
      bestseller: item.bestseller,
      recommended: item.recommended,
      active: item.active,
      displayOrder: item.displayOrder,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingItem) {
        await updateAdminMenuItem(editingItem.id, formData);
        showNotification(`Updated "${formData.name}" successfully!`);
      } else {
        await createAdminMenuItem(formData);
        showNotification(`Added new item "${formData.name}"!`);
      }
      await onRefreshData();
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save menu item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (item: MenuItem) => {
    try {
      await updateAdminMenuItem(item.id, { active: !item.active });
      showNotification(`Item "${item.name}" is now ${!item.active ? "Active" : "Disabled"}`);
      await onRefreshData();
    } catch (err: any) {
      alert("Error toggling active state");
    }
  };

  const handleToggleBestseller = async (item: MenuItem) => {
    try {
      await updateAdminMenuItem(item.id, { bestseller: !item.bestseller });
      await onRefreshData();
    } catch (err: any) {
      alert("Error updating bestseller badge");
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${item.name}"?`)) return;

    try {
      await deleteAdminMenuItem(item.id);
      showNotification(`Deleted "${item.name}"`);
      await onRefreshData();
    } catch (err: any) {
      alert("Error deleting menu item");
    }
  };

  // Filtered items
  const filtered = items.filter((i) => {
    if (selectedCategory !== "all" && i.categoryId !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Menu Item Management
          </h2>
          <p className="text-xs text-neutral-400">
            Control items, prices, descriptions, images and availability in real-time.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          id="admin-add-item-btn"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2 self-start transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Flash feedback toast */}
      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu items..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Categories ({items.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Table / Cards */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (₹)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Highlights</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filtered.map((item) => {
                const cat = categories.find((c) => c.id === item.categoryId);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-neutral-800/30 transition ${
                      !item.active ? "opacity-60 bg-neutral-950/40" : ""
                    }`}
                  >
                    {/* Item Name & Thumb */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => setPhotoModalItem(item)}
                          className="relative group w-10 h-10 rounded-lg overflow-hidden shrink-0 cursor-pointer border border-neutral-800"
                          title="Click to change photo"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover bg-neutral-950"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber-400">
                            <Camera className="w-4 h-4" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.veg ? "bg-emerald-500" : "bg-red-500"
                              }`}
                            />
                            <span>{item.name}</span>
                          </div>
                          <p className="text-[11px] text-neutral-400 line-clamp-1 max-w-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-medium text-neutral-300">
                      {cat?.name || item.categoryId}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-amber-400 text-sm">
                        ₹{item.price}
                      </span>
                    </td>

                    {/* Active Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                          item.active
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                            : "bg-neutral-800 text-neutral-400 border-neutral-700"
                        }`}
                      >
                        {item.active ? "Active" : "Disabled"}
                      </button>
                    </td>

                    {/* Bestseller / Recommended */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleBestseller(item)}
                          className={`p-1 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer transition ${
                            item.bestseller
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "text-neutral-500 hover:text-neutral-400"
                          }`}
                          title="Toggle Bestseller Badge"
                        >
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          <span>Bestseller</span>
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPhotoModalItem(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white text-xs font-semibold border border-amber-500/30 transition cursor-pointer flex items-center gap-1"
                          title="Change Dish Image"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px]">Change Image</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-neutral-400 transition cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white">
                {editingItem ? `Edit: ${editingItem.name}` : "Add New Menu Item"}
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
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Signature Kurkure Cheese Momo"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Price in ₹ (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Authentic ingredients, flavours, chutneys and cooking method..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-neutral-300">
                    Dish Photo
                  </label>
                  <button
                    type="button"
                    onClick={() => setPhotoPickerForModal(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload or Pick Preset</span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => setPhotoPickerForModal(true)}
                    className="relative group w-14 h-14 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-700 shrink-0 cursor-pointer"
                    title="Click to change photo"
                  >
                    <img
                      src={formData.image || "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=200&auto=format&fit=crop"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Camera className="w-4 h-4" />
                    </div>
                  </div>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... or click Upload / Pick Preset"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Checkboxes Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.veg}
                    onChange={(e) => setFormData({ ...formData, veg: e.target.checked })}
                    className="rounded bg-neutral-900 border-neutral-800 text-emerald-600 focus:ring-0"
                  />
                  <span>Pure Veg</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="rounded bg-neutral-900 border-neutral-800 text-amber-600 focus:ring-0"
                  />
                  <span>Bestseller</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.recommended}
                    onChange={(e) => setFormData({ ...formData, recommended: e.target.checked })}
                    className="rounded bg-neutral-900 border-neutral-800 text-amber-600 focus:ring-0"
                  />
                  <span>Chef Pick</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded bg-neutral-900 border-neutral-800 text-emerald-600 focus:ring-0"
                  />
                  <span>Active Live</span>
                </label>
              </div>

              {/* Modal footer */}
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
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Menu Item</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* QUICK PHOTO MODAL FOR INDIVIDUAL ROW */}
      <ImagePickerModal
        isOpen={photoModalItem !== null}
        onClose={() => setPhotoModalItem(null)}
        currentImage={photoModalItem?.image || ""}
        title={photoModalItem ? `Change Photo for "${photoModalItem.name}"` : "Change Photo"}
        description="Upload a photo from your phone/computer, select from momo presets, or paste a link."
        onSelectImage={async (newUrl) => {
          if (!photoModalItem) return;
          try {
            await updateAdminMenuItem(photoModalItem.id, { image: newUrl });
            showNotification(`Updated photo for "${photoModalItem.name}"!`);
            await onRefreshData();
          } catch (err: any) {
            alert("Failed to update photo");
          }
        }}
      />

      {/* PHOTO PICKER FOR ADD/EDIT ITEM MODAL */}
      <ImagePickerModal
        isOpen={photoPickerForModal}
        onClose={() => setPhotoPickerForModal(false)}
        currentImage={formData.image}
        title="Select Dish Photo"
        description="Select or upload a photo to use for this menu item."
        onSelectImage={(newUrl) => {
          setFormData((prev) => ({ ...prev, image: newUrl }));
        }}
      />
    </div>
  );
};
