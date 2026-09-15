import {
  MenuItem,
  MenuCategory,
  CustomerReview,
  GalleryItem,
  RestaurantSettings,
  OrderInquiry,
  OrderItem,
  AdminStats,
  AdminUser,
} from "../types";

const TOKEN_KEY = "himalayan_admin_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ==========================================
// PUBLIC API CALLS
// ==========================================

export async function fetchSettings(): Promise<RestaurantSettings> {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error("Failed to fetch restaurant settings");
  return res.json();
}

export async function fetchCategories(): Promise<MenuCategory[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch menu categories");
  return res.json();
}

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const res = await fetch("/api/menu");
  if (!res.ok) throw new Error("Failed to fetch menu items");
  return res.json();
}

export async function fetchReviews(): Promise<CustomerReview[]> {
  const res = await fetch("/api/reviews");
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

export async function submitCustomerReview(payload: {
  customerName: string;
  rating: number;
  review: string;
  photo?: string;
}): Promise<{ success: boolean; message: string; reviewId: string }> {
  const res = await fetch("/api/reviews/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to submit review");
  return data;
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const res = await fetch("/api/gallery");
  if (!res.ok) throw new Error("Failed to fetch gallery");
  return res.json();
}

export async function submitOrderInquiry(payload: {
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  notes?: string;
}): Promise<{ success: boolean; orderId: string; whatsappUrl: string }> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to submit order inquiry");
  return data;
}

// ==========================================
// ADMIN AUTH CALLS
// ==========================================

export async function loginAdmin(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Invalid email or password");
  setStoredToken(data.token);
  return data;
}

export async function verifyAdminSession(): Promise<AdminUser> {
  const res = await fetch("/api/admin/me", {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    clearStoredToken();
    throw new Error("Session invalid or expired");
  }
  return res.json();
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: getAuthHeaders(),
    });
  } catch {
    // Ignore network error on logout
  } finally {
    clearStoredToken();
  }
}

// ==========================================
// ADMIN CRUD CALLS
// ==========================================

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch("/api/admin/stats", { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch admin stats");
  return res.json();
}

export async function updateAdminSettings(settings: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
  const res = await fetch("/api/admin/settings", {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update settings");
  return data;
}

export async function fetchAdminMenuItems(): Promise<MenuItem[]> {
  const res = await fetch("/api/admin/menu", { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch menu items");
  return res.json();
}

export async function createAdminMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
  const res = await fetch("/api/admin/menu", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create menu item");
  return data;
}

export async function updateAdminMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
  const res = await fetch(`/api/admin/menu/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update menu item");
  return data;
}

export async function deleteAdminMenuItem(id: string): Promise<void> {
  const res = await fetch(`/api/admin/menu/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete menu item");
}

export async function fetchAdminCategories(): Promise<MenuCategory[]> {
  const res = await fetch("/api/admin/categories", { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function createAdminCategory(category: Partial<MenuCategory>): Promise<MenuCategory> {
  const res = await fetch("/api/admin/categories", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(category),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create category");
  return data;
}

export async function updateAdminCategory(id: string, updates: Partial<MenuCategory>): Promise<MenuCategory> {
  const res = await fetch(`/api/admin/categories/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update category");
  return data;
}

export async function deleteAdminCategory(id: string): Promise<void> {
  const res = await fetch(`/api/admin/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete category");
}

export async function fetchAdminReviews(): Promise<CustomerReview[]> {
  const res = await fetch("/api/admin/reviews", { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

export async function updateAdminReviewStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<CustomerReview> {
  const res = await fetch(`/api/admin/reviews/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update review status");
  return data;
}

export async function toggleAdminReviewFeatured(id: string, featured: boolean): Promise<CustomerReview> {
  const res = await fetch(`/api/admin/reviews/${id}/feature`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ featured }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update featured flag");
  return data;
}

export async function deleteAdminReview(id: string): Promise<void> {
  const res = await fetch(`/api/admin/reviews/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete review");
}

export async function fetchAdminGallery(): Promise<GalleryItem[]> {
  const res = await fetch("/api/admin/gallery", { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch gallery");
  return res.json();
}

export async function createAdminGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
  const res = await fetch("/api/admin/gallery", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to add gallery item");
  return data;
}

export async function updateAdminGalleryItem(id: string, item: Partial<GalleryItem>): Promise<GalleryItem> {
  const res = await fetch(`/api/admin/gallery/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update gallery item");
  return data;
}

export async function deleteAdminGalleryItem(id: string): Promise<void> {
  const res = await fetch(`/api/admin/gallery/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete gallery item");
}

export async function fetchAdminOrders(): Promise<OrderInquiry[]> {
  const res = await fetch("/api/admin/orders", { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function updateAdminOrderStatus(id: string, status: string): Promise<OrderInquiry> {
  const res = await fetch(`/api/admin/orders/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update order status");
  return data;
}

export async function resetAdminDemoData(): Promise<void> {
  const res = await fetch("/api/admin/reset-demo", {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to reset demo data");
}
