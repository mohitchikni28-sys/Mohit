import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  RestaurantSettings,
  MenuItem,
  MenuCategory,
  CustomerReview,
  GalleryItem,
  CartItem,
  AdminUser,
  AdminStats,
  OrderInquiry,
} from "./types";
import {
  fetchSettings,
  fetchCategories,
  fetchMenuItems,
  fetchReviews,
  fetchGallery,
  verifyAdminSession,
  logoutAdmin,
  fetchAdminStats,
  fetchAdminReviews,
  fetchAdminOrders,
} from "./services/api";

// Customer components
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { AboutSection } from "./components/AboutSection";
import { MenuSection } from "./components/MenuSection";
import { CartDrawer } from "./components/CartDrawer";
import { ReviewsSection } from "./components/ReviewsSection";
import { GallerySection } from "./components/GallerySection";
import { LocationSection } from "./components/LocationSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { MobileBottomNav } from "./components/MobileBottomNav";

// Admin components
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminLayout, AdminTab } from "./components/admin/AdminLayout";
import { AdminDashboardTab } from "./components/admin/AdminDashboardTab";
import { AdminMenuTab } from "./components/admin/AdminMenuTab";
import { AdminCategoriesTab } from "./components/admin/AdminCategoriesTab";
import { AdminReviewsTab } from "./components/admin/AdminReviewsTab";
import { AdminGalleryTab } from "./components/admin/AdminGalleryTab";
import { AdminSettingsTab } from "./components/admin/AdminSettingsTab";
import { AdminOrdersTab } from "./components/admin/AdminOrdersTab";
import { AdminMediaTab } from "./components/admin/AdminMediaTab";

// Default fallback settings while loading
const initialSettings: RestaurantSettings = {
  name: "Himalayan Flames House of Momo",
  tagline: "Authentic Momos. Bold Flavours. Himalayan Soul.",
  description:
    "Ahmedabad's dedicated destination for authentic Himalayan momos, steaming Kathmandu Jhol broths, and crunch-loaded Kurkure momos crafted fresh in Bapunagar.",
  category: "North Indian / Momo Restaurant",
  address:
    "Lal Bahadur Shastri Rd, below Sankalp Restaurant, opposite Kankadiya Hospital, Shaktidhara Society, Bapunagar, Ahmedabad, Gujarat 380024",
  landmark: "Below Sankalp Restaurant, Opposite Kankadiya Hospital",
  plusCode: "2JQJ+XF Ahmedabad, Gujarat",
  phone: "09876543210",
  whatsapp: "919876543210",
  instagram: "https://instagram.com",
  googleMapsUrl: "https://maps.google.com/?q=2JQJ%2BXF+Ahmedabad,+Gujarat",
  openingHours: "11:30 AM – 11:30 PM",
  priceRange: "₹1–200 per person",
  ratingValue: 4.9,
  reviewCount: 48,
  logo: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=200&auto=format&fit=crop",
  heroImage:
    "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=1600&auto=format&fit=crop",
  features: {
    freshlyPrepared: true,
    hygienic: true,
    multipleVarieties: true,
    dineIn: true,
    driveThrough: true,
    noContactDelivery: true,
  },
};

export default function App() {
  // Navigation State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return (
      window.location.pathname.startsWith("/admin") ||
      window.location.hash === "#admin"
    );
  });
  const [adminTab, setAdminTab] = useState<AdminTab>("dashboard");
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // App Data State
  const [settings, setSettings] = useState<RestaurantSettings>(initialSettings);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<CustomerReview[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin Data State
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalMenuItems: 0,
    activeMenuItems: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    totalOrders: 0,
    featuredItems: 0,
  });
  const [allReviews, setAllReviews] = useState<CustomerReview[]>([]);
  const [adminOrders, setAdminOrders] = useState<OrderInquiry[]>([]);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Sync route changes & Secret Keyboard Shortcut (Ctrl+Shift+A / Cmd+Shift+A)
  useEffect(() => {
    const handleRouteChange = () => {
      const isAdm =
        window.location.pathname.startsWith("/admin") ||
        window.location.hash === "#admin";
      setIsAdminMode(isAdm);
    };

    // Secret shortcut: Ctrl + Shift + A or Cmd + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setIsAdminMode((prev) => {
          const next = !prev;
          if (next) {
            window.history.pushState(null, "", "/admin");
          } else {
            window.history.pushState(null, "", "/");
          }
          return next;
        });
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navigateToAdmin = () => {
    setIsAdminMode(true);
    window.history.pushState(null, "", "/admin");
  };

  const navigateToWebsite = () => {
    setIsAdminMode(false);
    window.history.pushState(null, "", "/");
  };

  // Fetch Public Data
  const fetchPublicData = useCallback(async () => {
    try {
      const [settRes, catRes, itemRes, revRes, galRes] = await Promise.all([
        fetchSettings(),
        fetchCategories(),
        fetchMenuItems(),
        fetchReviews(),
        fetchGallery(),
      ]);
      setSettings(settRes);
      setCategories(catRes);
      setMenuItems(itemRes);
      setApprovedReviews(revRes);
      setGalleryItems(galRes);
    } catch (err) {
      console.error("Failed to load restaurant data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Admin Data (only when logged in)
  const fetchAdminData = useCallback(async () => {
    try {
      const [stats, revs, ords] = await Promise.all([
        fetchAdminStats(),
        fetchAdminReviews(),
        fetchAdminOrders(),
      ]);
      setAdminStats(stats);
      setAllReviews(revs);
      setAdminOrders(ords);
    } catch (err) {
      console.error("Error loading admin data:", err);
    }
  }, []);

  // Initial Load & Auth Check
  useEffect(() => {
    fetchPublicData();

    // Check existing admin session
    verifyAdminSession()
      .then((user) => {
        setAdminUser(user);
        fetchAdminData();
      })
      .catch(() => {
        setAdminUser(null);
      });
  }, [fetchPublicData, fetchAdminData]);

  // When admin logs in
  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    fetchAdminData();
  };

  // Admin Logout
  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (e) {
      // ignore
    }
    setAdminUser(null);
  };

  // Cart Operations
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((i) => {
          if (i.item.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Quick lookup dictionary for item quantities in cart
  const cartItemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of cart) {
      if (c && c.item) {
        counts[c.item.id] = (counts[c.item.id] || 0) + c.quantity;
      }
    }
    return counts;
  }, [cart]);

  // Reload all data after admin updates
  const handleRefreshAllData = async () => {
    await Promise.all([fetchPublicData(), fetchAdminData()]);
  };

  // ----------------------------------------------------
  // ADMIN VIEW
  // ----------------------------------------------------
  if (isAdminMode) {
    // If not authenticated, display login portal
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToWebsite={navigateToWebsite}
        />
      );
    }

    const pendingCount = allReviews.filter((r) => r.status === "pending").length;
    const newOrdersCount = adminOrders.filter((o) => o.status === "New").length;

    return (
      <AdminLayout
        currentUser={adminUser}
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        onLogout={handleLogout}
        onViewWebsite={navigateToWebsite}
        pendingReviewsCount={pendingCount}
        newOrdersCount={newOrdersCount}
      >
        {adminTab === "dashboard" && (
          <AdminDashboardTab
            stats={adminStats}
            recentOrders={adminOrders}
            pendingReviews={allReviews.filter((r) => r.status === "pending")}
            onNavigateTab={setAdminTab}
          />
        )}

        {adminTab === "menu" && (
          <AdminMenuTab
            items={menuItems}
            categories={categories}
            onRefreshData={handleRefreshAllData}
          />
        )}

        {adminTab === "media" && (
          <AdminMediaTab
            settings={settings}
            menuItems={menuItems}
            categories={categories}
            gallery={galleryItems}
            onRefreshData={handleRefreshAllData}
          />
        )}

        {adminTab === "categories" && (
          <AdminCategoriesTab
            categories={categories}
            items={menuItems}
            onRefreshData={handleRefreshAllData}
          />
        )}

        {adminTab === "reviews" && (
          <AdminReviewsTab
            reviews={allReviews}
            onRefreshData={handleRefreshAllData}
          />
        )}

        {adminTab === "gallery" && (
          <AdminGalleryTab
            gallery={galleryItems}
            onRefreshData={handleRefreshAllData}
          />
        )}

        {(adminTab === "restaurant-info" || adminTab === "settings") && (
          <AdminSettingsTab
            settings={settings}
            onRefreshData={handleRefreshAllData}
          />
        )}

        {adminTab === "orders" && (
          <AdminOrdersTab
            orders={adminOrders}
            onRefreshData={handleRefreshAllData}
          />
        )}
      </AdminLayout>
    );
  }

  // ----------------------------------------------------
  // PUBLIC RESTAURANT WEBSITE VIEW
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-600 selection:text-white relative">
      {/* 1. Header Navigation Bar */}
      <Navbar
        settings={settings}
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onNavigateAdmin={navigateToAdmin}
        onOpenAdmin={navigateToAdmin}
      />

      {/* 2. Hero Section */}
      <Hero
        settings={settings}
        onViewMenu={() => {
          const el = document.getElementById("menu");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenOrder={() => {
          if (cart.length === 0 && menuItems.length > 0) {
            handleAddToCart(menuItems[0]);
          } else {
            setCartOpen(true);
          }
        }}
        onOrderWhatsApp={() => {
          if (cart.length === 0 && menuItems.length > 0) {
            handleAddToCart(menuItems[0]);
          } else {
            setCartOpen(true);
          }
        }}
      />

      {/* 3. About & Brand Pillars */}
      <AboutSection settings={settings} />

      {/* 4. Categorized & Filterable Menu */}
      <MenuSection
        categories={categories}
        items={menuItems}
        onAddToCart={handleAddToCart}
        cartItemCounts={cartItemCounts}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* 5. Customer Love & Reviews (with 4.9★ and Write Review Modal) */}
      <ReviewsSection
        settings={settings}
        reviews={approvedReviews}
        onReviewSubmitted={fetchPublicData}
      />

      {/* 6. Food & Kitchen Gallery (with Lightbox) */}
      <GallerySection galleryItems={galleryItems} />

      {/* 7. Location & Directions (Bapunagar, Landmarks, Plus Code, Map) */}
      <LocationSection settings={settings} />

      {/* 8. Contact & Service Options */}
      <ContactSection settings={settings} />

      {/* 9. Footer with SEO Keywords & Discreet Admin Portal */}
      <Footer settings={settings} onNavigateAdmin={navigateToAdmin} />

      {/* Interactive Cart Drawer with WhatsApp Order Builder */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        cartItems={cart}
        settings={settings}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Mobile Sticky Bottom Bar (Home | Menu | WhatsApp | Directions | Call) */}
      <MobileBottomNav
        settings={settings}
        onViewMenu={() => {
          const el = document.getElementById("menu");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenOrder={() => {
          if (cart.length === 0 && menuItems.length > 0) {
            handleAddToCart(menuItems[0]);
          } else {
            setCartOpen(true);
          }
        }}
      />
    </div>
  );
}
