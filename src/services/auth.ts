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
