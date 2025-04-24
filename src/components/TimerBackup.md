// Timer-related state
const [timeRemaining, setTimeRemaining] = useState(BETTING_ROUND_DURATION);
const [lastBlockTime, setLastBlockTime] = useState<number | null>(null);
const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

// Load lastBlockTime from localStorage on component mount
useEffect(() => {
  const storedLastBlockTime = localStorage.getItem('lastBlockTime');
  if (storedLastBlockTime) {
    const parsedTime = parseInt(storedLastBlockTime);
    setLastBlockTime(parsedTime);
  } else {
    // Simulate a recent block for first-time visitors
    const simulatedBlockTime = Date.now() - (Math.floor(Math.random() * 60) * 1000);
    localStorage.setItem('lastBlockTime', simulatedBlockTime.toString());
    setLastBlockTime(simulatedBlockTime);
  }
}, []);

// Update and persist lastBlockTime
useEffect(() => {
  if (lastBlockTime) {
    localStorage.setItem('lastBlockTime', lastBlockTime.toString());
  }
}, [lastBlockTime]);

// Timer effect - Update for smoother animation
useEffect(() => {
  if (!lastBlockTime) return;
  
  if (timerIntervalRef.current) {
    clearInterval(timerIntervalRef.current);
  }
  
  const endTime = lastBlockTime + BETTING_ROUND_DURATION * 1000;
  
  const calculateTimeRemaining = () => {
    const now = Date.now();
    const remaining = Math.max(0, (endTime - now) / 1000);
    setTimeRemaining(Math.floor(remaining)); // Floor for display
    
    // Update progress bar with decimal precision for smoother animation
    const elapsedPercent = Math.max(0, Math.min(100, 100 - (remaining / BETTING_ROUND_DURATION * 100)));
    setProgress(elapsedPercent);
    
    if (remaining <= 0 && !isBettingClosed) {
      setIsBettingClosed(true);
      toast({
        title: "Betting round closed",
        description: "Waiting for next block to be mined",
        variant: "destructive"
      });
      console.log('Betting closed at:', new Date().toISOString());
    }
  };
  
  // Initial calculation
  calculateTimeRemaining();
  
  // Update more frequently for smoother animation
  timerIntervalRef.current = setInterval(calculateTimeRemaining, 100); // 10 updates per second
  
  return () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };
}, [lastBlockTime, isBettingClosed]);

// Format time remaining function
const formatTimeRemaining = () => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Timer UI component
<div className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl mb-6 overflow-hidden">
  <div className="flex items-center justify-between px-3 py-2">
    <div className="flex items-center">
      <Clock className="h-4 w-4 text-btc-orange mr-1.5" />
      <span className="text-xs font-medium text-white">Betting closes in:</span>
    </div>
    <div className="flex-grow mx-4 relative">
      {timeRemaining > 0 ? (
        <div className="relative pr-14">
          <Progress 
            value={progress} 
            className="h-2 bg-white/10 rounded-full w-full" 
            indicatorClassName="bg-gradient-to-r from-btc-orange to-yellow-500 transition-[width] duration-100 ease-linear" 
          />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <span className="text-xs font-mono font-bold text-btc-orange tabular-nums">
              {formatTimeRemaining()}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-1">
          <span className="text-xs font-medium bg-gradient-to-r from-btc-orange to-yellow-500 bg-clip-text text-transparent animate-pulse-subtle">
            All bets closed for this round. Please wait for the next block to place new bets.
          </span>
        </div>
      )}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
        <span className="text-xs font-mono font-bold text-btc-orange tabular-nums">
          {timeRemaining > 0 ? formatTimeRemaining() : "0:00"}
        </span>
      </div>
    </div>
  </div>
</div>