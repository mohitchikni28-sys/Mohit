import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, FolderTree, CheckCircle2, ArrowUpDown, Loader2 } from "lucide-react";
import { MenuCategory, MenuItem } from "../../types";
import {
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "../../services/api";

interface AdminCategoriesTabProps {
  categories: MenuCategory[];
  items: MenuItem[];
  onRefreshData: () => Promise<void>;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  items,
  onRefreshData,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [active, setActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setDisplayOrder(categories.length + 1);
    setActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: MenuCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setDisplayOrder(cat.displayOrder);
    setActive(cat.active);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        await updateAdminCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
          displayOrder: Number(displayOrder),
          active,
        });
        showNotification(`Updated category "${name}"`);
      } else {
        await createAdminCategory({
          name: name.trim(),
          description: description.trim(),
          displayOrder: Number(displayOrder),
          active,
        });
        showNotification(`Created category "${name}"`);
      }
      await onRefreshData();
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (cat: MenuCategory) => {
    try {
      await updateAdminCategory(cat.id, { active: !cat.active });
      showNotification(`Category "${cat.name}" is now ${!cat.active ? "Active" : "Disabled"}`);
      await onRefreshData();
    } catch (err: any) {
      alert("Failed to toggle category active status");
    }
  };

  const handleDelete = async (cat: MenuCategory) => {
    const attachedItems = items.filter((i) => i.categoryId === cat.id);
    if (attachedItems.length > 0) {
      alert(
        `Cannot delete category "${cat.name}" because it still has ${attachedItems.length} menu items attached. Reassign or delete those items first.`
      );
      return;
    }

    if (!window.confirm(`Delete category "${cat.name}"?`)) return;

    try {
      await deleteAdminCategory(cat.id);
      showNotification(`Deleted category "${cat.name}"`);
      await onRefreshData();
    } catch (err: any) {
      alert("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Category Management
          </h2>
          <p className="text-xs text-neutral-400">
            Organize momos and dishes into custom categories and reorder tabs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2 self-start cursor-pointer transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = items.filter((i) => i.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className={`p-5 rounded-2xl bg-neutral-900/70 border ${
                cat.active ? "border-neutral-800" : "border-neutral-800 opacity-60"
              } flex flex-col justify-between space-y-4`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-neutral-500">Order #{cat.displayOrder}</span>
                  <button
                    onClick={() => handleToggleActive(cat)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                      cat.active
                        ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                        : "bg-neutral-800 text-neutral-400 border-neutral-700"
                    }`}
                  >
                    {cat.active ? "Active" : "Disabled"}
                  </button>
                </div>

                <h3 className="font-display font-bold text-base text-white">{cat.name}</h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                  {cat.description || "No description provided."}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-amber-400 font-semibold">{count} Items Assigned</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-neutral-400 transition"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit Category */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white">
                {editingCategory ? `Edit: ${editingCategory.name}` : "New Menu Category"}
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
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kurkure / Crunchy Momos"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Description / Tagline
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Super crunchy double-coated golden crust"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="rounded bg-neutral-900 border-neutral-800 text-emerald-600 focus:ring-0"
                    />
                    <span>Active Live</span>
                  </label>
                </div>
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
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40"
                >
                  {isSubmitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
