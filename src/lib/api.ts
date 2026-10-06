import { Product, ProductsApiResponse, Category, User, LoginCredentials } from "@/types";

const BASE_URL = "https://dummyjson.com";

/**
 * =========================================================================
 * NEXT.JS API HELPER FUNCTIONS (DummyJSON Mock API)
 * =========================================================================
 * This utility module shows how to interact with REST APIs in Next.js.
 * - In Server Components: these functions can be called directly during SSR/SSG.
 * - In Client Components: these functions can be called inside `useEffect` or event handlers.
 */

// 1. Fetch all products with optional search, category, sorting, and pagination
export async function getProducts(params?: {
  limit?: number;
  skip?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}): Promise<ProductsApiResponse> {
  const { limit = 20, skip = 0, category, search, sortBy, order } = params || {};

  let url = `${BASE_URL}/products`;

  if (search && search.trim() !== "") {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(search.trim())}&limit=${limit}&skip=${skip}`;
  } else if (category && category !== "all") {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
  } else {
    url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
  }

  if (sortBy) {
    url += `&sortBy=${sortBy}&order=${order || "asc"}`;
  }

  try {
    const res = await fetch(url, {
      // In Next.js App Router, fetch is enhanced with caching configurations
      next: { revalidate: 60 }, // Cache on server for 60 seconds (ISR)
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// 2. Fetch a single product by ID (for dynamic route `/products/[id]`)
export async function getProductById(id: string | number): Promise<Product> {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      next: { revalidate: 300 }, // Cache individual product details for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`Product not found (ID: ${id})`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}

// 3. Fetch product categories list
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE_URL}/products/categories`, {
      next: { revalidate: 3600 }, // 1 hour cache
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await res.json();
    
    // DummyJSON returns array of category objects: { slug, name, url } or strings depending on version
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === "string") {
      return (data as unknown as string[]).map((cat) => ({
        slug: cat,
        name: cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        url: `${BASE_URL}/products/category/${cat}`,
      }));
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Fallback categories if network fails
    return [
      { slug: "beauty", name: "Beauty", url: "" },
      { slug: "fragrances", name: "Fragrances", url: "" },
      { slug: "furniture", name: "Furniture", url: "" },
      { slug: "groceries", name: "Groceries", url: "" },
      { slug: "laptops", name: "Laptops", url: "" },
      { slug: "smartphones", name: "Smartphones", url: "" },
    ];
  }
}

// 4. Authenticate User with DummyJSON Auth Endpoint
export async function loginUserApi(credentials: LoginCredentials): Promise<User> {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        expiresInMins: credentials.expiresInMins || 60,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Invalid username or password");
    }

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: data.image,
      token: data.token || data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (error: any) {
    console.error("Login API error:", error);
    throw error;
  }
}

// 5. Fetch full User Profile with Auth Token
export async function getCurrentUserProfile(token: string): Promise<User> {
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Session expired or invalid token");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// 6. Fetch Comprehensive Dashboard Metrics (Total Products, Total Users, Categories, Recent Products)
export interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalCategories: number;
  totalCarts: number;
  recentProducts: Product[];
  topRatedProducts: Product[];
}

export async function getDashboardMetrics(): Promise<DashboardStats> {
  try {
    const [productsRes, usersRes, categoriesRes, cartsRes, topRatedRes] = await Promise.all([
      fetch(`${BASE_URL}/products?limit=6&sortBy=id&order=desc`).then((r) => r.json()),
      fetch(`${BASE_URL}/users?limit=1`).then((r) => r.json()),
      fetch(`${BASE_URL}/products/categories`).then((r) => r.json()),
      fetch(`${BASE_URL}/carts?limit=1`).then((r) => r.json()),
      fetch(`${BASE_URL}/products?limit=4&sortBy=rating&order=desc`).then((r) => r.json()),
    ]);

    return {
      totalProducts: productsRes.total || 194,
      totalUsers: usersRes.total || 208,
      totalCategories: Array.isArray(categoriesRes) ? categoriesRes.length : 24,
      totalCarts: cartsRes.total || 50,
      recentProducts: productsRes.products || [],
      topRatedProducts: topRatedRes.products || [],
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return {
      totalProducts: 194,
      totalUsers: 208,
      totalCategories: 24,
      totalCarts: 50,
      recentProducts: [],
      topRatedProducts: [],
    };
  }
}

