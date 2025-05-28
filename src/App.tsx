// src/App.tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SignUpForm from './components/auth/SignUpForm';
import VerifyEmailForm from './components/auth/VerifyEmailForm';
import SetPasswordForm from './components/auth/SetPasswordForm';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/dashboard/Dashboard';
import Layout from './pages/Layout';
import DepositPage from './pages/DepositPage';
import WithdrawalPage from './pages/WithdrawalPage';
import TransactionsPage from './pages/TransactionsPage';
import TransferPage from './pages/TransferPage';
import TokenMarketplacePage from './pages/TokenMarketplacePage';
import TokenPortfolioPage from './pages/TokenPortfolioPage';
import TokenTransactionsPage from './pages/TokenTransactionsPage';

// Protected route component to handle authentication
const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    // Still loading, show nothing or a loader
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

function App() {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/sign-up" element={<SignUpForm />} />
      <Route path="/verify-email" element={<VerifyEmailForm />} />
      <Route path="/set-password" element={<SetPasswordForm />} />
      <Route path="/login" element={<LoginForm />} />

      {/* Protected Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="deposit" element={<ProtectedRoute element={<DepositPage />} />} />
        <Route path="withdraw" element={<ProtectedRoute element={<WithdrawalPage />} />} />
        <Route path="transfer" element={<ProtectedRoute element={<TransferPage />} />} />
        <Route path="transactions" element={<ProtectedRoute element={<TransactionsPage />} />} />
        <Route path="tokens">
          <Route path="marketplace" element={<ProtectedRoute element={<TokenMarketplacePage />} />} />
          <Route path="portfolio" element={<ProtectedRoute element={<TokenPortfolioPage />} />} />
          <Route path="transactions" element={<ProtectedRoute element={<TokenTransactionsPage />} />} />
        </Route>
      </Route>

      {/* Add a 404 Not Found Route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;