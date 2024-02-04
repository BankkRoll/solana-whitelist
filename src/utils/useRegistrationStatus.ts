// src/utils/useRegistrationStatus.ts

import { isWithinInterval, parseISO } from "date-fns";
import { useCallback, useEffect, useState } from "react";

interface WhitelistData {
  registrationStartDate: string;
  registrationEndDate: string;
}

export const isRegistrationPeriodActive = (
  whitelistData: WhitelistData
): boolean => {
  const currentDate = new Date();
  const startDate = parseISO(whitelistData.registrationStartDate);
  const endDate = parseISO(whitelistData.registrationEndDate);

  return isWithinInterval(currentDate, { start: startDate, end: endDate });
};

export const useRegistrationStatus = (whitelistData: WhitelistData) => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const updateStatus = useCallback(() => {
    setIsRegistrationOpen(isRegistrationPeriodActive(whitelistData));
  }, [whitelistData]);

  useEffect(() => {
    updateStatus();
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, [updateStatus]);

  return isRegistrationOpen;
};
