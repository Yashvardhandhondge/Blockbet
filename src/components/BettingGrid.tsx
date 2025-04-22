
const renderStackedChips = (bets: Array<{
  id: string | number;  // Changed from just number to allow both string and number
  amount: number;
}>) => {
  if (bets.length === 0) return null;
  
  const groupedBets: Record<number, Array<{id: string | number; amount: number}>> = {};
  
  bets.forEach(bet => {
    const betAmount = bet.amount;
    if (!groupedBets[betAmount]) {
      groupedBets[betAmount] = [];
    }
    groupedBets[betAmount].push(bet);
  });
  
  const denominations = Object.keys(groupedBets).map(Number).sort((a, b) => b - a);
  
  const displayDenominations = denominations.slice(0, 5);
  const remainingDenominations = denominations.length > 5 ? denominations.length - 5 : 0;
  
  return (
    <div className="absolute bottom-3 right-0 left-0 px-4 flex justify-end">
      <div className="flex flex-row-reverse items-end gap-4 h-12">
        {displayDenominations.map((amount, index) => {
          const betCount = groupedBets[amount].length;
          const stackSize = Math.min(betCount, 4);
          
          return (
            <div 
              key={`stack-${amount}`} 
              className="relative"
              style={{ zIndex: 10 - index }}
            >
              {Array.from({ length: stackSize - 1 }).map((_, stackIndex) => (
                <div 
                  key={`chip-${amount}-${stackIndex}`}
                  className={cn(
                    "rounded-full flex items-center justify-center font-bold text-white shadow-xl w-7 h-7 text-[10px]",
                    getChipColor(amount)
                  )}
                  style={{
                    position: 'absolute',
                    bottom: stackIndex * 4,
                    right: 0,
                    transform: `rotate(${(stackIndex * 5) - 7}deg)`,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="absolute rounded-full border border-white/30 inset-1"></div>
                  <div 
                    className="absolute rounded-full border-dashed inset-0.5 border-2"
                    style={{
                      borderColor: `${getChipSecondaryColor(amount)}`
                    }}
                  ></div>
                </div>
              ))}
              
              <div 
                key={`chip-${amount}`}
                className={cn(
                  "rounded-full flex flex-col items-center justify-center font-bold text-white shadow-xl w-9 h-9 text-base",
                  getChipColor(amount)
                )}
                style={{
                  boxShadow: "0 3px 6px rgba(0,0,0,0.6)",
                  position: stackSize > 1 ? 'relative' : 'relative',
                  bottom: stackSize > 1 ? (stackSize - 1) * 6 : 0,
                  right: 0,
                }}
              >
                <div className="absolute rounded-full border border-white/30 inset-1"></div>
                <div 
                  className="absolute rounded-full border-dashed inset-0.5 border-2"
                  style={{
                    borderColor: `${getChipSecondaryColor(amount)}`
                  }}
                ></div>
                <span className="relative z-10 text-white font-bold drop-shadow-md text-sm">
                  {formatChipValue(amount)}
                </span>
                {betCount > 1 && 
                  <span className="relative z-10 text-white font-semibold drop-shadow-md text-xs -mt-0.5">
                    ×{betCount}
                  </span>
                }
              </div>
            </div>
          );
        })}
        
        {remainingDenominations > 0 && (
          <div className="text-xs text-white/80 font-medium ml-1 bg-black/50 px-1.5 py-0.5 rounded-full shadow-md">
            +{remainingDenominations}
          </div>
        )}
      </div>
    </div>
  );
};
