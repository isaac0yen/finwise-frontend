// src/lib/api/auth.ts
// Unified API module for authentication flows

export interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data?: T;
  token?: string;
  access_token?: string;
}

const BASE_URL = "https://acad-celestia-backend.mygenius.ng/api/auth";
//const BASE_URL = "http://localhost:3000/api/auth";


function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function signUp(nin: string, email: string): Promise<ApiResponse<{ token: string }>> {
  const res = await fetch(`${BASE_URL}/sign-up`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ nin, email }),
  });
  return res.json();
}

export async function resendVerificationCode(token: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/send-email-verification`, {
    method: "POST",
    headers: getAuthHeaders(token),
  });
  return res.json();
}

export async function verifyEmail(token: string, code: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/verify-email`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ code }),
  });
  return res.json();
}

export async function setPassword(token: string, password: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/set-password`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ password }),
  });
  return res.json();
}

export async function login(email: string, password: string): Promise<ApiResponse<{ access_token: string }>> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
