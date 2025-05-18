// src/components/auth/SignUpForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, Mail, Fingerprint } from 'lucide-react';

import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '../ui/use-toast'; // for potential success messages before redirect
import { signUpSchema, type SignUpFormData } from '../../lib/schemas';
import AuthLayout from './AuthLayout';
// import { apiSignUp } from '@/lib/api'; // Your actual API call function

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nin: '',
      email: '',
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const response = await import('../../lib/api/auth').then(m => m.signUp(data.nin, data.email));
      if (response.status && response.token) {
        localStorage.setItem('authToken', response.token);
        toast({
          title: "Account Created!",
          description: response.message,
          variant: "default",
        });
        navigate('/verify-email');
      } else {
        setServerError(response.message || 'Sign up failed. Please try again.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your Account" description="Enter your NIN and email to get started.">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              {/* Title and description are now in AuthLayout */}
            </CardHeader>
            <CardContent className="space-y-6">
              {serverError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Sign Up Failed</AlertTitle>
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="nin">National Identification Number (NIN)</Label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="nin"
                    placeholder="Enter your NIN"
                    {...register('nin')}
                    className={`pl-10 ${errors.nin ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.nin && <p className="text-sm text-destructive mt-1">{errors.nin.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                 <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign Up
              </Button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </AuthLayout>
  );
};

export default SignUpForm;