import React, { useState } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  MessageSquare,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Info,
  Loader2,
} from "lucide-react";
import { CartItem, RestaurantSettings } from "../types";
import { submitOrderInquiry } from "../services/api";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart?: CartItem[];
  cartItems?: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  settings: RestaurantSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings,
}) => {
  const items = cart || cartItems || [];
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const totalItemsCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const estimatedTotal = items.reduce(
    (acc, curr) => acc + curr.item.price * curr.quantity,
    0
  );

  const handleOrderOnWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMessage("Please enter your name before ordering.");
      return;
    }
    if (items.length === 0) {
      setErrorMessage("Your order bag is empty. Please add some momos first!");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // 1. Submit to backend to save in orders/enquiries for Admin Dashboard
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || undefined,
        items: items.map((c) => ({
          itemId: c.item.id,
          name: c.item.name,
          price: c.item.price,
          quantity: c.quantity,
        })),
        total: estimatedTotal,
        notes: orderNotes.trim() || undefined,
      };

      const result = await submitOrderInquiry(orderPayload);

      // 2. Open WhatsApp directly with configured WhatsApp number & prefilled message
      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, "_blank");
      } else {
        // Fallback WhatsApp message URL
        const msg =
          `*${settings.name} - Order Inquiry*\n` +
          `Customer Name: ${customerName}\n` +
          (customerPhone ? `Phone: ${customerPhone}\n` : "") +
          `\n*Selected Items:*\n` +
          items
            .map((c) => `• ${c.item.name} x ${c.quantity} (₹${c.item.price * c.quantity})`)
            .join("\n") +
          `\n\n*Estimated Total:* ₹${estimatedTotal}\n` +
          (orderNotes ? `*Special Request:* ${orderNotes}\n` : "") +
          `\nPlease confirm availability and preparation time. Thank you!`;
        window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
      }

      // Close drawer
      onClose();
    } catch (err: any) {
      console.error("Order submission error:", err);
      setErrorMessage(err.message || "Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-950 border-l border-neutral-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Your Order Bag</h3>
              <p className="text-xs text-neutral-400">
                {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-neutral-400 hover:text-red-400 p-1.5 transition"
                title="Clear all items"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              id="close-cart-btn"
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {items.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-4 text-neutral-600">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-neutral-300 text-sm">Your order bag is empty</h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Explore our authentic momos, crunchy kurkure and Himalayan soups to begin.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-lg shadow-amber-950/40 transition"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                {items.map((c) => (
                  <div
                    key={c.item.id}
                    className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-3"
                  >
                    <img
                      src={c.item.image}
                      alt={c.item.name}
                      className="w-14 h-14 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{c.item.name}</h4>
                      <p className="text-[11px] text-amber-400 font-semibold mt-0.5">
                        ₹{c.item.price} each
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-neutral-950 px-2 py-1 rounded-lg border border-neutral-800 shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(c.item.id, -1)}
                        className="p-1 text-neutral-400 hover:text-white transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white min-w-[16px] text-center">
                        {c.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(c.item.id, 1)}
                        className="p-1 text-neutral-400 hover:text-white transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right min-w-[50px] shrink-0">
                      <span className="text-xs font-extrabold text-white">
                        ₹{c.item.price * c.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Form details */}
              <form onSubmit={handleOrderOnWhatsApp} className="space-y-3.5 pt-2 border-t border-neutral-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Customer Details for WhatsApp Order</span>
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Your Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Patel"
                    id="order-customer-name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 98250 12345"
                    id="order-customer-phone"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Special Note / Delivery instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Extra spicy red chutney, drive-through pickup at 8:30 PM..."
                    id="order-customer-notes"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-lg bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </form>
            </>
          )}
        </div>

        {/* Drawer Footer / Checkout Bar */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-800 bg-neutral-900/90 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="font-semibold text-neutral-200">₹{estimatedTotal}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Estimated Packaging / Taxes</span>
                <span className="text-emerald-400 font-medium">Included</span>
              </div>
              <div className="flex items-center justify-between text-sm font-extrabold text-white pt-2 border-t border-neutral-800">
                <span>Estimated Total</span>
                <span className="text-amber-400 text-base">₹{estimatedTotal}</span>
              </div>
            </div>

            <button
              onClick={handleOrderOnWhatsApp}
              disabled={isSubmitting}
              id="cart-submit-whatsapp-btn"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing WhatsApp...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  <span>Order on WhatsApp (₹{estimatedTotal})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center text-[10px] text-neutral-400 flex items-center justify-center gap-1">
              <span>Ordering sends message to:</span>
              <strong className="text-neutral-200 font-mono">+{settings.whatsapp}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
