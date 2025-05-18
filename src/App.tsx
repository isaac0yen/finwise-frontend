// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUpForm from './components/auth/SignUpForm';
import VerifyEmailForm from './components/auth/VerifyEmailForm';
import SetPasswordForm from './components/auth/SetPasswordForm';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/dashboard/Dashboard';
// import Dashboard from './pages/Dashboard'; // Example protected route
// import ProtectedRoute from './components/auth/ProtectedRoute'; // Component to handle auth checks

function App() {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/sign-up" element={<SignUpForm />} />
      <Route path="/verify-email" element={<VerifyEmailForm />} /> {/* Ideally, protect this or pass state */}
      <Route path="/set-password" element={<SetPasswordForm />} /> {/* Ideally, protect this */}
      <Route path="/login" element={<LoginForm />} />

      <Route path="/dashboard" element={<Dashboard />} />


      {/* Redirect root to login or dashboard based on auth status */}
      <Route path="/" element={<Navigate to="/login" />} /> {/* Or to "/dashboard" if logged in */}
      {/* Add a 404 Not Found Route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;