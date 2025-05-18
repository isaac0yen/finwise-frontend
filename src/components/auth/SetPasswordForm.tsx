// src/components/auth/SetPasswordForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react';

import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '../ui/use-toast';
import { setPasswordSchema, type SetPasswordFormData } from '../../lib/schemas';
import AuthLayout from './AuthLayout';
// import { apiSetPassword } from '@/lib/api';

const SetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: SetPasswordFormData) => {
    setIsLoading(true);
    setServerError(null);
    const token = localStorage.getItem('authToken');
    if (!token) {
      setServerError("Authentication session expired. Please start over.");
      setIsLoading(false);
      navigate('/sign-up');
      return;
    }

    try {
      const response = await import('../../lib/api/auth').then(m => m.setPassword(token, data.password));
      if (response.status) {
        toast({
          title: "Password Set!",
          description: response.message + " You can now log in.",
        });
        localStorage.removeItem('authToken');
        navigate('/login');
      } else {
        setServerError(response.message || 'Failed to set password.');
      }
    } catch (error: any) {
      setServerError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    "At least 8 characters long",
    "Contains at least one number",
    "Contains at least one uppercase letter"
  ];

  return (
    <AuthLayout title="Set Your Password" description="Choose a strong password for your account.">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              {/* Title and description in AuthLayout */}
              <div className="mt-2 text-sm text-muted-foreground">
                Password must meet the following criteria:
                <ul className="list-disc list-inside mt-1">
                  {passwordRequirements.map(req => <li key={req}>{req}</li>)}
                </ul>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {serverError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register('password')}
                    className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 px-2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                   <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 px-2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Set Password & Proceed to Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </AuthLayout>
  );
};

export default SetPasswordForm;