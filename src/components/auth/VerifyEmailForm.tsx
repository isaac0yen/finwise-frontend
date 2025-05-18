// src/components/auth/VerifyEmailForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, ShieldCheck, MailQuestion } from 'lucide-react';

import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Label } from '../ui/label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '../ui/use-toast';
import { verifyEmailSchema, type VerifyEmailFormData } from '../../lib/schemas';
import AuthLayout from './AuthLayout';
// import { apiVerifyEmail, apiResendVerificationCode } from '@/lib/api'; // Your actual API call functions

const VerifyEmailForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [userEmail] = useState<string>('your-email@example.com'); // Placeholder

  // In a real app, get the user's email from context/localStorage after sign-up
  // or pass it via route state.
  useEffect(() => {
    // const emailFromState = (navigate.state as { email?: string })?.email;
    // const storedEmail = localStorage.getItem('userEmailForVerification');
    // if (emailFromState) setUserEmail(emailFromState);
    // else if (storedEmail) setUserEmail(storedEmail);
    // else navigate('/sign-up'); // Or handle appropriately if email is not available
    // For now, we'll use the placeholder.
  }, [navigate]);

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: '',
    },
  });

  const { control, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: VerifyEmailFormData) => {
    setIsLoading(true);
    setServerError(null);
    const token = localStorage.getItem('authToken');
    if (!token) {
      setServerError("Authentication session expired. Please sign up or log in again.");
      setIsLoading(false);
      navigate('/sign-up'); // Or login if appropriate
      return;
    }

    try {
      const response = await import('../../lib/api/auth').then(m => m.verifyEmail(token, data.code));
      if (response.status) {
        toast({
          title: "Email Verified!",
          description: response.message,
          variant: "default",
        });
        localStorage.removeItem('userEmailForVerification');
        navigate('/set-password');
      } else {
        setServerError(response.message || 'Verification failed. Invalid or expired code.');
      }
    } catch (error: any) {
      setServerError(error.message || 'An unexpected error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setServerError(null); // Clear previous errors
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication session expired. Cannot resend code.",
        variant: "destructive",
      });
      setIsResending(false);
      navigate('/sign-up');
      return;
    }
    try {
      const response = await import('../../lib/api/auth').then(m => m.resendVerificationCode(token));
      if (response.status) {
        toast({
          title: "Code Resent",
          description: `A new verification code has been sent to ${userEmail}.`,
        });
      } else {
        toast({
          title: "Error Resending Code",
          description: response.message || "Could not resend code. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error Resending Code",
        description: error.message || "Could not resend code. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      description={`Enter the 6-digit code sent to ${userEmail}. Check your spam folder too!`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              {/* Title and description are in AuthLayout */}
            </CardHeader>
            <CardContent className="space-y-6">
              {serverError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Verification Failed</AlertTitle>
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col items-center space-y-2">
                <Label htmlFor="verification-code" className="sr-only">Verification Code</Label>
                <Controller
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <InputOTP
                      id="verification-code"
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                      aria-invalid={errors.code ? "true" : "false"}
                    >
                      <InputOTPGroup className="gap-2">
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className={`h-12 w-12 text-lg sm:h-14 sm:w-14 ${errors.code ? 'border-destructive focus:ring-destructive' : ''}`}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                {errors.code && <p className="text-sm text-destructive mt-2">{errors.code.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4">
              <Button type="submit" className="w-full" disabled={isLoading || isResending}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Verify Email
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendCode}
                disabled={isLoading || isResending}
              >
                {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailQuestion className="mr-2 h-4 w-4" />}
                Resend Code
              </Button>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Entered the wrong email?{' '}
                <Link to="/sign-up" className="font-semibold text-primary hover:underline">
                  Sign Up Again
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </AuthLayout>
  );
};

export default VerifyEmailForm;