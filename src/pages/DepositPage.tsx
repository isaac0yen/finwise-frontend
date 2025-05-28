import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';

// This would be implemented in the API module
const initializeDeposit = async (amount: number) => {
  const response = await fetch('https://acad-celestia-backend.mygenius.ng/api/deposit/initialize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ amount })
  });
  return response.json();
};

export default function DepositPage() {
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  // Redirect to Paystack as soon as authUrl is set
  useEffect(() => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  }, [authUrl]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    // Add 1.5% commission to the deposited amount
    const commission = Number(amount) * 0.015;
    const totalAmount = Number(amount) + commission;
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await initializeDeposit(totalAmount);
      
      if (response.status) {
        setAuthUrl(response.authorization_url);
        setReference(response.reference);
      } else {
        alert(response.message || 'Failed to initialize deposit');
      }
    } catch (error) {
      console.error('Error initializing deposit:', error);
      alert('An error occurred while initializing the deposit');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Deposit Funds</h1>
      
      {/* While waiting for authUrl, show the form. Once authUrl is set, user will be redirected automatically. */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Make a Deposit</CardTitle>
          <CardDescription>
            Enter the amount you want to deposit into your wallet
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Deposit'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
