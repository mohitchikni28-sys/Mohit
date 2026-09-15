import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import {
  MenuItem,
  MenuCategory,
  CustomerReview,
  GalleryItem,
  RestaurantSettings,
  OrderInquiry,
  AdminUser,
} from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Data directory & storage file
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  settings: RestaurantSettings;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  reviews: CustomerReview[];
  gallery: GalleryItem[];
  orders: OrderInquiry[];
  admins: (AdminUser & { passwordHash: string; salt: string })[];
}

// Initial Seed Data
const initialCategories: MenuCategory[] = [
  { id: "cat-momos", name: "Momos", description: "Classic steamed & fried authentic Himalayan dumplings", displayOrder: 1, active: true },
  { id: "cat-jhol", name: "Jhol Momos", description: "Immersed in spiced Kathmandu sesame-tomato broth", displayOrder: 2, active: true },
  { id: "cat-kurkure", name: "Kurkure / Crunchy Momos", description: "Super crunchy double-coated golden crust with peri-peri dust", displayOrder: 3, active: true },
  { id: "cat-cheese", name: "Cheese Momos", description: "Loaded with melted mozzarella & mountain herbs", displayOrder: 4, active: true },
  { id: "cat-chilli", name: "Chilli Momos", description: "Wok-tossed in fiery Asian garlic soy glaze with peppers", displayOrder: 5, active: true },
  { id: "cat-noodles", name: "Noodles", description: "Wok-tossed street noodles with fresh crisp veggies", displayOrder: 6, active: true },
  { id: "cat-soups", name: "Soups", description: "Traditional Himalayan Thukpa and peppery broths", displayOrder: 7, active: true },
  { id: "cat-beverages", name: "Other Food & Beverages", description: "Himalayan coolers, masala chaas & sides", displayOrder: 8, active: true },
];

const initialMenuItems: MenuItem[] = [
  // Momos
  {
    id: "item-1",
    categoryId: "cat-momos",
    name: "Classic Steamed Veg Momo",
    description: "Handcrafted dumplings filled with finely shredded cabbage, carrots, spring onions, and Himalayan spices. Served with fiery red chilli dip.",
    price: 99,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: false,
    recommended: true,
    active: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-2",
    categoryId: "cat-momos",
    name: "Steamed Mountain Paneer Momo",
    description: "Soft cottage cheese infused with black pepper, coriander and ginger in tender thin-skin momo dough. Juicy and aromatic.",
    price: 119,
    image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: true,
    recommended: true,
    active: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-3",
    categoryId: "cat-momos",
    name: "Golden Fried Veg Momo",
    description: "Crisp golden fried dumplings with juicy vegetable stuffing, tossed in light aromatic herbs. Served with cooling mayo and hot red sauce.",
    price: 109,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: false,
    recommended: false,
    active: true,
    displayOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Jhol Momos
  {
    id: "item-4",
    categoryId: "cat-jhol",
    name: "Himalayan Jhol Veg Momo",
    description: "Signature Kathmandu style steamed momos submerged in hot, sour and nutty sesame-soybean tomato broth with roasted cumin.",
    price: 139,
    image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: true,
    recommended: true,
    active: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-5",
    categoryId: "cat-jhol",
    name: "Paneer Jhol Momo Bowl",
    description: "Rich paneer dumplings drenched in rich aromatic Himalayan jhol soup garnished with fresh coriander, spring onion and lemon zest.",
    price: 159,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: false,
    recommended: true,
    active: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Kurkure
  {
    id: "item-6",
    categoryId: "cat-kurkure",
    name: "Signature Kurkure Cheese Momo",
    description: "Coated with crunchy spiced flakes and fried to shattering perfection, filled with molten cheese. Ahmedabad's favourite crunch!",
    price: 169,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: true,
    recommended: true,
    active: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-7",
    categoryId: "cat-kurkure",
    name: "Crispy Kurkure Veg Momo",
    description: "Crunchy crumb coated momos dusted with fiery Himalayan peri-peri seasoning. Served with mint dip and garlic chilli chutney.",
    price: 149,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: true,
    recommended: false,
    active: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Cheese
  {
    id: "item-8",
    categoryId: "cat-cheese",
    name: "Melted Cheese Corn Momo",
    description: "Sweet American golden corn blended with melted mozzarella and cheddar cheese with mild Italian seasoning. Cheesy delight in every bite.",
    price: 159,
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: true,
    recommended: true,
    active: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-9",
    categoryId: "cat-cheese",
    name: "Cheese Burst Momo Special",
    description: "Steamed and grilled dumplings infused with double cheese core that oozes creamy warmth. Served with garlic dip.",
    price: 179,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: false,
    recommended: true,
    active: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Chilli Momos
  {
    id: "item-10",
    categoryId: "cat-chilli",
    name: "Fiery Chilli Veg Momo",
    description: "Crispy fried momos wok-tossed with red and green bell peppers, diced onions, garlic and dark soy glaze. Spicy and bold.",
    price: 149,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: true,
    recommended: true,
    active: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-11",
    categoryId: "cat-chilli",
    name: "Schezwan Chilli Paneer Momo",
    description: "Tender paneer momos tossed in chef's special homemade Himalayan Schezwan sauce, garnished with toasted sesame and green scallions.",
    price: 169,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: false,
    recommended: true,
    active: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Noodles
  {
    id: "item-12",
    categoryId: "cat-noodles",
    name: "Hakka Street Veg Noodles",
    description: "Wok-seared thin noodles tossed with crunchy cabbage, julienned carrots, capsicum and light garlic soy seasoning.",
    price: 129,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: false,
    recommended: true,
    active: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-13",
    categoryId: "cat-noodles",
    name: "Spicy Schezwan Garlic Noodles",
    description: "Fiery wok-tossed noodles with crushed red chillies, burned garlic and fresh vegetables for bold Asian kick.",
    price: 149,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: true,
    recommended: false,
    active: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Soups
  {
    id: "item-14",
    categoryId: "cat-soups",
    name: "Traditional Himalayan Thukpa",
    description: "Authentic Tibetan comfort noodle soup simmered with ginger, garlic, cilantro, aromatic mountain spices and hearty veggies.",
    price: 139,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: true,
    recommended: true,
    active: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-15",
    categoryId: "cat-soups",
    name: "Hot & Sour Vegetable Soup",
    description: "Classic tangy and peppery warming broth loaded with finely chopped mushrooms, bamboo shoots and shredded vegetables.",
    price: 109,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: false,
    recommended: false,
    active: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Beverages & Coolers
  {
    id: "item-16",
    categoryId: "cat-beverages",
    name: "Mountain Mint Iced Cooler",
    description: "Freshly muddled garden mint, zesty lemon, Himalayan rock salt and chilled soda. The ultimate palate refresher.",
    price: 79,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: true,
    recommended: true,
    active: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item-17",
    categoryId: "cat-beverages",
    name: "Spiced Himalayan Masala Chaas",
    description: "Traditional churned curd whipped with roasted cumin seeds, green chillies, ginger and mountain black salt.",
    price: 49,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop",
    veg: true,
    bestseller: false,
    recommended: false,
    active: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialSettings: RestaurantSettings = {
  name: "Himalayan Flames House of Momo",
  tagline: "Authentic Momos. Bold Flavours. Himalayan Soul.",
  description: "Located in Bapunagar, Ahmedabad, Himalayan Flames House of Momo brings you authentic mountain culinary traditions. From steaming hot Kathmandu Jhol Momos and ultra-crisp Kurkure Cheese Momos to fiery wok-tossed Asian street delights, we prepare every dish fresh with uncompromised hygiene and bold Himalayan spices.",
  category: "North Indian / Momo Restaurant",
  address: "Lal Bahadur Shastri Rd, below Sankalp Restaurant, opposite Kankadiya Hospital, Shaktidhara Society, Bapunagar, Ahmedabad, Gujarat 380024",
  landmark: "Below Sankalp Restaurant, Opposite Kankadiya Hospital",
  plusCode: "2JQJ+XF Ahmedabad, Gujarat",
  phone: "+91 98765 43210", // Clear placeholder editable in Admin Panel
  whatsapp: "919876543210", // Configurable WhatsApp number
  instagram: "https://instagram.com/himalayanflames.momo",
  googleMapsUrl: "https://maps.google.com/?q=2JQJ%2BXF+Ahmedabad,+Gujarat",
  openingHours: "Mon - Sun: 11:30 AM - 11:00 PM",
  priceRange: "₹1–200 per person",
  ratingValue: 4.9,
  reviewCount: 48,
  logo: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=200&auto=format&fit=crop",
  heroImage: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1600&auto=format&fit=crop",
  aboutImage: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=900&auto=format&fit=crop",
  features: {
    freshlyPrepared: true,
    hygienic: true,
    multipleVarieties: true,
    dineIn: true,
    driveThrough: true,
    noContactDelivery: true,
  },
};

const initialReviews: CustomerReview[] = [
  {
    id: "rev-1",
    customerName: "Bhavik Patel",
    rating: 5,
    review: "Hands down the best Kurkure momos in Ahmedabad! The crunch is unmatched and the chutney has that authentic mountain punch. A must-visit in Bapunagar!",
    status: "approved",
    featured: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "rev-2",
    customerName: "Pooja Shah",
    rating: 5,
    review: "The Himalayan Jhol momos reminded me of my trip to Kathmandu. The warm sesame soup broth is heavenly, especially on chilly evenings. Outstanding quality and so hygienic.",
    status: "approved",
    featured: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "rev-3",
    customerName: "Rahul Joshi",
    rating: 5,
    review: "Below Sankalp in Bapunagar - such an amazing hidden gem! Cheese burst momos are incredible. Fast service, very hygienic packaging and friendly staff.",
    status: "approved",
    featured: true,
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: "rev-4",
    customerName: "Neha Mehta",
    rating: 5,
    review: "Clean ambience, reasonable pricing under ₹150, and authentic bold flavours. The chilli paneer momos had the perfect wok char! 5 stars easily.",
    status: "approved",
    featured: true,
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
  {
    id: "rev-5",
    customerName: "Ankit Sharma",
    rating: 4,
    review: "Loved the Thukpa soup and Steamed Paneer Momos. Very fresh dough and hot dipping sauce. Great value for money.",
    status: "approved",
    featured: false,
    createdAt: new Date(Date.now() - 22 * 86400000).toISOString(),
  },
  {
    id: "rev-demo-pending",
    customerName: "Vikram Desai",
    rating: 5,
    review: "Visited yesterday with family. Tried 4 varieties and all were top notch. Waiting to come back for the Jhol momos!",
    status: "pending",
    featured: false,
    createdAt: new Date().toISOString(),
  },
];

const initialGallery: GalleryItem[] = [
  {
    id: "gal-1",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop",
    caption: "Signature Steamed Himalayan Momos with spicy sesame chutney",
    active: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "gal-2",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop",
    caption: "Crispy Kurkure Cheese Momos with double-crunch coating",
    active: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "gal-3",
    image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=800&auto=format&fit=crop",
    caption: "Warm Kathmandu style spiced sesame-tomato Jhol momo bowl",
    active: true,
    displayOrder: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "gal-4",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
    caption: "Fiery Wok-Tossed Chilli Momos with bell peppers and scallions",
    active: true,
    displayOrder: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: "gal-5",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop",
    caption: "Traditional comforting Himalayan vegetable Thukpa noodle soup",
    active: true,
    displayOrder: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "gal-6",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop",
    caption: "Hygienic open kitchen and fresh ingredient preparation",
    active: true,
    displayOrder: 6,
    createdAt: new Date().toISOString(),
  },
];

const initialOrders: OrderInquiry[] = [
  {
    id: "ord-101",
    customerName: "Jayesh Solanki",
    customerPhone: "9825012345",
    items: [
      { itemId: "item-6", name: "Signature Kurkure Cheese Momo", price: 169, quantity: 2 },
      { itemId: "item-4", name: "Himalayan Jhol Veg Momo", price: 139, quantity: 1 },
    ],
    total: 477,
    notes: "Please pack extra spicy red chutney and mayo dip.",
    status: "Contacted",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "ord-102",
    customerName: "Ritu Dave",
    customerPhone: "9879054321",
    items: [
      { itemId: "item-8", name: "Melted Cheese Corn Momo", price: 159, quantity: 1 },
      { itemId: "item-12", name: "Hakka Street Veg Noodles", price: 129, quantity: 1 },
      { itemId: "item-16", name: "Mountain Mint Iced Cooler", price: 79, quantity: 2 },
    ],
    total: 446,
    notes: "Drive-through pick-up in 20 mins.",
    status: "New",
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
];

// Helper to hash passwords using built-in scrypt
function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")): { hash: string; salt: string } {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(check, "hex"));
}

// Initial Admin User
const defaultAdminSalt = crypto.randomBytes(16).toString("hex");
const defaultAdminHash = hashPassword("Admin@Himalayan2026!", defaultAdminSalt).hash;

const initialAdmins = [
  {
    id: "adm-1",
    email: "admin@himalayanflames.com",
    role: "admin" as const,
    name: "Restaurant Owner",
    passwordHash: defaultAdminHash,
    salt: defaultAdminSalt,
    createdAt: new Date().toISOString(),
  },
];

// Database Manager
function loadDB(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading db.json, creating initial store:", err);
  }

  const initialDb: DatabaseSchema = {
    settings: initialSettings,
    categories: initialCategories,
    menuItems: initialMenuItems,
    reviews: initialReviews,
    gallery: initialGallery,
    orders: initialOrders,
    admins: initialAdmins,
  };

  saveDB(initialDb);
  return initialDb;
}

function saveDB(data: DatabaseSchema) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error("Failed to write db.json:", err);
  }
}

// In-Memory active token sessions
const activeSessions = new Map<string, { adminId: string; email: string; expiresAt: number }>();

// Auth Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing admin authorization token" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    res.status(401).json({ error: "Unauthorized: Session expired or invalid" });
    return;
  }

  // Renew expiry (24 hours from activity)
  session.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  (req as any).adminSession = session;
  next();
}

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// Get restaurant settings
app.get("/api/settings", (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.settings);
});

// Get active categories
app.get("/api/categories", (req: Request, res: Response) => {
  const db = loadDB();
  const activeCategories = db.categories
    .filter((c) => c.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(activeCategories);
});

// Get active menu items
app.get("/api/menu", (req: Request, res: Response) => {
  const db = loadDB();
  const activeItems = db.menuItems
    .filter((item) => item.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(activeItems);
});

// Get public reviews (ONLY approved reviews)
app.get("/api/reviews", (req: Request, res: Response) => {
  const db = loadDB();
  const approvedReviews = db.reviews
    .filter((r) => r.status === "approved")
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  res.json(approvedReviews);
});

// Customer submits a review (goes to PENDING)
app.post("/api/reviews/submit", (req: Request, res: Response) => {
  const { customerName, rating, review, photo } = req.body;

  if (!customerName || !rating || !review) {
    res.status(400).json({ error: "Name, rating (1-5), and review text are required." });
    return;
  }

  const numRating = Number(rating);
  if (numRating < 1 || numRating > 5) {
    res.status(400).json({ error: "Rating must be between 1 and 5." });
    return;
  }

  const db = loadDB();
  const newReview: CustomerReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    customerName: String(customerName).trim().slice(0, 80),
    rating: Math.round(numRating),
    review: String(review).trim().slice(0, 1000),
    photo: photo ? String(photo).trim() : undefined,
    status: "pending", // CRITICAL: strictly pending until admin approves
    featured: false,
    createdAt: new Date().toISOString(),
  };

  db.reviews.unshift(newReview);
  saveDB(db);

  res.status(201).json({
    success: true,
    message: "Thank you! Your review has been submitted and will appear once verified by our team.",
    reviewId: newReview.id,
  });
});

// Get active gallery items
app.get("/api/gallery", (req: Request, res: Response) => {
  const db = loadDB();
  const activeGallery = db.gallery
    .filter((g) => g.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(activeGallery);
});

// Record customer order inquiry (tied with WhatsApp action)
app.post("/api/orders", (req: Request, res: Response) => {
  const { customerName, customerPhone, items, total, notes } = req.body;

  if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Customer name and order items are required." });
    return;
  }

  const db = loadDB();
  const newOrder: OrderInquiry = {
    id: `ord-${Date.now().toString().slice(-6)}`,
    customerName: String(customerName).trim(),
    customerPhone: customerPhone ? String(customerPhone).trim() : "",
    items,
    total: Number(total) || 0,
    notes: notes ? String(notes).trim() : "",
    status: "New",
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);
  saveDB(db);

  res.status(201).json({
    success: true,
    orderId: newOrder.id,
    whatsappUrl: `https://wa.me/${db.settings.whatsapp}?text=${encodeURIComponent(
      `*Himalayan Flames House of Momo - Order Inquiry*\n` +
      `Order Ref: #${newOrder.id}\n` +
      `Customer: ${newOrder.customerName}\n` +
      (newOrder.customerPhone ? `Phone: ${newOrder.customerPhone}\n` : "") +
      `\n*Items:*\n` +
      newOrder.items.map((i) => `• ${i.name} x ${i.quantity} (₹${i.price * i.quantity})`).join("\n") +
      `\n\n*Estimated Total:* ₹${newOrder.total}\n` +
      (newOrder.notes ? `*Special Request:* ${newOrder.notes}\n` : "") +
      `\nPlease confirm availability and preparation time. Thank you!`
    )}`,
  });
});

// ==========================================
// ADMIN AUTHENTICATION ROUTES
// ==========================================

// Admin Login
app.post("/api/admin/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const db = loadDB();
  const admin = db.admins.find((a) => a.email.toLowerCase() === String(email).toLowerCase().trim());

  if (!admin || !verifyPassword(password, admin.passwordHash, admin.salt)) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString("hex");
  activeSessions.set(token, {
    adminId: admin.id,
    email: admin.email,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    token,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  });
});

// Verify current session
app.get("/api/admin/me", requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession;
  const db = loadDB();
  const admin = db.admins.find((a) => a.id === session.adminId);
  if (!admin) {
    res.status(401).json({ error: "Admin account not found." });
    return;
  }

  res.json({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });
});

// Admin Logout
app.post("/api/admin/logout", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    activeSessions.delete(token);
  }
  res.json({ success: true, message: "Logged out successfully" });
});

// ==========================================
// SECURE ADMIN MANAGEMENT ROUTES
// ==========================================

// Dashboard Statistics
app.get("/api/admin/stats", requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDB();
  const totalMenuItems = db.menuItems.length;
  const activeMenuItems = db.menuItems.filter((i) => i.active).length;
  const pendingReviews = db.reviews.filter((r) => r.status === "pending").length;
  const approvedReviews = db.reviews.filter((r) => r.status === "approved").length;
  const totalOrders = db.orders.length;
  const featuredItems = db.menuItems.filter((i) => i.bestseller || i.recommended).length;
  const totalEstimatedRevenue = db.orders.reduce((acc, curr) => acc + (curr.total || 0), 0);

  res.json({
    totalMenuItems,
    activeMenuItems,
    pendingReviews,
    approvedReviews,
    totalOrders,
    featuredItems,
    totalEstimatedRevenue,
  });
});

// Update Restaurant Settings
app.put("/api/admin/settings", requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDB();
  db.settings = {
    ...db.settings,
    ...req.body,
  };
  saveDB(db);
  res.json(db.settings);
});

// --- Menu Management ---
app.get("/api/admin/menu", requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.menuItems);
});

app.post("/api/admin/menu", requireAdminAuth, (req: Request, res: Response) => {
  const { name, categoryId, price, description, image, veg, bestseller, recommended, active, displayOrder } = req.body;
  if (!name || !categoryId || price === undefined) {
    res.status(400).json({ error: "Name, category, and price are required." });
    return;
  }

  const db = loadDB();
  const newItem: MenuItem = {
    id: `item-${Date.now()}`,
    name: String(name).trim(),
    categoryId: String(categoryId),
    price: Number(price) || 0,
    description: String(description || "").trim(),
    image: image ? String(image).trim() : "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop",
    veg: veg !== undefined ? Boolean(veg) : true,
    bestseller: Boolean(bestseller),
    recommended: Boolean(recommended),
    active: active !== undefined ? Boolean(active) : true,
    displayOrder: Number(displayOrder) || db.menuItems.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.menuItems.push(newItem);
  saveDB(db);
  res.status(201).json(newItem);
});

app.put("/api/admin/menu/:id", requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDB();
  const idx = db.menuItems.findIndex((i) => i.id === id);
  if (idx === -1) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }

  db.menuItems[idx] = {
    ...db.menuItems[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  saveDB(db);
  res.json(db.menuItems[idx]);
});

app.delete("/api/admin/menu/:id", requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDB();
  const initialLen = db.menuItems.length;
  db.menuItems = db.menuItems.filter((i) => i.id !== id);
  if (db.menuItems.length === initialLen) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }
  saveDB(db);
  res.json({ success: true, message: "Menu item deleted" });
});

// --- Category Management ---
app.get("/api/admin/categories", requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.categories);
});

app.post("/api/admin/categories", requireAdminAuth, (req: Request, res: Response) => {
  const { name, description, image, displayOrder, active } = req.body;
  if (!name) {
    res.status(400).json({ error: "Category name is required." });
    return;
  }

  const db = loadDB();
  const newCat: MenuCategory = {
    id: `cat-${Date.now()}`,
    name: String(name).trim(),
    description: description ? String(description).trim() : "",
    image: image ? String(image).trim() : undefined,
    displayOrder: Number(displayOrder) || db.categories.length + 1,
    active: active !== undefined ? Boolean(active) : true,
  };

  db.categories.push(newCat);
  saveDB(db);
  res.status(201).json(newCat);
});

app.put("/api/admin/categories/:id", requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDB();
  const idx = db.categories.findIndex((c) => c.id === id);
  if (idx === -1) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  db.categories[idx] = {
    ...db.categories[idx],
    ...req.body,
  };
  saveDB(db);
  res.json(db.categories[idx]);
});

app.delete("/api/admin/categories/:id", requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDB();
  db.categories = db.categories.filter((c) => c.id !== id);
  saveDB(db);
  res.json({ success: true, message: "Category deleted" });
});

// --- Review Management ---
app.get("/api/admin/reviews", requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.reviews);
});

app.patch("/api/admin/reviews/:id/status", requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "approved", "rejected"].includes(status)) {
    res.status(400).json({ error: "Invalid status. Must be pending, approved, or rejected." });
    return;
  }

  const db = loadDB();
  const review = db.reviews.find((r) => r.id === id);
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }

  review.status = status;
  saveDB(db);
  res.json(review);
});

app.patch("/api/admin/reviews/:id/feature", requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { featured } = req.body;

  const db = loadDB();
  const review = db.reviews.find((r) => r.id === id);
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }

  review.featured = Boolean(featured);
  saveDB(db);
  res.json(review);
});

app.delete("/api/admin/reviews/:id", requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDB();
  db.reviews = db.reviews.filter((r) => r.id !== id);
  saveDB(db);
  res.json({ success: true, message: "Review deleted" });
});

// --- Gallery Management ---
app.get("/api/admin/gallery", requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.gallery);
});

app.post("/api/admin/gallery", requireAdminAuth, (req: Request, res: Response) => {
  const { image, caption, displayOrder, active } = req.body;
  if (!image) {
    res.status(400).json({ error: "Image URL is required." });
    return;
  }

  const db = loadDB();
  const newGal: GalleryItem = {
    id: `gal-${Date.now()}`,
    image: String(image).trim(),
    caption: String(caption || "").trim(),
    displayOrder: Number(displayOrder) || db.gallery.length + 1,
    active: active !== undefined ? Boolean(active) : true,
    createdAt: new Date().toISOString(),
  };

  db.gallery.push(newGal);
  saveDB(db);
  res.status(201).json(newGal);
});

app.put("/api/admin/gallery/:id", requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { image, caption, displayOrder, active } = req.body;
  const db = loadDB();
  const index = db.gallery.findIndex((g) => g.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Gallery item not found." });
    return;
  }

  db.gallery[index] = {
    ...db.gallery[index],
    ...(image ? { image: String(image).trim() } : {}),
    ...(caption !== undefined ? { caption: String(caption).trim() } : {}),
    ...(displayOrder !== undefined ? { displayOrder: Number(displayOrder) } : {}),
    ...(active !== undefined ? { active: Boolean(active) } : {}),
  };

  saveDB(db);
  res.json(db.gallery[index]);
});

app.delete("/api/admin/gallery/:id", requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDB();
  db.gallery = db.gallery.filter((g) => g.id !== id);
  saveDB(db);
  res.json({ success: true, message: "Gallery item deleted" });
});

// --- Orders Management ---
app.get("/api/admin/orders", requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.orders);
});

app.patch("/api/admin/orders/:id/status", requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["New", "Contacted", "Completed", "Cancelled"].includes(status)) {
    res.status(400).json({ error: "Invalid order status." });
    return;
  }

  const db = loadDB();
  const order = db.orders.find((o) => o.id === id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  order.status = status;
  saveDB(db);
  res.json(order);
});

// Standalone single-file index.html download & preview endpoints
app.get("/download-index-html", (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), "public", "index-standalone.html");
  if (fs.existsSync(filePath)) {
    res.download(filePath, "index.html");
  } else {
    res.status(404).send("Standalone index.html not found");
  }
});

app.get("/standalone.html", (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), "public", "index-standalone.html");
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Standalone file not found");
  }
});

// Reset Demo Data helper for testing
app.post("/api/admin/reset-demo", requireAdminAuth, (req: Request, res: Response) => {
  const resetDb: DatabaseSchema = {
    settings: initialSettings,
    categories: initialCategories,
    menuItems: initialMenuItems,
    reviews: initialReviews,
    gallery: initialGallery,
    orders: initialOrders,
    admins: initialAdmins,
  };
  saveDB(resetDb);
  res.json({ success: true, message: "Demo data reset successfully" });
});

// ==========================================
// VITE & SERVER STARTUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Himalayan Flames House of Momo Server running on port ${PORT}`);
  });
}

startServer();
