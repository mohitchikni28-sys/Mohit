import React from "react";
import { Home, Utensils, MessageSquare, Compass, Phone } from "lucide-react";
import { RestaurantSettings } from "../types";

interface MobileBottomNavProps {
  settings: RestaurantSettings;
  onViewMenu: () => void;
  onOpenOrder: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  settings,
  onViewMenu,
  onOpenOrder,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800 px-2 py-2 safe-area-bottom shadow-2xl">
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        {/* 1. Home */}
        <a
          href="#home"
          id="mobile-nav-home"
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-neutral-400 hover:text-amber-400 active:text-amber-400 transition"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">Home</span>
        </a>

        {/* 2. Menu */}
        <button
          onClick={onViewMenu}
          id="mobile-nav-menu"
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-neutral-400 hover:text-amber-400 active:text-amber-400 transition cursor-pointer"
        >
          <Utensils className="w-5 h-5 mb-0.5 text-amber-400" />
          <span className="text-[10px] font-semibold text-neutral-200">Menu</span>
        </button>

        {/* 3. WhatsApp (Elevated Primary Action) */}
        <button
          onClick={onOpenOrder}
          id="mobile-nav-whatsapp"
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-emerald-400 active:scale-95 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-950/60 -mt-3 mb-0.5 text-white">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-emerald-400">WhatsApp</span>
        </button>

        {/* 4. Directions */}
        <a
          href={settings.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          id="mobile-nav-directions"
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-neutral-400 hover:text-amber-400 active:text-amber-400 transition"
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">Directions</span>
        </a>

        {/* 5. Call */}
        <a
          href={`tel:${settings.phone}`}
          id="mobile-nav-call"
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-neutral-400 hover:text-amber-400 active:text-amber-400 transition"
        >
          <Phone className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">Call</span>
        </a>
      </div>
    </div>
  );
};
