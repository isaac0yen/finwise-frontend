// src/lib/api/withdrawal.ts
import { ApiResponse } from './auth';

const BASE_URL = "https://acad-celestia-backend.mygenius.ng/api";

export interface BankAccount {
  account_name: string;
  account_number: string;
  bank_code: string;
}

export interface WithdrawalResponse {
  reference: string;
  amount: number;
  status: string;
  account_number: string;
  bank_code: string;
  bank_name: string;
  created_at: string;
}

function getAuthHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

export async function resolveAccount(
  account_number: string,
  bank_code: string,
  token: string
): Promise<ApiResponse<BankAccount>> {
  const res = await fetch(`${BASE_URL}/withdrawal/resolve-account`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ account_number, bank_code }),
  });
  return res.json();
}

export async function requestWithdrawal(
  amount: number,
  bank_code: string,
  account_number: string,
  token: string
): Promise<ApiResponse<WithdrawalResponse>> {
  const res = await fetch(`${BASE_URL}/withdrawal/request`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ amount, bank_code, account_number }),
  });
  return res.json();
}
