
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HowToPlay from "./pages/HowToPlay";
import Auth from "./pages/Auth";
import Leaderboard from "./pages/Leaderboard";
import Wallet from "./pages/Wallet";
import LnurlCallback from "./pages/LnurlCallback";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/ui/theme-provider";

function App() {
  // Create a client instance inside the component to ensure hooks work properly
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" attribute="class">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/how-to-play" element={<HowToPlay />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/auth/lnurl-callback" element={<LnurlCallback />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
