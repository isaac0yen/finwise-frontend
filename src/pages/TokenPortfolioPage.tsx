import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface TokenHolding {
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

interface PortfolioSummary {
  totalPortfolioValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
}

// This would be implemented in the API module
const fetchTokenPortfolio = async (): Promise<{ holdings: TokenHolding[], summary: PortfolioSummary }> => {
  const response = await fetch('https://acad-celestia-backend.mygenius.ng/api/token/portfolio', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await response.json();
  return data.status ? data.data : { holdings: [], summary: { totalPortfolioValue: 0, totalProfitLoss: 0, totalProfitLossPercentage: 0 } };
};

const sellToken = async (tokenId: string, quantity: number, price: number) => {
  const response = await fetch('https://acad-celestia-backend.mygenius.ng/api/token/sell', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ tokenId, quantity, price })
  });
  return response.json();
};

export default function TokenPortfolioPage() {
  const [holdings, setHoldings] = useState<TokenHolding[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenHolding | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [isSelling, setIsSelling] = useState<boolean>(false);
  
  const fetchPortfolioData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTokenPortfolio();
      setHoldings(data.holdings);
      setSummary(data.summary);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError('Failed to load portfolio data');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPortfolioData();
  }, []);
  
  const handleSellToken = async () => {
    if (!selectedToken) return;
    
    const quantityNum = Number(quantity);
    if (!quantity || isNaN(quantityNum) || quantityNum <= 0 || quantityNum > selectedToken.quantity) {
      alert('Please enter a valid quantity');
      return;
    }
    
    setIsSelling(true);
    
    try {
      const response = await sellToken(selectedToken.id, quantityNum, selectedToken.currentPrice);
      
      if (response.status) {
        alert(`Successfully sold ${quantityNum} ${selectedToken.symbol} tokens!`);
        setSelectedToken(null);
        setQuantity('');
        
        // Refresh portfolio data
        fetchPortfolioData();
      } else {
        alert(response.message || 'Failed to sell tokens');
      }
    } catch (error) {
      console.error('Error selling tokens:', error);
      alert('An error occurred while selling tokens');
    } finally {
      setIsSelling(false);
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Token Portfolio</h1>
      
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalPortfolioValue)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <p className={`text-2xl font-bold ${summary.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summary.totalProfitLoss)}
                </p>
                <span className={`ml-2 ${summary.totalProfitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({summary.totalProfitLossPercentage >= 0 ? '+' : ''}{summary.totalProfitLossPercentage.toFixed(2)}%)
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{holdings.length} tokens</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Your Token Holdings</CardTitle>
          <CardDescription>
            View and manage your university token investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading portfolio data...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : holdings.length === 0 ? (
            <div className="text-center py-8">
              <p className="mb-4">You don't have any tokens in your portfolio yet.</p>
              <Button onClick={() => window.location.href = '/tokens/marketplace'}>
                Explore Tokens
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="p-3 font-medium">Token</th>
                    <th className="p-3 font-medium">Quantity</th>
                    <th className="p-3 font-medium">Avg. Buy Price</th>
                    <th className="p-3 font-medium">Current Price</th>
                    <th className="p-3 font-medium">Total Value</th>
                    <th className="p-3 font-medium">Profit/Loss</th>
                    <th className="p-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((token) => (
                    <tr key={token.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center">
                          {token.logo && (
                            <img 
                              src={token.logo} 
                              alt={token.symbol} 
                              className="w-8 h-8 rounded-full mr-2"
                            />
                          )}
                          <div>
                            <div className="font-medium">{token.symbol}</div>
                            <div className="text-sm text-gray-500">{token.university}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{token.quantity.toLocaleString()}</td>
                      <td className="p-3">{formatCurrency(token.averageBuyPrice)}</td>
                      <td className="p-3">{formatCurrency(token.currentPrice)}</td>
                      <td className="p-3">{formatCurrency(token.totalValue)}</td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className={token.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(token.profitLoss)}
                          </span>
                          <span className={`text-sm ${token.profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ({token.profitLossPercentage >= 0 ? '+' : ''}{token.profitLossPercentage.toFixed(2)}%)
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedToken(token)}
                        >
                          Sell
                        </Button>
                      </td>
                    </tr>
                  ))}
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
              <CardTitle>Sell {selectedToken.symbol} Tokens</CardTitle>
              <CardDescription>
                Current Price: {formatCurrency(selectedToken.currentPrice)} per token
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="mb-2">You own: {selectedToken.quantity.toLocaleString()} tokens</p>
                  <p className="mb-4">Average buy price: {formatCurrency(selectedToken.averageBuyPrice)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity to Sell
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= selectedToken.quantity)) {
                          setQuantity(val);
                        }
                      }}
                      placeholder={`0 - ${selectedToken.quantity}`}
                      max={selectedToken.quantity}
                      min={0}
                    />
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => setQuantity(selectedToken.quantity.toString())}
                    >
                      Max
                    </Button>
                  </div>
                </div>
                
                {quantity && !isNaN(Number(quantity)) && Number(quantity) > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      You Will Receive
                    </label>
                    <div className="text-xl font-bold">
                      {formatCurrency(selectedToken.currentPrice * Number(quantity))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Note: A 10% fee will be charged on profits
                    </p>
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
              <Button 
                onClick={handleSellToken} 
                disabled={isSelling || !quantity || isNaN(Number(quantity)) || Number(quantity) <= 0 || Number(quantity) > selectedToken.quantity}
              >
                {isSelling ? 'Processing...' : 'Confirm Sale'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

// Missing component definition, adding it here
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};
