// src/utils/useBalance.ts

import { useCallback, useEffect, useState } from "react";

interface WhitelistData {
  minimumWalletBalance: number;
}

const fetchWalletBalance = async (publicKey: string): Promise<number> => {
  const response = await fetch(`/api/balance?publicKey=${publicKey}`);
  if (!response.ok) {
    throw new Error("Failed to fetch balance");
  }
  const data = await response.json();
  return data.balance;
};

export const useWalletBalanceCheck = (
  publicKey: string | null,
  whitelistData: WhitelistData
) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isBalanceHighEnough, setIsBalanceHighEnough] = useState(false);

  const handleBalanceCheck = useCallback(async () => {
    try {
      if (!publicKey) {
        setIsBalanceHighEnough(false);
        setBalance(null);
        return;
      }

      const balanceInSOL = await fetchWalletBalance(publicKey);
      setIsBalanceHighEnough(
        balanceInSOL >= whitelistData.minimumWalletBalance
      );
      setBalance(balanceInSOL);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setIsBalanceHighEnough(false);
      setBalance(null);
    }
  }, [publicKey, whitelistData.minimumWalletBalance]);

  useEffect(() => {
    handleBalanceCheck();
  }, [handleBalanceCheck]);

  // Return an object with both balance and isBalanceHighEnough
  return { balance, isBalanceHighEnough };
};
