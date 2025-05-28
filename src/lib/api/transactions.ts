// src/lib/api/transactions.ts
import { ApiResponse } from './auth';

const BASE_URL = "https://acad-celestia-backend.mygenius.ng/api";

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'token_purchase' | 'token_sale';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  reference?: string;
  description?: string;
}

function getAuthHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

export async function getWalletTransactions(
  token: string
): Promise<ApiResponse<Transaction[]>> {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return res.json();
}
