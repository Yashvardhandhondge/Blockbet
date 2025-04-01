
import React from 'react';
import { Award, Medal, Trophy, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';

// Demo leaderboard data with sample users
const leaderboardData = [
  {
    id: '1',
    username: 'Satoshi',
    rank: 1,
    wins: 87,
    bets: 142,
    winRate: '61.3%',
    totalWinnings: 0.00985,
    avatar: '/Mempool Bitcoin Explorer.svg'
  },
  {
    id: '2',
    username: 'BitcoinWhale',
    rank: 2,
    wins: 65,
    bets: 110,
    winRate: '59.1%',
    totalWinnings: 0.00873,
    avatar: '/Binance Pool.svg'
  },
  {
    id: '3',
    username: 'BlockMaster',
    rank: 3,
    wins: 59,
    bets: 102,
    winRate: '57.8%',
    totalWinnings: 0.00764,
    avatar: '/Viabtc Bitcoin Explorer.svg'
  },
  {
    id: '4',
    username: 'HashRacer',
    rank: 4,
    wins: 51,
    bets: 98,
    winRate: '52.0%',
    totalWinnings: 0.00689,
    avatar: '/Bitcoin Explorer.svg'
  },
  {
    id: '5',
    username: 'CryptoQueen',
    rank: 5,
    wins: 48,
    bets: 93,
    winRate: '51.6%',
    totalWinnings: 0.00612,
    avatar: '/Luxor Bitcoin Explorer.svg'
  },
  {
    id: '6',
    username: 'SatsHunter',
    rank: 6,
    wins: 45,
    bets: 89,
    winRate: '50.6%',
    totalWinnings: 0.00587,
    avatar: '/Antpool Bitcoin Explorer.svg'
  },
  {
    id: '7',
    username: 'BlockchainNinja',
    rank: 7,
    wins: 43,
    bets: 86,
    winRate: '50.0%',
    totalWinnings: 0.00523,
    avatar: '/Mempool Bitcoin Explorer (1).svg'
  },
  {
    id: '8',
    username: 'MinerMax',
    rank: 8,
    wins: 40,
    bets: 82,
    winRate: '48.8%',
    totalWinnings: 0.00495,
    avatar: '/Spiderpool Bitcoin Explorer.svg'
  },
  {
    id: '9',
    username: 'BitBaron',
    rank: 9,
    wins: 38,
    bets: 79,
    winRate: '48.1%',
    totalWinnings: 0.00478,
    avatar: '/Mempool Bitcoin Explorer (2).svg'
  },
  {
    id: '10',
    username: 'SatsCollector',
    rank: 10,
    wins: 36,
    bets: 76,
    winRate: '47.4%',
    totalWinnings: 0.00452,
    avatar: '/Mempool Bitcoin Explorer (3).svg'
  },
];

const LeaderboardPage = () => {
  const { user } = useAuth();
  const currentUserRank = user ? 24 : null; // If logged in, show sample rank

  // Get the rank display with trophy icons for top 3
  const getRankDisplay = (rank: number) => {
    switch(rank) {
      case 1:
        return (
          <div className="flex items-center justify-center">
            <Trophy className="h-5 w-5 text-yellow-400 mr-1" />
            <span>1st</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center">
            <Medal className="h-5 w-5 text-gray-300 mr-1" />
            <span>2nd</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center">
            <Medal className="h-5 w-5 text-amber-600 mr-1" />
            <span>3rd</span>
          </div>
        );
      default:
        return <span>{rank}th</span>;
    }
  };

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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-32 pb-20 flex-grow">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
                <Trophy className="h-8 w-8 text-btc-orange" />
                <span className="text-white">Leaderboard</span>
              </h1>
              <p className="text-white/60">
                Top players ranked by total winnings
              </p>
            </div>
            
            {/* Current user rank information */}
            {currentUserRank && (
              <div className="bg-btc-darker/40 backdrop-blur-md border border-white/5 rounded-xl p-3 flex items-center gap-4">
                <span className="text-white/60">Your Rank:</span>
                <span className="font-bold text-white text-lg">{currentUserRank}</span>
              </div>
            )}
          </div>
          
          {/* Leaderboard Table */}
          <div className="bg-btc-darker/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 md:p-6 shadow-xl">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-16 text-center text-white/60">Rank</TableHead>
                  <TableHead className="text-white/60">Player</TableHead>
                  <TableHead className="text-right text-white/60 hidden md:table-cell">Wins</TableHead>
                  <TableHead className="text-right text-white/60 hidden md:table-cell">Bets</TableHead>
                  <TableHead className="text-right text-white/60 hidden sm:table-cell">Win Rate</TableHead>
                  <TableHead className="text-right text-white/60">Total Winnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((player) => (
                  <TableRow 
                    key={player.id} 
                    className={`border-white/5 ${player.rank <= 3 ? 'bg-btc-darker/50' : ''} hover:bg-white/5`}
                  >
                    <TableCell className="font-medium text-center">
                      {getRankDisplay(player.rank)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-white/10">
                          <AvatarImage src={player.avatar} alt={player.username} />
                          <AvatarFallback className="bg-btc-darker text-btc-orange font-bold">
                            {player.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-white">{player.username}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">{player.wins}</TableCell>
                    <TableCell className="text-right hidden md:table-cell">{player.bets}</TableCell>
                    <TableCell className="text-right hidden sm:table-cell">{player.winRate}</TableCell>
                    <TableCell className="text-right font-medium">
                      <span className="font-mono">{player.totalWinnings.toFixed(8)}</span> BTC
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <Footer />
      </div>
    </BackgroundGradientAnimation>
  );
};

export default LeaderboardPage;
