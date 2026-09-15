import React, { useState, useMemo } from "react";
import {
  Search,
  Flame,
  Plus,
  Check,
  Sparkles,
  Award,
  Filter,
  Utensils,
  Leaf,
} from "lucide-react";
import { MenuItem, MenuCategory } from "../types";

interface MenuSectionProps {
  categories: MenuCategory[];
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  cartItemCounts?: Record<string, number>;
  onOpenCart?: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  categories = [],
  items = [],
  onAddToCart,
  cartItemCounts = {},
  onOpenCart = () => {},
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);

  // Filter items dynamically
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategoryId !== "all" && item.categoryId !== selectedCategoryId) {
        return false;
      }
      // Veg filter
      if (vegOnlyFilter && !item.veg) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [items, selectedCategoryId, vegOnlyFilter, searchQuery]);

  // Current category details
  const currentCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <section id="menu" className="py-20 bg-neutral-950 relative">
      {/* Decorative ambient background */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-600/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">
            <Flame className="w-4 h-4" />
            <span>Handcrafted Delicacies</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Our Himalayan Flavours
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-3">
            Steamed, fried, wok-tossed, and coated with our signature crunchy crusts.
            Prepared fresh to order with genuine Himalayan spices.
          </p>
        </div>

        {/* Category Tabs & Search Filter Bar */}
        <div className="space-y-4 mb-10">
          {/* Categories Horizontal Scrolling Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            <button
              onClick={() => setSelectedCategoryId("all")}
              id="menu-category-all"
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategoryId === "all"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-950/40"
                  : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
              }`}
            >
              All Items ({items.length})
            </button>

            {categories.map((category) => {
              const count = items.filter((i) => i.categoryId === category.id).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  id={`menu-category-${category.id}`}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    selectedCategoryId === category.id
                      ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-950/40"
                      : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
                  }`}
                >
                  <span>{category.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategoryId === category.id
                        ? "bg-neutral-950/50 text-white"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar & Veg filter row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800/80">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search momos, kurkure, jhol, noodles, soups..."
                id="menu-search-input"
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Veg Only Toggle */}
            <button
              onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
              id="menu-veg-filter-btn"
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                vegOnlyFilter
                  ? "bg-emerald-950/70 border-emerald-500/80 text-emerald-300"
                  : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-sm border border-emerald-500 flex items-center justify-center p-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span>100% Pure Veg & Paneer</span>
            </button>
          </div>
        </div>

        {/* Category Description Banner if selected */}
        {currentCategory && currentCategory.description && (
          <div className="mb-6 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 flex items-center justify-between text-xs text-neutral-300">
            <span className="font-medium">
              Category: <strong className="text-amber-400">{currentCategory.name}</strong> — {currentCategory.description}
            </span>
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 bg-neutral-900/30 rounded-2xl border border-dashed border-neutral-800">
            <Utensils className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-300">No momos or dishes match your search</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or selecting a different category from above.
            </p>
            <button
              onClick={() => {
                setSelectedCategoryId("all");
                setSearchQuery("");
                setVegOnlyFilter(false);
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-neutral-800 text-xs font-semibold text-neutral-200 hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Food Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const countInCart = (cartItemCounts && cartItemCounts[item.id]) || 0;

              return (
                <div
                  key={item.id}
                  id={`menu-item-${item.id}`}
                  className="group relative flex flex-col rounded-2xl bg-neutral-900/70 border border-neutral-800/80 hover:border-amber-500/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/60"
                >
                  {/* Food Image Container */}
                  <div className="relative w-full h-48 bg-neutral-950 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-black/20" />

                    {/* Badges Overlay */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      {/* Veg Indicator */}
                      <div
                        className="w-5 h-5 rounded-md bg-neutral-950/90 backdrop-blur-md border border-emerald-500/80 flex items-center justify-center shadow"
                        title={item.veg ? "Pure Vegetarian" : "Non-Veg"}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.veg ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                      </div>

                      {/* Bestseller Badge */}
                      {item.bestseller && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/90 text-neutral-950 font-extrabold text-[10px] tracking-wider uppercase shadow">
                          <Flame className="w-3 h-3 fill-current" />
                          Bestseller
                        </span>
                      )}

                      {/* Recommended Badge */}
                      {item.recommended && !item.bestseller && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-600/90 text-white font-bold text-[10px] tracking-wider uppercase shadow">
                          <Sparkles className="w-3 h-3" />
                          Chef's Pick
                        </span>
                      )}
                    </div>

                    {/* Floating Price Pill */}
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-neutral-950/90 backdrop-blur-md border border-amber-500/30 text-amber-400 font-extrabold text-sm shadow-md">
                      ₹{item.price}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Card Footer: Add to Order / Quantity Button */}
                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-neutral-800/80">
                      <span className="text-xs font-semibold text-neutral-400">
                        Freshly Prepared
                      </span>

                      <button
                        onClick={() => onAddToCart(item)}
                        id={`add-to-cart-${item.id}`}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
                          countInCart > 0
                            ? "bg-amber-600 text-white shadow-md shadow-amber-950/40"
                            : "bg-neutral-800 hover:bg-neutral-700 text-neutral-100 hover:text-white border border-neutral-700/60"
                        }`}
                      >
                        {countInCart > 0 ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added ({countInCart})</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Order Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Cart Drawer Peek Banner if customer has items in cart */}
        {cartItemCounts && Object.values(cartItemCounts).some((c) => Number(c) > 0) && (
          <div className="mt-10 p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-orange-950/80 to-neutral-900 border border-amber-500/40 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Items added to your Order Bag</h4>
                <p className="text-xs text-amber-300">
                  Ready to review quantities and order on WhatsApp?
                </p>
              </div>
            </div>
            <button
              onClick={onOpenCart}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-lg transition"
            >
              View Cart & Order →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
