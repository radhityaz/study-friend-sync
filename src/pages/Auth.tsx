
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedCard } from '@/components/common/AnimatedCard';
import { Logo } from '@/components/common/Logo';

const Auth = () => {
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if user is already logged in
  if (user && !loading) {
    return <Navigate to="/" />;
  }
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      setIsSubmitting(true);
      await signIn(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      setIsSubmitting(true);
      await signUp(email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <Logo size="lg" />
          <p className="mt-2 text-muted-foreground">
            Aplikasi untuk membantu perencanaan akademik dan manajemen waktu
          </p>
        </div>
        
        <AnimatedCard animation="fade" className="opacity-0 animate-fade-in">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Masuk ke akun Anda yang sudah terdaftar
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="nama@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-muted" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Atau login dengan
                        </span>
                      </div>
                    </div>

                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handleGoogleSignIn}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.8,12.5v-2h-2v2h-2v2h2v2h2v-2h2v-2H21.8z"/>
                        <path d="M9.8,12c0-1.4,0.5-2.5,1.3-3.2C9.9,7.5,8.3,7.9,7.1,9c-1.3,1.3-1.5,3.7-0.1,5.2c1.4,1.5,3.8,1.6,5.2,0.2c0.9-0.9,1.2-1.9,1.3-3 c-0.7,0-2.3,0-3,0C10.4,11.5,9.8,12,9.8,12z"/>
                        <path d="M11.7,15.5c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8c0.9,0,1.8,0.3,2.5,0.9"/>
                      </svg>
                      Google
                    </Button>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                          <span>Loading...</span>
                        </div>
                      ) : 'Login'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Register</CardTitle>
                  <CardDescription>
                    Daftar akun baru untuk memulai
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input 
                        id="register-email" 
                        type="email" 
                        placeholder="nama@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input 
                        id="register-password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Password minimal 6 karakter
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-muted" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Atau daftar dengan
                        </span>
                      </div>
                    </div>

                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handleGoogleSignIn}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.8,12.5v-2h-2v2h-2v2h2v2h2v-2h2v-2H21.8z"/>
                        <path d="M9.8,12c0-1.4,0.5-2.5,1.3-3.2C9.9,7.5,8.3,7.9,7.1,9c-1.3,1.3-1.5,3.7-0.1,5.2c1.4,1.5,3.8,1.6,5.2,0.2c0.9-0.9,1.2-1.9,1.3-3 c-0.7,0-2.3,0-3,0C10.4,11.5,9.8,12,9.8,12z"/>
                        <path d="M11.7,15.5c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8c0.9,0,1.8,0.3,2.5,0.9"/>
                      </svg>
                      Google
                    </Button>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                          <span>Loading...</span>
                        </div>
                      ) : 'Register'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default Auth;
