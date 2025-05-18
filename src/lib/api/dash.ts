import type { ApiResponse } from "./auth";

const BASE_URL = "https://acad-celestia-backend.mygenius.ng/api/dashboard";
//const BASE_URL = "http://localhost:3000/api/dashboard";

function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getDashboardData(token: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return res.json();
}
