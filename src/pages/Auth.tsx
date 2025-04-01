
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bitcoin, Lock, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';

const Auth = () => {
  const { user, signIn, signUp, isLoading } = useAuth();
  const location = useLocation();
  
  // If user is already logged in, redirect to home
  if (user) {
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(0, 0, 0)" 
      gradientBackgroundEnd="rgb(7, 7, 7)" 
      firstColor="#FFCC66" 
      secondColor="#D19CFF" 
      thirdColor="#7AE5FF" 
      fourthColor="#FFBB7A" 
      fifthColor="#FFDF7A"
      pointerColor="rgba(255, 190, 60, 0.4)"
      blendingValue="hard-light"
      className="w-full h-full"
      containerClassName="min-h-screen"
    >
      <div className="min-h-screen">
        <Navbar />
        
        <div className="container max-w-md mx-auto px-4 pt-32 pb-20">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-btc-darker/80 p-4 rounded-full border border-btc-orange/20">
                <Bitcoin size={32} className="text-btc-orange" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              <span className="text-gradient">Welcome to </span>
              <span className="text-white">BlockBet</span>
            </h1>
            <p className="text-white/60">
              Sign in to your account or create a new one
            </p>
          </div>
          
          <div className="bg-btc-darker/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
            <AuthTabs />
          </div>
        </div>
        
        <Footer />
      </div>
    </BackgroundGradientAnimation>
  );
};

const AuthTabs = () => {
  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger 
          value="login"
          className="data-[state=active]:bg-btc-orange/20 data-[state=active]:text-btc-orange"
        >
          Login
        </TabsTrigger>
        <TabsTrigger 
          value="signup"
          className="data-[state=active]:bg-btc-orange/20 data-[state=active]:text-btc-orange"
        >
          Sign Up
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
      
      <TabsContent value="signup">
        <SignupForm />
      </TabsContent>
    </Tabs>
  );
};

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error) {
      // Error is handled in the auth context
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
          <Input 
            id="email" 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 bg-btc-darker/90 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 bg-btc-darker/90 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-btc-orange hover:bg-btc-orange/80 text-btc-darker font-semibold"
      >
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    try {
      await signUp(email, password);
      // Clear form after successful submission
      setEmail('');
      setPassword('');
    } catch (error) {
      // Error is handled in the auth context
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-white">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
          <Input 
            id="signup-email" 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 bg-btc-darker/90 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-white">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
          <Input 
            id="signup-password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="pl-10 bg-btc-darker/90 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
        <p className="text-xs text-white/40 mt-1">Password must be at least 6 characters</p>
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-btc-orange hover:bg-btc-orange/80 text-btc-darker font-semibold"
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default Auth;
