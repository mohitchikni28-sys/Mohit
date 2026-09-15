import React from "react";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Compass,
  Building,
  Hospital,
  Copy,
  Check,
} from "lucide-react";
import { RestaurantSettings } from "../types";

interface LocationSectionProps {
  settings: RestaurantSettings;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ settings }) => {
  const [copied, setCopied] = React.useState(false);

  const copyPlusCode = () => {
    navigator.clipboard.writeText(settings.plusCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="location" className="py-20 bg-neutral-900/60 relative border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Location Information Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500">
              <MapPin className="w-4 h-4" />
              <span>Easy To Reach In Bapunagar</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Visit Us in Bapunagar, Ahmedabad
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              We are centrally situated on bustling Lal Bahadur Shastri Road in Shaktidhara Society.
              Easily accessible with convenient parking for dine-in, quick takeaway, and drive-through pick-up.
            </p>

            {/* Address Box */}
            <div className="p-5 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-4 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Full Restaurant Address</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {settings.address}
                  </p>
                </div>
              </div>

              {/* Landmark Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-800">
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <Building className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Below <strong>Sankalp Restaurant</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <Hospital className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Opposite <strong>Kankadiya Hospital</strong></span>
                </div>
              </div>

              {/* Google Maps Plus Code */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-500" />
                  <span className="text-neutral-400">Google Plus Code:</span>
                  <strong className="text-white font-mono">{settings.plusCode}</strong>
                </div>
                <button
                  onClick={copyPlusCode}
                  className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-[11px] font-semibold text-neutral-200 flex items-center gap-1 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Direct Action Button */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="location-get-directions-btn"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-xl shadow-amber-950/50 flex items-center gap-2 transition active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Driving Directions</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>

              <div className="text-xs text-neutral-400 font-medium">
                Open Daily: <span className="text-neutral-200 font-semibold">{settings.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Embed Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl h-80 sm:h-[420px]">
              {/* Google Map iframe centered around Bapunagar, Ahmedabad */}
              <iframe
                title="Himalayan Flames House of Momo Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14686.082001566872!2d72.628045!3d23.040216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8718ecae93e5%3A0xd689dc330d220468!2sBapunagar%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale-[40%] contrast-[110%] hover:grayscale-0 transition-all duration-500"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating map pin overlay pill */}
              <div className="absolute top-4 left-4 p-3 rounded-xl bg-neutral-950/90 backdrop-blur-md border border-neutral-800 shadow-xl flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                <div>
                  <h4 className="text-xs font-bold text-white">Himalayan Flames</h4>
                  <p className="text-[10px] text-amber-400">Bapunagar, Ahmedabad (4.9★)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
