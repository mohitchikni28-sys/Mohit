import React, { useState } from "react";
import { Camera, X, Maximize2, Sparkles } from "lucide-react";
import { GalleryItem } from "../types";

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems }) => {
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  return (
    <section id="gallery" className="py-20 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">
            <Camera className="w-4 h-4" />
            <span>Visual Glimpses</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Himalayan Experience
          </h2>
          <p className="text-neutral-400 text-sm mt-2">
            A visual journey through our steaming handcrafted dumplings, sizzling crunchy specials,
            and hygienic kitchen in Bapunagar, Ahmedabad.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              id={`gallery-item-${item.id}`}
              className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/80 cursor-pointer aspect-[4/3] shadow-lg hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />

              {/* Hover overlay with caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3" />
                  House Speciality
                </span>
                <h4 className="text-sm font-bold text-white leading-snug">{item.caption}</h4>
              </div>

              {/* Top right expand badge */}
              <div className="absolute top-3 right-3 p-2 rounded-lg bg-neutral-950/70 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setActivePhoto(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/70 hover:bg-black text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full max-h-[75vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={activePhoto.image}
                  alt={activePhoto.caption}
                  className="w-full h-full object-contain max-h-[75vh]"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-200">{activePhoto.caption}</p>
                <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">
                  Himalayan Flames
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
