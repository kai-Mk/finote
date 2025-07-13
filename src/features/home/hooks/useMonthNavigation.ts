'use client';

import { useCallback, useState } from 'react';
import { getCurrentDate, getNextMonth, getPreviousMonth } from '../utils/date';

export const useMonthNavigation = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentDate());

  const handlePreviousMonth = useCallback(() => {
    const previousMonth = getPreviousMonth(selectedMonth);
    setSelectedMonth(previousMonth);
  }, [selectedMonth, setSelectedMonth]);

  const handleNextMonth = useCallback(() => {
    const nextMonth = getNextMonth(selectedMonth);
    setSelectedMonth(nextMonth);
  }, [selectedMonth, setSelectedMonth]);

  return {
    selectedMonth,
    handlePreviousMonth,
    handleNextMonth,
  };
};
