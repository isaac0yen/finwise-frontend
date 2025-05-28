// src/lib/api/token.ts
import { ApiResponse } from './auth';

const BASE_URL = "https://acad-celestia-backend.mygenius.ng/api";

export interface UniversityToken {
  id: string;
  symbol: string;
  name: string;
  university: string;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  logo?: string;
}

export interface MarketData {
  tokens: UniversityToken[];
  marketStats: {
    totalMarketCap: number;
    totalVolume24h: number;
    topGainer: { symbol: string; change: number };
    topLoser: { symbol: string; change: number };
  };
}

export interface TokenHolding {
  id: string;
  symbol: string;
  name: string;
  university: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  logo?: string;
}

export interface PortfolioSummary {
  totalPortfolioValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
}

export interface TokenTransaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  tokenName: string;
  university: string;
  quantity: number;
  price: number;
  totalAmount: number;
  fee?: number;
  timestamp: string;
}

export interface TokenTradeResponse {
  id: string;
  token_id: string;
  quantity: number;
  price: number;
  total_amount: number;
  fee?: number;
  status: string;
  created_at: string;
}

function getAuthHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

export async function getAllTokens(
  token: string
): Promise<ApiResponse<UniversityToken[]>> {
  const res = await fetch(`${BASE_URL}/token/all`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return res.json();
}

export async function getMarketData(
  token: string
): Promise<ApiResponse<MarketData>> {
  const res = await fetch(`${BASE_URL}/token/market/prices`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return res.json();
}

export async function buyToken(
  tokenId: string,
  quantity: number,
  price: number,
  token: string
): Promise<ApiResponse<TokenTradeResponse>> {
  const res = await fetch(`${BASE_URL}/token/buy`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ tokenId, quantity, price }),
  });
  return res.json();
}

export async function sellToken(
  tokenId: string,
  quantity: number,
  price: number,
  token: string
): Promise<ApiResponse<TokenTradeResponse>> {
  const res = await fetch(`${BASE_URL}/token/sell`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ tokenId, quantity, price }),
  });
  return res.json();
}

export async function getTokenPortfolio(
  token: string
): Promise<ApiResponse<{ holdings: TokenHolding[], summary: PortfolioSummary }>> {
  const res = await fetch(`${BASE_URL}/token/portfolio`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return res.json();
}

export async function getTokenTransactions(
  token: string
): Promise<ApiResponse<TokenTransaction[]>> {
  const res = await fetch(`${BASE_URL}/token/transactions`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return res.json();
}
