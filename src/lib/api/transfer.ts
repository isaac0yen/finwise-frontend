// src/lib/api/transfer.ts
import { ApiResponse } from './auth';

const BASE_URL = "https://acad-celestia-backend.mygenius.ng/api";

export interface TransferResponse {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  recipient_email: string;
  created_at: string;
}

function getAuthHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

export async function createTransfer(
  recipientEmail: string,
  amount: number,
  currency: string = 'NGN',
  token: string
): Promise<ApiResponse<TransferResponse>> {
  const res = await fetch(`${BASE_URL}/transfer`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ recipientEmail, amount, currency }),
  });
  return res.json();
}
