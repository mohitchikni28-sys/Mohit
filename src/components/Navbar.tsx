import React, { useState, useRef } from "react";
import {
  Flame,
  Phone,
  MessageSquare,
  ShoppingBag,
  Menu as MenuIcon,
  X,
  MapPin,
} from "lucide-react";
import { RestaurantSettings } from "../types";

interface NavbarProps {
  settings: RestaurantSettings;
  cartCount: number;
  onOpenCart: () => void;
  onNavigateAdmin?: () => void;
  onOpenAdmin?: () => void;
  isAdminView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cartCount,
  onOpenCart,
  onNavigateAdmin,
  onOpenAdmin,
  isAdminView = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleAdminNavigate = onNavigateAdmin || onOpenAdmin;

  // Secret admin trigger: 5 rapid clicks on the logo
  const logoClicksRef = useRef(0);
  const logoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (!handleAdminNavigate) return;
    logoClicksRef.current += 1;
    if (logoClicksRef.current >= 5) {
      e.preventDefault();
      if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
      logoClicksRef.current = 0;
      handleAdminNavigate();
      return;
    }
    if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    logoTimerRef.current = setTimeout(() => {
      logoClicksRef.current = 0;
    }, 2000);
  };

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Menu", href: "#menu" },
    { label: "Reviews", href: "#reviews" },
    { label: "Gallery", href: "#gallery" },
    { label: "Location", href: "#location" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name (Secret trigger: 5 rapid clicks opens admin portal) */}
        <a
          href="#home"
          id="nav-brand-link"
          onClick={handleLogoClick}
          className="flex items-center gap-3 group focus:outline-none select-none cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-red-600 p-0.5 shadow-lg shadow-amber-950/50 flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-500 transition-colors group-hover:text-amber-400" />
            </div>
          </div>
          <div>
            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Himalayan Flames
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500 block">
              House of Momo
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              id={`nav-link-${link.label.toLowerCase()}`}
              className="text-sm font-medium text-neutral-300 hover:text-amber-400 transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Quick Call */}
          <a
            href={`tel:${settings.phone}`}
            id="nav-call-btn"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-200 hover:text-white hover:border-neutral-700 transition"
            title="Call Restaurant"
          >
            <Phone className="w-3.5 h-3.5 text-amber-500" />
            <span>Call</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello! I would like to inquire about Himalayan Flames House of Momo menu and ordering.")}`}
            target="_blank"
            rel="noopener noreferrer"
            id="nav-whatsapp-btn"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          {/* Cart / Order Bag Button */}
          <button
            onClick={onOpenCart}
            id="nav-cart-btn"
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs shadow-md shadow-amber-950/40 transition active:scale-95"
            aria-label="View Order Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Order Bag</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-neutral-950 text-amber-400 rounded-full border border-amber-400/40 min-w-[20px]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="nav-mobile-toggle-btn"
            className="lg:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-neutral-950/98 px-6 py-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-neutral-200 hover:text-amber-400 transition py-2 border-b border-neutral-900 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-xs text-neutral-500 font-mono">→</span>
              </a>
            ))}

            <div className="pt-3 grid grid-cols-2 gap-3">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm font-semibold text-white"
              >
                <Phone className="w-4 h-4 text-amber-500" />
                Call Now
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-sm font-semibold text-emerald-300"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                WhatsApp
              </a>
            </div>

            <div className="pt-2 text-center text-xs text-neutral-500">
              {settings.landmark} • {settings.openingHours}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
