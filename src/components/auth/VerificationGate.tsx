'use client';

import { useState } from 'react';
import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MailCheck, ShieldAlert } from 'lucide-react';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export function VerificationGate({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const handleResend = async () => {
    if (!user) return;
    setIsSending(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your inbox (and spam folder).',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to send email',
        description: error.message,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleReload = async () => {
    if (!user) return;
    setIsReloading(true);
    try {
        await user.reload();
        // The onAuthStateChanged listener in FirebaseProvider will automatically
        // pick up the change and re-render the app. We don't need to force a router refresh.
        // We check the user object directly after reload.
        if(user.emailVerified) {
             toast({
                title: 'Email Verified!',
                description: 'Welcome to Evergreen Muse.',
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Email Not Verified',
                description: 'Please click the link in your email first.',
            });
        }
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Failed to reload',
            description: 'Please try again in a moment.',
        });
    } finally {
      setIsReloading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    // Let the AppLayout's effect handle the redirect.
  };

  // If user exists but email is not verified, show the gate.
  // The isUserLoading check is handled by the parent AppLayout.
  if (user && !user.emailVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="glass-panel w-full max-w-md">
          <CardHeader>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ShieldAlert className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Check your Inbox</CardTitle>
              <CardDescription>
                We've sent a verification link to{' '}
                <span className="font-semibold text-foreground">{user.email}</span>.
                You cannot enter the forest until you verify your email.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
             <Button onClick={handleReload} disabled={isReloading}>
              {isReloading ? <Loader2 className="animate-spin" /> : <><MailCheck className="mr-2"/>I've verified my email</>}
            </Button>
            <Button variant="secondary" onClick={handleResend} disabled={isSending}>
              {isSending ? <Loader2 className="animate-spin" /> : 'Resend verification link'}
            </Button>
          </CardContent>
          <CardFooter>
             <Button variant="link" className="w-full text-muted-foreground" onClick={handleSignOut}>
                Sign out
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // User is verified, or no user is logged in (which AppLayout will handle).
  return <>{children}</>;
}
