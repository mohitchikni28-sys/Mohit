import React, { useRef } from "react";
import { Flame, Star, MapPin, Phone, MessageSquare, Heart } from "lucide-react";
import { RestaurantSettings } from "../types";

interface FooterProps {
  settings: RestaurantSettings;
  onNavigateAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigateAdmin }) => {
  const clicksRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Secret admin trigger: 3 rapid clicks on secret spots (logo or copyright symbol)
  const handleSecretTrigger = (e: React.MouseEvent) => {
    clicksRef.current += 1;
    if (clicksRef.current >= 3) {
      e.preventDefault();
      if (timerRef.current) clearTimeout(timerRef.current);
      clicksRef.current = 0;
      onNavigateAdmin();
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      clicksRef.current = 0;
    }, 1800);
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 text-xs pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-neutral-900">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div
              onClick={handleSecretTrigger}
              className="flex items-center gap-2.5 select-none cursor-default group"
              title=""
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 transition-transform group-hover:scale-105">
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-display text-base font-bold text-white">
                {settings.name}
              </span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-xs">
              Ahmedabad's dedicated destination for authentic Himalayan momos, steaming Kathmandu Jhol
              broths, and peri-peri crunchy Kurkure specialties. Handcrafted fresh with mountain soul.
            </p>
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{settings.ratingValue} ★</span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400">{settings.reviewCount} Google Reviews</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Explore Menu</h4>
            <ul className="space-y-2">
              <li>
                <a href="#menu" className="hover:text-amber-400 transition">
                  Steamed & Fried Momos
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition">
                  Kathmandu Jhol Momos
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition">
                  Signature Kurkure Cheese
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition">
                  Wok Chilli Momos & Noodles
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition">
                  Himalayan Thukpa Soups
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Landmark info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Restaurant Location</h4>
            <p className="text-neutral-300 leading-relaxed">
              {settings.address}
            </p>
            <div className="text-[11px] text-amber-400">
              Landmarks: Below Sankalp Restaurant, Opposite Kankadiya Hospital
            </div>
            <div className="text-[11px] text-neutral-400 font-mono">
              Plus Code: {settings.plusCode}
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Hours & Service</h4>
            <p className="text-neutral-300">
              Open Daily: <span className="text-white font-semibold">{settings.openingHours}</span>
            </p>
            <p className="text-neutral-400">
              Dine-in • Drive-through Takeaway • No-Contact Delivery
            </p>
            <div className="text-[11px] text-neutral-400 pt-1">
              Fresh preparation with hygienic kitchen standards.
            </div>
          </div>
        </div>

        {/* Natural SEO location keywords & copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[11px] text-neutral-400">
          <p>
            <span
              onClick={handleSecretTrigger}
              className="cursor-default select-none transition-colors hover:text-neutral-300"
              id="secret-copyright-symbol"
            >
              ©
            </span>{" "}
            {new Date().getFullYear()} {settings.name}. Serving the best momos in Bapunagar, Ahmedabad.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-neutral-400">
            <span>Momos in Bapunagar Ahmedabad</span>
            <span>•</span>
            <span>Momo restaurant in Ahmedabad</span>
            <span>•</span>
            <span>Authentic Himalayan Soul</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
