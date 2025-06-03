const API_BASE = "http://localhost:5050/api";

export const registerUser = async (data: any) => {
  const res = await fetch(`${API_BASE}/userregistration/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data: any) => {
  const res = await fetch(`${API_BASE}/login/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const setToken = (token: string) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
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
