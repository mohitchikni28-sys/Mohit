import React from "react";
import {
  Phone,
  MessageSquare,
  Instagram,
  Compass,
  Clock,
  MapPin,
  UtensilsCrossed,
  Car,
  PackageCheck,
  Flame,
} from "lucide-react";
import { RestaurantSettings } from "../types";

interface ContactSectionProps {
  settings: RestaurantSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  return (
    <section id="contact" className="py-20 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">
            <Flame className="w-4 h-4" />
            <span>Connect & Indulge</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            We'd Love To Serve You
          </h2>
          <p className="text-neutral-400 text-sm mt-2">
            Questions about group catering, custom spice levels, or fast drive-through pick-up?
            Reach out directly or drop by our Bapunagar outlet.
          </p>
        </div>

        {/* 4 Contact Channels Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* 1. Direct Phone Call */}
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between hover:border-amber-500/40 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-white">Call Restaurant</h3>
              <p className="text-xs text-neutral-400">
                Direct phone inquiries for quick tables or counter takeaway orders.
              </p>
              <div className="font-mono text-xs font-bold text-amber-400 pt-1">
                {settings.phone}
              </div>
            </div>
            <a
              href={`tel:${settings.phone}`}
              id="contact-call-btn"
              className="mt-5 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold text-center block transition"
            >
              Call Directly
            </a>
          </div>

          {/* 2. WhatsApp Instant Messaging */}
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between hover:border-emerald-500/40 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-white">WhatsApp Chat</h3>
              <p className="text-xs text-neutral-400">
                Place orders, send custom requests, or check live kitchen availability.
              </p>
              <div className="font-mono text-xs font-bold text-emerald-400 pt-1">
                +{settings.whatsapp}
              </div>
            </div>
            <a
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello! I'd like to check today's specials at Himalayan Flames House of Momo.")}`}
              target="_blank"
              rel="noopener noreferrer"
              id="contact-whatsapp-btn"
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center block transition"
            >
              Message on WhatsApp
            </a>
          </div>

          {/* 3. Instagram Social Profile */}
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between hover:border-pink-500/40 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                <Instagram className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-white">Instagram</h3>
              <p className="text-xs text-neutral-400">
                Follow our behind-the-scenes momo making, reels, and special festival announcements.
              </p>
              <div className="text-xs font-semibold text-pink-400 pt-1 truncate">
                @himalayanflames.momo
              </div>
            </div>
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              id="contact-instagram-btn"
              className="mt-5 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-pink-900/50 hover:text-pink-200 text-white text-xs font-bold text-center block transition"
            >
              Visit Instagram
            </a>
          </div>

          {/* 4. Opening Hours & Timing */}
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between hover:border-amber-500/40 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-white">Opening Hours</h3>
              <p className="text-xs text-neutral-400">
                Hot & fresh momos served throughout lunch and dinner hours.
              </p>
              <div className="text-xs font-bold text-white pt-1">
                {settings.openingHours}
              </div>
            </div>
            <div className="mt-5 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-center text-emerald-400 font-semibold">
              Open 7 Days a Week
            </div>
          </div>
        </div>

        {/* 3 Service Methods */}
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-wrap items-center justify-around gap-6 text-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white">Dine-in Available</h4>
              <p className="text-[11px] text-neutral-400">Cozy seating with fresh piping hot service</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Car className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white">Drive-through Pick-up</h4>
              <p className="text-[11px] text-neutral-400">Order via WhatsApp & collect from your car</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white">No-Contact Delivery</h4>
              <p className="text-[11px] text-neutral-400">Hygienically sealed temperature-safe packing</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
