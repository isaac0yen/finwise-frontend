import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';

interface BankAccount {
  status: boolean;
  message: string;
  data?: {
    account_name: string;
    account_number: string;
    bank_code: string;
  };
}

interface Bank {
  id: number;
  name: string;
  code: string;
  active: boolean;
}

const fetchBanks = async (): Promise<Bank[]> => {
  const response = await fetch('https://acad-celestia-backend.mygenius.ng/api/withdrawal/banks', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const result = await response.json();
  return result.status ? result.data : [];
};

const resolveAccount = async (account_number: string, bank_code: string): Promise<BankAccount> => {
  const response = await fetch('https://acad-celestia-backend.mygenius.ng/api/withdrawal/resolve-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ account_number, bank_code })
  });
  return response.json();
};

// Make the requestWithdrawal function take the banks array as a parameter
const requestWithdrawal = async (amount: number, bank_code: string, account_number: string, account_name: string, banksList: Bank[]) => {
  const bank = banksList.find(b => b.code === bank_code);
  
  // Ensure we have a valid bank name
  if (!bank || !bank.name) {
    throw new Error('Invalid bank selected. Please select a valid bank.');
  }
  const response = await fetch('https://acad-celestia-backend.mygenius.ng/api/withdrawal/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      amount,
      currency: 'NGN',
      bank_name: bank?.name,
      account_number,
      account_name
    })
  });
  return response.json();
};

// Bank list will be populated from API via the useState hook

export default function WithdrawalPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [bankCode, setBankCode] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadBanks = async () => {
      try {
        const bankData = await fetchBanks();
        setBanks(bankData);
      } catch (error) {
        console.error('Error fetching banks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBanks();
  }, []);
  
  const handleVerifyAccount = async () => {
    if (!accountNumber || !bankCode) {
      alert('Please enter account number and select a bank');
      return;
    }
    
    setIsVerifying(true);
    
    try {
      const response = await resolveAccount(accountNumber, bankCode);
      
      if (response.status && response.data?.account_name) {
        setAccountName(response.data.account_name);
        setIsVerified(true);
      } else {
        alert(response.message || 'Failed to verify account');
        setIsVerified(false);
      }
    } catch (error) {
      console.error('Error verifying account:', error); 
      alert('An error occurred while verifying the account');
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isVerified) {
      alert('Please verify account first');
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await requestWithdrawal(Number(amount), bankCode, accountNumber, accountName, banks);
      
      if (response.status) {
        setIsSuccess(true);
      } else {
        alert(response.message || 'Failed to process withdrawal');
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('An error occurred while processing the withdrawal');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <p>Loading banks...</p>
      </div>
    );
  }
  
  if (isSuccess) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Withdrawal Successful</CardTitle>
            <CardDescription>
              Your withdrawal request has been submitted successfully
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Amount: ₦{amount}</p>
            <p className="mb-2">Account: {accountNumber}</p>
            <p className="mb-2">Bank: {banks.find(b => b.code === bankCode)?.name}</p>
            <p>Your withdrawal is being processed and should be completed within 24 hours.</p>
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
      <h1 className="text-3xl font-bold mb-8">Withdraw Funds</h1>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Request Withdrawal</CardTitle>
          <CardDescription>
            Enter your bank details and amount to withdraw
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="bank">Bank</Label>
                <select
                  id="bank"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={bankCode}
                  onChange={(e) => {
                    setBankCode(e.target.value);
                    setIsVerified(false);
                  }}
                  required
                  disabled={isVerified}
                >
                  <option value="">Select a bank</option>
                  {banks.filter(bank => bank.active).map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter 10-digit account number"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                    setIsVerified(false);
                  }}
                  required
                  maxLength={10}
                  minLength={10}
                  pattern="[0-9]{10}"
                  disabled={isVerified}
                />
              </div>
              
              {!isVerified ? (
                <Button 
                  type="button" 
                  onClick={handleVerifyAccount} 
                  disabled={isVerifying || !bankCode || accountNumber.length !== 10}
                  className="w-full"
                >
                  {isVerifying ? 'Verifying...' : 'Verify Account'}
                </Button>
              ) : (
                <>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Account Name</Label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm">
                      {accountName}
                    </div>
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
                </>
              )}
            </div>
          </CardContent>
          {isVerified && (
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setIsVerified(false);
                setAccountName('');
              }}>
                Change Account
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Withdraw'}
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  );
}
