import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

interface TokenTransaction {
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

// This would be implemented in the API module
const fetchTokenTransactions = async (): Promise<TokenTransaction[]> => {
  const response = await fetch('https://acad-celestia-backend.mygenius.ng/api/token/transactions', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await response.json();
  return data.status ? data.data : [];
};

export default function TokenTransactionsPage() {
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const data = await fetchTokenTransactions();
        setTransactions(data);
      } catch (err) {
        console.error('Error fetching token transactions:', err);
        setError('Failed to load token transactions');
      } finally {
        setIsLoading(false);
      }
    };

    getTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <h1 className="text-3xl font-bold mb-8">Token Transaction History</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Token Transactions</CardTitle>
          <CardDescription>
            View your university token trading history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading transactions...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-4">No token transactions found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="p-3 font-medium">Type</th>
                    <th className="p-3 font-medium">Token</th>
                    <th className="p-3 font-medium">Quantity</th>
                    <th className="p-3 font-medium">Price</th>
                    <th className="p-3 font-medium">Total</th>
                    <th className="p-3 font-medium">Fee</th>
                    <th className="p-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'buy' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'buy' ? 'Buy' : 'Sell'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{transaction.symbol}</div>
                          <div className="text-sm text-gray-500">{transaction.university}</div>
                        </div>
                      </td>
                      <td className="p-3">{transaction.quantity.toLocaleString()}</td>
                      <td className="p-3">{formatCurrency(transaction.price)}</td>
                      <td className="p-3">{formatCurrency(transaction.totalAmount)}</td>
                      <td className="p-3">{transaction.fee ? formatCurrency(transaction.fee) : '-'}</td>
                      <td className="p-3">{formatDate(transaction.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
