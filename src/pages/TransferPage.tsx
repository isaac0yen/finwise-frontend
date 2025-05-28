import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';

// This would be implemented in the API module
const createTransfer = async (recipientEmail: string, amount: number, currency: string = 'NGN') => {
  const response = await fetch('https://acad-celestia-backend.mygenius.ng/api/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ recipientEmail, amount, currency })
  });
  return response.json();
};

export default function TransferPage() {
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientEmail) {
      alert('Please enter recipient email');
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await createTransfer(recipientEmail, Number(amount));
      
      if (response.status) {
        setIsSuccess(true);
        setTransactionDetails(response.data);
      } else {
        alert(response.message || 'Failed to process transfer');
      }
    } catch (error) {
      console.error('Error processing transfer:', error);
      alert('An error occurred while processing the transfer');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isSuccess) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Transfer Successful</CardTitle>
            <CardDescription>
              Your transfer has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Amount:</span> ₦{amount}
              </p>
              <p>
                <span className="font-medium">Recipient:</span> {recipientEmail}
              </p>
              {transactionDetails?.reference && (
                <p>
                  <span className="font-medium">Reference:</span> {transactionDetails.reference}
                </p>
              )}
              <p className="text-green-600 mt-4">Funds have been transferred successfully!</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.href = '/dashboard'} className="w-full">
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Transfer Funds</h1>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Send Money</CardTitle>
          <CardDescription>
            Transfer funds to another FinWise user
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="recipientEmail">Recipient Email</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="Enter recipient's email address"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  required
                />
              </div>
              
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
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Transfer'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
