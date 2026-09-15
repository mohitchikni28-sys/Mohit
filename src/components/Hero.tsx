import React from "react";
import {
  Flame,
  Star,
  MessageSquare,
  Compass,
  Phone,
  Sparkles,
  ShieldCheck,
  UtensilsCrossed,
  Car,
  PackageCheck,
  Award,
  Layers,
} from "lucide-react";
import { RestaurantSettings } from "../types";

interface HeroProps {
  settings: RestaurantSettings;
  onViewMenu: () => void;
  onOpenOrder?: () => void;
  onOrderWhatsApp?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onViewMenu,
  onOpenOrder,
  onOrderWhatsApp,
}) => {
  const handleOrder = onOpenOrder || onOrderWhatsApp || (() => {});
  const highlights = [
    { icon: Sparkles, text: "Freshly Prepared" },
    { icon: ShieldCheck, text: "100% Hygienic" },
    { icon: Layers, text: "Multiple Momo Varieties" },
    { icon: UtensilsCrossed, text: "Dine-in" },
    { icon: Car, text: "Drive-through" },
    { icon: PackageCheck, text: "No-contact Delivery" },
  ];

  return (
    <section id="home" className="relative overflow-hidden bg-neutral-950 pt-8 pb-16 lg:py-24">
      {/* Background Decorative Flames / Atmospheric Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-br from-amber-600/15 via-orange-600/10 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-red-600/10 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Rating Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-amber-500/30 text-xs font-semibold text-neutral-200 shadow-lg shadow-black/40">
              <span className="flex items-center text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                {settings.ratingValue} ★
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-300 font-medium">{settings.reviewCount} Verified Reviews</span>
              <span className="text-neutral-500">•</span>
              <span className="text-amber-500/90 font-medium">Bapunagar, Ahmedabad</span>
            </div>

            {/* Main Headline & Display Title */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-500 font-semibold tracking-wider text-xs uppercase">
                <Flame className="w-4 h-4 animate-pulse" />
                <span>North Indian & Himalayan Delicacies</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                {settings.name}
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-amber-400/90 italic tracking-wide">
                "{settings.tagline}"
              </p>
            </div>

            {/* Description Paragraph */}
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Ahmedabad's premier destination for handcrafted Himalayan dumplings. From our piping-hot{" "}
              <strong className="text-white font-semibold">Kathmandu Jhol Momos</strong> and{" "}
              <strong className="text-white font-semibold">Signature Kurkure Cheese</strong> crunch to fiery
              wok-tossed noodles and soothing Thukpa soups — freshly steamed and fried with authentic mountain spices.
            </p>

            {/* 4 Required Action CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              {/* 1. View Menu */}
              <button
                onClick={onViewMenu}
                id="hero-view-menu-btn"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-xl shadow-amber-950/50 flex items-center gap-2 transition active:scale-95"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>View Menu</span>
              </button>

              {/* 2. Order on WhatsApp */}
              <button
                onClick={handleOrder}
                id="hero-order-whatsapp-btn"
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/40 flex items-center gap-2 transition active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </button>

              {/* 3. Get Directions */}
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-directions-btn"
                className="px-5 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-800 text-sm font-semibold flex items-center gap-2 transition active:scale-95"
              >
                <Compass className="w-4 h-4 text-amber-500" />
                <span>Get Directions</span>
              </a>

              {/* 4. Call Now */}
              <a
                href={`tel:${settings.phone}`}
                id="hero-call-now-btn"
                className="px-5 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-800 text-sm font-semibold flex items-center gap-2 transition active:scale-95"
              >
                <Phone className="w-4 h-4 text-amber-500" />
                <span>Call Now</span>
              </a>
            </div>

            {/* Price & Location Sub-bar */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Award className="w-4 h-4 text-amber-500" />
                Budget Friendly: <span className="text-neutral-200 font-semibold">{settings.priceRange}</span>
              </span>
              <span className="text-neutral-700">•</span>
              <span>
                Plus Code: <strong className="text-neutral-200 font-mono">{settings.plusCode}</strong>
              </span>
            </div>
          </div>

          {/* Right Column: Hero Food Imagery & Floating Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative glow frame */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-600/30 via-orange-500/20 to-red-600/30 rounded-3xl blur-lg -z-10" />

              {/* Main Food Photo */}
              <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl aspect-[4/3] sm:aspect-square">
                <img
                  src={settings.heroImage || "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1000&auto=format&fit=crop"}
                  alt="Himalayan Flames House of Momo special handcrafted dumplings"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-black/20" />

                {/* Bottom floating badge inside image */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800/90 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold block">
                      Crowd Favourite
                    </span>
                    <h3 className="text-sm font-bold text-white">Signature Kurkure Cheese Momo</h3>
                  </div>
                  <span className="text-sm font-black text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    ₹169
                  </span>
                </div>
              </div>

              {/* Floating review card */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 max-w-xs p-4 rounded-xl bg-neutral-900/95 backdrop-blur-md border border-neutral-700/80 shadow-2xl items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-300 mt-1 font-medium line-clamp-1">
                    "Best crunchy momos in Bapunagar!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Required Service Highlights Bar */}
        <div className="mt-14 pt-8 border-t border-neutral-800/80">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900/50 border border-neutral-800/60 hover:border-amber-500/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-200">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
