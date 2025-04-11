
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useElementAppear } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bitcoin, Award, Target, HelpCircle, Info, BookOpen, ListChecks } from 'lucide-react';

const HowToPlay = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  // Animation for sections
  const headerAnimation = useElementAppear(!isLoading, {
    delay: 300
  });
  const tabsAnimation = useElementAppear(!isLoading, {
    delay: 500
  });

  return <BackgroundGradientAnimation 
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
    containerClassName="min-h-screen">
      <div className="min-h-screen pb-20 font-sans">
        {/* Loading screen */}
        <div className={cn("fixed inset-0 bg-btc-darker z-50 flex flex-col items-center justify-center transition-opacity duration-500", isLoading ? "opacity-100" : "opacity-0 pointer-events-none")}>
          <div className="relative h-20 w-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-btc-orange/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-btc-orange border-r-transparent animate-spin-slow"></div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-center px-4 font-display">
            <span className="text-gradient">Block</span>
            <span className="text-white">Bet</span>
          </h1>
          <p className="mt-2 text-white/60 text-center px-4">
            Loading How To Play
          </p>
        </div>
        
        {/* Main content */}
        <Navbar />
        
        <main className="container max-w-7xl mx-auto px-4 pt-24 pb-12">
          {/* Header */}
          <div style={headerAnimation.style} className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 font-display">
              <span className="text-white">How To </span>
              <span className="text-gradient">Play</span>
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-btc-orange/10 border border-btc-orange/20 text-btc-orange text-sm font-medium">
              <BookOpen size={16} />
              <span>Bitcoin Mining Pool Prediction Game Instructions</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={tabsAnimation.style} className="mb-12">
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 bg-btc-darker border border-btc-orange/20 rounded-lg p-1 font-display">
                <TabsTrigger value="basics" className="data-[state=active]:bg-btc-orange/20">
                  <HelpCircle className="mr-1 md:mr-2 h-4 w-4" />
                  <span>Basics</span>
                </TabsTrigger>
                <TabsTrigger value="rules" className="data-[state=active]:bg-btc-orange/20">
                  <ListChecks className="mr-1 md:mr-2 h-4 w-4" />
                  <span>Rules</span>
                </TabsTrigger>
                <TabsTrigger value="strategy" className="data-[state=active]:bg-btc-orange/20">
                  <Target className="mr-1 md:mr-2 h-4 w-4" />
                  <span>Strategy</span>
                </TabsTrigger>
                <TabsTrigger value="rewards" className="data-[state=active]:bg-btc-orange/20">
                  <Award className="mr-1 md:mr-2 h-4 w-4" />
                  <span>Rewards</span>
                </TabsTrigger>
                <TabsTrigger value="faq" className="data-[state=active]:bg-btc-orange/20">
                  <Info className="mr-1 md:mr-2 h-4 w-4" />
                  <span>FAQ</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Basics Tab */}
              <TabsContent value="basics" className="mt-6 space-y-6">
                <Card className="bg-btc-darker/50 border border-btc-orange/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bitcoin className="text-btc-orange" />
                      <span>What is BlockBet?</span>
                    </CardTitle>
                    <CardDescription>Understanding the Bitcoin mining prediction game</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80 leading-relaxed">
                      BlockBet is an exciting prediction game where players bet on which mining pool will mine the next Bitcoin block.
                      The Bitcoin blockchain operates on a decentralized network where multiple mining pools compete to solve complex
                      mathematical puzzles and add the next block to the blockchain.
                    </p>
                    
                    <div className="bg-btc-orange/5 border border-btc-orange/10 p-4 rounded-lg">
                      <h3 className="font-medium text-btc-orange mb-2">How the Game Works:</h3>
                      <ol className="list-decimal list-inside text-white/80 space-y-2">
                        <li>Fund your wallet with Bitcoin (sats).</li>
                        <li>Select a mining pool you think will mine the next block.</li>
                        <li>Place your bet by selecting your desired amount.</li>
                        <li>Wait for the next Bitcoin block to be mined.</li>
                        <li>If your chosen mining pool mines the block, you win!</li>
                      </ol>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h4 className="font-medium text-btc-orange mb-2 flex items-center gap-2">
                          <span className="bg-btc-orange/20 w-6 h-6 flex items-center justify-center rounded-full text-sm">1</span>
                          Fund Your Wallet
                        </h4>
                        <p className="text-white/70 text-sm">Start by depositing Bitcoin into your BlockBet wallet to participate in the game.</p>
                      </div>
                      
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h4 className="font-medium text-btc-orange mb-2 flex items-center gap-2">
                          <span className="bg-btc-orange/20 w-6 h-6 flex items-center justify-center rounded-full text-sm">2</span>
                          Choose a Mining Pool
                        </h4>
                        <p className="text-white/70 text-sm">Research and select the mining pool you believe will mine the next Bitcoin block.</p>
                      </div>
                      
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h4 className="font-medium text-btc-orange mb-2 flex items-center gap-2">
                          <span className="bg-btc-orange/20 w-6 h-6 flex items-center justify-center rounded-full text-sm">3</span>
                          Place Your Bets
                        </h4>
                        <p className="text-white/70 text-sm">Place your bets on your chosen mining pool and set your wagered amount.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Rules Tab */}
              <TabsContent value="rules" className="mt-6 space-y-6">
                <Card className="bg-btc-darker/50 border border-btc-orange/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListChecks className="text-btc-orange" />
                      <span>Game Rules</span>
                    </CardTitle>
                    <CardDescription>Complete rules and guidelines for BlockBet</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-btc-orange font-medium text-lg mb-2">General Rules</h3>
                        <ul className="list-disc list-inside text-white/80 space-y-2">
                          <li>Bets can only be placed before a new Bitcoin block is mined.</li>
                          <li>Minimum bet amount is 1,000 sats (0.00001000 BTC).</li>
                          <li>Maximum bet amount is 1,000,000 sats (0.01000000 BTC) per bet.</li>
                          <li>Players can place multiple bets on different mining pools.</li>
                          <li>All bets are final once placed and cannot be canceled after confirmation.</li>
                          <li>Payouts are processed automatically when results are confirmed.</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-btc-orange font-medium text-lg mb-2">Winning & Payouts</h3>
                        <ul className="list-disc list-inside text-white/80 space-y-2">
                          <li>If your chosen mining pool mines the block, you win.</li>
                          <li>Payout multipliers vary based on the historical hash rate distribution of mining pools.</li>
                          <li>Less probable mining pools have higher multipliers.</li>
                          <li>Winnings are automatically added to your wallet balance.</li>
                          <li>A 2% platform fee is applied to all winnings.</li>
                        </ul>
                      </div>
                      
                      <div className="bg-btc-orange/5 border border-btc-orange/10 p-4 rounded-lg">
                        <h3 className="font-medium text-btc-orange mb-2">Example Payout Multipliers:</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/80">Foundry USA</span>
                            <span className="text-btc-orange">2.5x</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/80">Antpool</span>
                            <span className="text-btc-orange">3.2x</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/80">F2Pool</span>
                            <span className="text-btc-orange">3.8x</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/80">Binance Pool</span>
                            <span className="text-btc-orange">4.5x</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/80">ViaBTC</span>
                            <span className="text-btc-orange">6.0x</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/80">Unknown/Other</span>
                            <span className="text-btc-orange">10.0x</span>
                          </div>
                        </div>
                        <p className="mt-3 text-xs text-white/50">Note: These multipliers are subject to change based on the current hash rate distribution.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Strategy Tab */}
              <TabsContent value="strategy" className="mt-6 space-y-6">
                <Card className="bg-btc-darker/50 border border-btc-orange/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="text-btc-orange" />
                      <span>Betting Strategies</span>
                    </CardTitle>
                    <CardDescription>Tips and strategies to increase your chances of winning</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80 leading-relaxed">
                      While Bitcoin mining is ultimately probabilistic, understanding mining pool dynamics can help you make more informed bets.
                      Here are some strategies to consider when playing BlockBet:
                    </p>
                    
                    <div className="space-y-6 mt-4">
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h3 className="font-medium text-btc-orange mb-2">Research Mining Pools</h3>
                        <p className="text-white/70">
                          Keep track of which mining pools have been consistently mining blocks recently. While past performance doesn't guarantee future results,
                          mining pools with higher hash rates statistically mine more blocks over time.
                        </p>
                      </div>
                      
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h3 className="font-medium text-btc-orange mb-2">Calculate Expected Value</h3>
                        <p className="text-white/70">
                          Consider the payout multiplier and the probability of a mining pool finding a block. For example, if a pool has a 20% chance of mining the next block
                          and offers a 5x payout, your expected value is positive (0.2 × 5 = 1.0).
                        </p>
                      </div>
                      
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h3 className="font-medium text-btc-orange mb-2">Diversify Your Bets</h3>
                        <p className="text-white/70">
                          Instead of placing all your sats on one mining pool, consider spreading your bets across several pools to increase your chances of winning,
                          though this may reduce your potential payout.
                        </p>
                      </div>
                      
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h3 className="font-medium text-btc-orange mb-2">Watch for Mining Pool Shifts</h3>
                        <p className="text-white/70">
                          Hash rate distribution between pools can change. Stay informed about major shifts in mining power, as they can affect the probability of a pool mining the next block.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-btc-orange/5 border border-btc-orange/10 p-4 rounded-lg mt-4">
                      <h3 className="font-medium text-btc-orange mb-2">Pro Tip:</h3>
                      <p className="text-white/80">
                        Keep an eye on block time. Bitcoin blocks are mined approximately every 10 minutes on average, but individual block times can vary significantly.
                        If a block has taken longer than usual to be mined, it might be a good time to place your bets as a new block is likely coming soon.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Rewards Tab */}
              <TabsContent value="rewards" className="mt-6 space-y-6">
                <Card className="bg-btc-darker/50 border border-btc-orange/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="text-btc-orange" />
                      <span>Rewards & Bonuses</span>
                    </CardTitle>
                    <CardDescription>Learn about special features and rewards</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80 leading-relaxed">
                      BlockBet offers various rewards and bonus features to enhance your gaming experience and increase your potential earnings.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h3 className="font-medium text-btc-orange mb-2">Winning Streaks</h3>
                        <p className="text-white/70">
                          Win multiple consecutive bets to unlock streak bonuses. Each consecutive win increases your bonus multiplier.
                        </p>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/60">2 consecutive wins</span>
                            <span className="text-btc-orange">+5% bonus</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">3 consecutive wins</span>
                            <span className="text-btc-orange">+10% bonus</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">5+ consecutive wins</span>
                            <span className="text-btc-orange">+20% bonus</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h3 className="font-medium text-btc-orange mb-2">Referral Program</h3>
                        <p className="text-white/70">
                          Invite friends to BlockBet and earn rewards when they start playing.
                        </p>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/60">Friend signs up</span>
                            <span className="text-btc-orange">5,000 sats bonus</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Friend's first deposit</span>
                            <span className="text-btc-orange">1% of deposit amount</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Ongoing earnings</span>
                            <span className="text-btc-orange">0.5% of their bets</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h3 className="font-medium text-btc-orange mb-2">Loyalty Program</h3>
                        <p className="text-white/70">
                          Earn loyalty points for every bet you place, regardless of whether you win or lose.
                          Redeem points for bonuses, free bets, or exclusive merchandise.
                        </p>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/60">Points earned</span>
                            <span className="text-btc-orange">1 point per 10,000 sats bet</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h3 className="font-medium text-btc-orange mb-2">Daily Rewards</h3>
                        <p className="text-white/70">
                          Log in daily to claim free rewards, including bonus sats, multiplier boosts, and more.
                        </p>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/60">Daily login</span>
                            <span className="text-btc-orange">100-1,000 sats</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">7-day streak</span>
                            <span className="text-btc-orange">5,000 sats bonus</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* FAQ Tab */}
              <TabsContent value="faq" className="mt-6 space-y-6">
                <Card className="bg-btc-darker/50 border border-btc-orange/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="text-btc-orange" />
                      <span>Frequently Asked Questions</span>
                    </CardTitle>
                    <CardDescription>Common questions about BlockBet</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h3 className="font-medium text-btc-orange mb-2">How do I know which mining pool mined a block?</h3>
                        <p className="text-white/70">
                          BlockBet uses reliable Bitcoin blockchain APIs to track and verify which mining pool mined each block. This information is publicly available
                          on the blockchain and is displayed in real-time on our platform.
                        </p>
                      </div>
                      
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h3 className="font-medium text-btc-orange mb-2">How long do I have to wait to know if I've won?</h3>
                        <p className="text-white/70">
                          Bitcoin blocks are mined approximately every 10 minutes on average, though the exact time can vary. Once a new block is mined,
                          results are processed immediately and payouts are sent to winners' wallets automatically.
                        </p>
                      </div>
                      
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h3 className="font-medium text-btc-orange mb-2">Can I bet on multiple mining pools at the same time?</h3>
                        <p className="text-white/70">
                          Yes, you can place bets on multiple mining pools for the same block. This strategy increases your chances of winning but reduces your
                          potential profit compared to betting the same amount on a single pool.
                        </p>
                      </div>
                      
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h3 className="font-medium text-btc-orange mb-2">How are the payout multipliers determined?</h3>
                        <p className="text-white/70">
                          Payout multipliers are calculated based on the historical hash rate distribution of mining pools. Pools with higher hash rates have lower multipliers
                          since they're more likely to mine blocks, while pools with lower hash rates have higher multipliers.
                        </p>
                      </div>
                      
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h3 className="font-medium text-btc-orange mb-2">Is BlockBet fair?</h3>
                        <p className="text-white/70">
                          Yes, BlockBet's results are based entirely on the Bitcoin blockchain, which is a transparent and immutable public ledger. The mining pool that mines
                          each block is determined by the blockchain, not by BlockBet, ensuring fair and transparent outcomes.
                        </p>
                      </div>
                      
                      <div className="bg-btc-darker/80 p-4 rounded-lg border border-white/5">
                        <h3 className="font-medium text-btc-orange mb-2">How do I withdraw my winnings?</h3>
                        <p className="text-white/70">
                          You can withdraw your winnings at any time by going to the Wallet section and initiating a withdrawal. Enter your Bitcoin address and the amount
                          you wish to withdraw. Withdrawals are processed within 1 hour, and a small network fee applies.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </BackgroundGradientAnimation>;
};

export default HowToPlay;
