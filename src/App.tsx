
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Leaderboard from './pages/Leaderboard';
import HowToPlay from './pages/HowToPlay';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import LnurlCallback from './pages/LnurlCallback';
import Wallet from './pages/Wallet';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/ui/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { MiningPoolStatsProvider } from './hooks/use-mining-pool-stats';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <MiningPoolStatsProvider>
            <Toaster />
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/how-to-play" element={<HowToPlay />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/lnurl-auth-callback" element={<LnurlCallback />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </MiningPoolStatsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
