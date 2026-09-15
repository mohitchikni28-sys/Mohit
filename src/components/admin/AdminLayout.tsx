import React from "react";
import {
  Flame,
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  Star,
  Image as ImageIcon,
  Store,
  ShoppingBag,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { AdminUser } from "../../types";

export type AdminTab =
  | "dashboard"
  | "menu"
  | "media"
  | "categories"
  | "reviews"
  | "gallery"
  | "restaurant-info"
  | "orders"
  | "settings";

interface AdminLayoutProps {
  currentUser: AdminUser;
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onViewWebsite: () => void;
  pendingReviewsCount: number;
  newOrdersCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onLogout,
  onViewWebsite,
  pendingReviewsCount,
  newOrdersCount,
  children,
}) => {
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "menu", label: "Menu Management", icon: UtensilsCrossed },
    { id: "media", label: "Photos & Media", icon: Camera },
    { id: "categories", label: "Categories", icon: FolderTree },
    {
      id: "reviews",
      label: "Reviews",
      icon: Star,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
      badgeColor: "bg-amber-500 text-neutral-950",
    },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "restaurant-info", label: "Restaurant Info", icon: Store },
    {
      id: "orders",
      label: "Orders / Enquiries",
      icon: ShoppingBag,
      badge: newOrdersCount > 0 ? newOrdersCount : undefined,
      badgeColor: "bg-emerald-500 text-neutral-950",
    },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-600 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 p-0.5 flex items-center justify-center shadow">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div>
            <h1 className="font-display font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <span>Himalayan Flames</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Admin Panel
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400">
              Bapunagar, Ahmedabad Outlet Management
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onViewWebsite}
            id="admin-view-live-site-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white transition cursor-pointer"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-neutral-800 text-xs">
            <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-amber-400 text-xs">
              {currentUser.email.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <div className="font-semibold text-white truncate max-w-[130px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Authorized</span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            id="admin-logout-btn"
            className="p-2 rounded-lg bg-neutral-800 hover:bg-red-950/60 hover:text-red-400 text-neutral-300 transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar and Content Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-neutral-950 border-r border-neutral-800/80 p-4 shrink-0">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as AdminTab)}
                  id={`admin-tab-${item.id}`}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-950/40"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-neutral-400"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400 space-y-1.5">
            <div className="font-semibold text-neutral-300">Live Sync Active</div>
            <p className="text-[10px] leading-relaxed text-neutral-400">
              Any price change or menu edit updates the public website immediately without redeployment.
            </p>
          </div>
        </aside>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-neutral-950">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
