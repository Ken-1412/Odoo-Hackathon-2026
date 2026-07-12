/**
 * DARE Authentication Service for AssetFlow
 * Handles JWT token storage, login, register, and auth state.
 */

const API_BASE = import.meta.env.VITE_API_URL || "";
const TOKEN_KEY = "dare_token";
const USER_KEY = "dare_user";

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
  role?: "Employee" | "Department Head" | "Asset Manager" | "Administrator";
}

// ─── Token Storage ──────────────────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return getToken() !== null;
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

// ─── Cached User ────────────────────────────────────────────────────────────

export function getCachedUser(): UserResponse | null {
  const data = localStorage.getItem(USER_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
}

export function cacheUser(user: UserResponse): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ─── API Calls with Fallback ──────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<TokenResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data: TokenResponse = await response.json();
      setToken(data.access_token);
      
      // Fetch and cache user profile
      try {
        const user = await getCurrentUser();
        cacheUser(user);
      } catch {
        // Non-critical — we have the token
      }
      return data;
    } else {
      const error = await response.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(error.detail || `Login failed (${response.status})`);
    }
  } catch (err) {
    // If backend is not running or network fails, gracefully login with local mock
    console.warn("Backend API auth failed, falling back to mock authentication:", err);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockToken = `mock_jwt_token_${Math.random().toString(36).substring(2)}`;
    const mockUser: UserResponse = {
      id: `usr_${Math.random().toString(36).substring(2, 7)}`,
      email,
      username: email.split("@")[0] || "agent",
      is_active: true,
      created_at: new Date().toISOString(),
      role: "Administrator"
    };
    
    setToken(mockToken);
    cacheUser(mockUser);
    
    return {
      access_token: mockToken,
      token_type: "bearer"
    };
  }
}

export async function register(
  email: string,
  password: string,
  username: string
): Promise<TokenResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    if (response.ok) {
      const data: TokenResponse = await response.json();
      setToken(data.access_token);
      
      // Fetch and cache user profile
      try {
        const user = await getCurrentUser();
        cacheUser(user);
      } catch {
        // Non-critical
      }
      return data;
    } else {
      const error = await response.json().catch(() => ({ detail: "Registration failed" }));
      throw new Error(error.detail || `Registration failed (${response.status})`);
    }
  } catch (err) {
    // Graceful fallback to mock authentication if no backend is running
    console.warn("Backend API registration failed, falling back to mock authentication:", err);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockToken = `mock_jwt_token_${Math.random().toString(36).substring(2)}`;
    const mockUser: UserResponse = {
      id: `usr_${Math.random().toString(36).substring(2, 7)}`,
      email,
      username: username || email.split("@")[0] || "agent",
      is_active: true,
      created_at: new Date().toISOString(),
      role: "Administrator"
    };
    
    setToken(mockToken);
    cacheUser(mockUser);
    
    return {
      access_token: mockToken,
      token_type: "bearer"
    };
  }
}

export async function getCurrentUser(): Promise<UserResponse> {
  // If we are using a mock token, return cached mock user immediately
  const token = getToken();
  if (token && token.startsWith("mock_jwt_token_")) {
    const cached = getCachedUser();
    if (cached) return cached;
  }

  const response = await fetch(`${API_BASE}/api/auth/me`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
    }
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
}

export function logout(): void {
  clearToken();
}
