const API_BASE = "http://localhost:5050/api";

export const registerUser = async (data: any) => {
  const res = await fetch(`${API_BASE}/userregistration/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

interface LoginResponse {
  token: string;
  expiration: string;
  user: {
    email: string;
    name: string;
    role: 'Admin' | 'Student';
  };
}

export const loginUser = async (data: { email: string; password: string }): Promise<LoginResponse> => {
  try {
    const res = await fetch(`${API_BASE}/login/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Login failed');
    }

    const result = await res.json();
    
    // Ensure the token exists
    if (!result.token) {
      throw new Error('No token received from server');
    }

    // Set the token in local storage
    setToken(result.token);
    
    return result as LoginResponse;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const setToken = (token: string) => localStorage.setItem("token", token);
export const isTokenExpired = (token: string): boolean => {
  try {
    if (!token) return true;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
    const isExpired = payload.exp < currentTime;
    
    console.log('🔍 Token expiration check:', {
      tokenExp: new Date(payload.exp * 1000).toISOString(),
      currentTime: new Date(currentTime * 1000).toISOString(),
      isExpired
    });
    
    return isExpired;
  } catch (error) {
    console.error('❌ Error checking token expiration:', error);
    return true; // Consider invalid tokens as expired
  }
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    console.log('❌ getToken called on server side');
    return null;
  }
  
  const token = localStorage.getItem("token");
  console.log('🔍 Retrieved token from storage:', token ? 'exists' : 'not found');
  
  if (!token) {
    console.log('❌ No token found in storage');
    return null;
  }
  
  if (isTokenExpired(token)) {
    console.log('⌛ Token expired, removing...');
    removeToken();
    return null;
  }
  
  console.log('✅ Token is valid');
  return token;
};
export const removeToken = () => localStorage.removeItem("token");
export const isLoggedIn = () => !!getToken();

/**
 * Sends a forgot password email to the user.
 * @param email User's email address
 * @returns Response from the backend
 */
export const forgotPassword = async (email: string) => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}/login/forgot-password`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email }),
  });

  let response = {};
  if (res.status !== 204) {
    try {
      response = await res.json();
    } catch (e) {
      // Ignore JSON parse error for empty body
    }
  }
  return { ok: res.ok, status: res.status, ...response };
};

/**
 * Reset user password using email, token, and new password.
 * @param email User's email address
 * @param token Reset token
 * @param newPassword New password
 * @returns Response from the backend, with ok and status
 */
export async function resetPasswordApi({ email, token, newPassword }: { email: string; token: string; newPassword: string }) {
  const res = await fetch(`${API_BASE}/login/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, token, newPassword }),
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  return { ok: res.ok, status: res.status, ...data };
}
