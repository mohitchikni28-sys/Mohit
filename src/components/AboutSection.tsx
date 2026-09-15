import React from "react";
import {
  Flame,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Award,
  Soup,
  ShieldCheck,
} from "lucide-react";
import { RestaurantSettings } from "../types";

interface AboutSectionProps {
  settings: RestaurantSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  const pillars = [
    {
      title: "Authentic Himalayan Spice Blends",
      desc: "Freshly roasted Timur mountain pepper, Himalayan black rock salts, toasted sesame seeds, and garden herbs sourced directly to honour traditional recipes.",
      icon: Sparkles,
    },
    {
      title: "Fresh, Never Frozen",
      desc: "Every momo skin is hand-kneaded and stuffed daily with farm-fresh garden vegetables, juicy paneer, and sweet corn. Steamed freshly on order.",
      icon: CheckCircle2,
    },
    {
      title: "Uncompromising Hygiene",
      desc: "Clean kitchen protocols, premium filtered water for our signature Jhol broths, and sanitized packing for dine-in, drive-through and takeout.",
      icon: ShieldCheck,
    },
    {
      title: "Warm Heartfelt Hospitality",
      desc: "Fast, smiling service designed to deliver exceptional street-food indulgence right here in Shaktidhara Society, Bapunagar.",
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="about" className="py-20 bg-neutral-900/60 relative border-t border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Column with layered images */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
              <img
                src={settings.aboutImage || "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=900&auto=format&fit=crop"}
                alt="Kathmandu style Himalayan Jhol Momo preparation"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-neutral-950/90 backdrop-blur-md border border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Soup className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Kathmandu Jhol & Fiery Broths</h4>
                    <p className="text-xs text-neutral-400">Slow-simmered sesame & tomato base</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accent badge */}
            <div className="absolute -top-5 -right-5 hidden sm:flex items-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow-xl shadow-amber-950/50">
              <Award className="w-4 h-4" />
              <span>4.9★ Rated on Google</span>
            </div>
          </div>

          {/* Text & Story Column */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500">
              <Flame className="w-4 h-4" />
              <span>Our Culinary Journey</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Bringing Authentic Mountain Flavours to the Heart of Bapunagar
            </h2>

            <p className="text-neutral-300 text-base leading-relaxed">
              <strong className="text-white font-semibold">{settings.name}</strong> was born out of a genuine passion
              for Himalayan culinary heritage. While momos have become an omnipresent street snack, the authentic soul—the
              tender thin wrapper, the burst of spiced aromatic fillings, the nutty richness of a slow-simmered Kathmandu Jhol
              broth, and the shattering crunch of a freshly prepared Kurkure crust—is rarely experienced in its true form.
            </p>

            <p className="text-neutral-300 text-base leading-relaxed">
              Conveniently situated on Lal Bahadur Shastri Road (below Sankalp Restaurant, opposite Kankadiya Hospital), we
              pride ourselves on meticulous hygiene, pure vegetarian varieties crafted with rich paneer and sweet corn, and
              our legendary homemade chilli sauces that pack an unforgettable punch.
            </p>

            {/* 4 Feature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-amber-400" />
                      </div>
                      <h4 className="text-sm font-bold text-neutral-100">{pillar.title}</h4>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
