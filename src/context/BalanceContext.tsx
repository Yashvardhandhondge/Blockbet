import React, { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';

interface BalanceContextType {
  walletBalance: number;
  setWalletBalance: Dispatch<SetStateAction<number>>;
}

// Create context with default values
const BalanceContext = createContext<BalanceContextType>({
  walletBalance: 0,
  setWalletBalance: () => {}
});

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState<number>(25000000); // Set initial balance

  return (
    <BalanceContext.Provider value={{ 
      walletBalance, 
      setWalletBalance
    }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => useContext(BalanceContext);