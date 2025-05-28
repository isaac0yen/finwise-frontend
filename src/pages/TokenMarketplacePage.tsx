import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import api from '../lib/utils/apiClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';

interface UniversityToken {
  id: number;
  name: string;
  symbol: string;
  institution: string;
  totalSupply: string;
  circulatingSupply: string;
  initialPrice: string;
  currentPrice: string;
  priceChange24h: string;
  volume24h: string;
}

interface PricesData {
  [symbol: string]: {
    current: string;
    change24h: string;
    volume24h: string;
  }
}

interface MarketTrends {
  topGainers: Array<{ symbol: string; name: string; change: string; price: string }>;
  topLosers: Array<{ symbol: string; name: string; change: string; price: string }>;
  mostTraded: Array<{ symbol: string; name: string; volume: string; price: string }>;
}

// Use the API middleware to automatically handle auth errors
const fetchAllTokens = async (): Promise<UniversityToken[]> => {
  try {
    const data = await api.get('/token/all');
    return data.status ? data.tokens : [];
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }
};

const fetchMarketData = async (): Promise<{ prices: PricesData; marketTrends: MarketTrends }> => {
  try {
    const data = await api.get('/token/market/prices');
    return data.status 
      ? { prices: data.prices, marketTrends: data.marketTrends } 
      : { prices: {}, marketTrends: { topGainers: [], topLosers: [], mostTraded: [] } };
  } catch (error) {
    console.error('Error fetching market data:', error);
    return { prices: {}, marketTrends: { topGainers: [], topLosers: [], mostTraded: [] } };
  }
};

const buyToken = async (tokenId: string, quantity: number, price: number) => {
  try {
    return await api.post('/token/buy', { tokenId, quantity, price });
  } catch (error) {
    console.error('Error buying token:', error);
    throw error; // Let the calling function handle the error
  }
};

export default function TokenMarketplacePage() {
  const [tokens, setTokens] = useState<UniversityToken[]>([]);
  const [prices, setPrices] = useState<PricesData>({});
  const [marketTrends, setMarketTrends] = useState<MarketTrends>({ topGainers: [], topLosers: [], mostTraded: [] });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<UniversityToken | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tokensData, marketData] = await Promise.all([
          fetchAllTokens(),
          fetchMarketData()
        ]);
        setTokens(tokensData);
        setPrices(marketData.prices);
        setMarketTrends(marketData.marketTrends);
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError('Failed to load token data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTokens = searchQuery
    ? tokens.filter(token =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.institution.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : tokens;

  const handleBuyToken = async () => {
    if (!selectedToken) return;

    const quantityNum = Number(quantity);
    if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    setIsBuying(true);

    try {
      const response = await buyToken(selectedToken.id, quantityNum, selectedToken.currentPrice);

      if (response.status) {
        alert(`Successfully purchased ${quantityNum} ${selectedToken.symbol} tokens!`);
        setSelectedToken(null);
        setQuantity('');

        // Refresh token data
        const [tokensData, marketData] = await Promise.all([
          fetchAllTokens(),
          fetchMarketData()
        ]);

        setTokens(tokensData);
        setPrices(marketData.prices);
        setMarketTrends(marketData.marketTrends);
      } else {
        alert(response.message || 'Failed to purchase tokens');
      }
    } catch (error) {
      console.error('Error buying tokens:', error);
      alert('An error occurred while purchasing tokens');
    } finally {
      setIsBuying(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">University Token Marketplace</h1>

      {marketTrends && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Top Gainer */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Gainer (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{marketTrends.topGainers[0]?.symbol || '-'}</p>
                <span className="ml-2 text-green-600">+{marketTrends.topGainers[0] ? Number(marketTrends.topGainers[0].change).toFixed(2) : '0.00'}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Loser (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{marketTrends.topLosers[0]?.symbol || '-'}</p>
                <span className="ml-2 text-red-600">{marketTrends.topLosers[0] ? Number(marketTrends.topLosers[0].change).toFixed(2) : '0.00'}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-6">
        <Input
          placeholder="Search tokens by name, symbol, or university"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>University Tokens</CardTitle>
          <CardDescription>
            Invest in Nigerian universities with university tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading tokens...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : filteredTokens.length === 0 ? (
            <div className="text-center py-4">No tokens found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="p-3 font-medium">Token</th>
                    <th className="p-3 font-medium">University</th>
                    <th className="p-3 font-medium">Price</th>
                    <th className="p-3 font-medium">24h Change</th>
                    <th className="p-3 font-medium">Market Cap</th>
                    <th className="p-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTokens.map((token) => {
                    const priceInfo = prices[token.symbol] || { current: token.currentPrice, change24h: token.priceChange24h, volume24h: token.volume24h };
                    return (
                      <tr key={token.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center">
                            {/* No logo in API, skip */}
                            <div>
                              <div className="font-medium">{token.symbol}</div>
                              <div className="text-sm text-gray-500">{token.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">{token.institution}</td>
                        <td className="p-3">{formatCurrency(priceInfo.current)}</td>
                        <td className="p-3">
                          <span className={parseFloat(priceInfo.change24h) >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {parseFloat(priceInfo.change24h) >= 0 ? '+' : ''}{parseFloat(priceInfo.change24h).toFixed(2)}%
                          </span>
                        </td>
                        <td className="p-3">{formatCurrency(token.totalSupply)}</td>
                        <td className="p-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedToken(token)}
                          >
                            Buy
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedToken && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Buy {selectedToken.symbol} Token</CardTitle>
              <CardDescription>
                Current Price: {formatCurrency(selectedToken.currentPrice)} per token
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter number of tokens"
                  />
                </div>
                
                {quantity && !isNaN(Number(quantity)) && Number(quantity) > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Total Cost
                    </label>
                    <div className="text-xl font-bold">
                      {formatCurrency(selectedToken.currentPrice * Number(quantity))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setSelectedToken(null);
                setQuantity('');
              }}>
                Cancel
              </Button>
              <Button onClick={handleBuyToken} disabled={isBuying || !quantity || isNaN(Number(quantity)) || Number(quantity) <= 0}>
                {isBuying ? 'Processing...' : 'Confirm Purchase'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
