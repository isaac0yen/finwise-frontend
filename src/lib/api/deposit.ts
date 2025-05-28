// src/lib/api/deposit.ts
import { ApiResponse } from './auth';

const BASE_URL = "https://acad-celestia-backend.mygenius.ng/api";

export interface DepositInitResponse {
  authorization_url: string;
  reference: string;
}

export interface DepositVerifyResponse {
  status: string;
  amount: number;
  reference: string;
  paid: boolean;
  transaction_date: string;
}

function getAuthHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

export async function initializeDeposit(
  amount: number, 
  token: string
): Promise<ApiResponse<DepositInitResponse>> {
  const res = await fetch(`${BASE_URL}/deposit/initialize`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ amount }),
  });
  return res.json();
}

export async function verifyDeposit(
  reference: string,
  token: string
): Promise<ApiResponse<DepositVerifyResponse>> {
  const res = await fetch(`${BASE_URL}/deposit/verify/${reference}`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return res.json();
}
