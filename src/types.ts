export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  veg: boolean;
  bestseller: boolean;
  recommended: boolean;
  active: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  displayOrder: number;
  active: boolean;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  photo?: string;
  status: ReviewStatus;
  featured: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  caption: string;
  active: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  description: string;
  category: string;
  address: string;
  landmark: string;
  plusCode: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  googleMapsUrl: string;
  openingHours: string;
  priceRange: string;
  ratingValue: number;
  reviewCount: number;
  logo: string;
  heroImage: string;
  aboutImage?: string;
  features: {
    freshlyPrepared: boolean;
    hygienic: boolean;
    multipleVarieties: boolean;
    dineIn: boolean;
    driveThrough: boolean;
    noContactDelivery: boolean;
  };
}

export type OrderStatus = 'New' | 'Contacted' | 'Completed' | 'Cancelled';

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderInquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  name: string;
  createdAt: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface AdminStats {
  totalMenuItems: number;
  activeMenuItems: number;
  pendingReviews: number;
  approvedReviews: number;
  totalOrders: number;
  featuredItems: number;
  totalEstimatedRevenue: number;
}
