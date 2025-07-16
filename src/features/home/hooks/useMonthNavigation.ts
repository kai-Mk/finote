'use client';

import { useCallback, useState } from 'react';
import { getCurrentDate, getNextMonth, getPreviousMonth } from '../utils/date';

export const useMonthNavigation = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentDate());

  // 前の月を選択すす
  const handlePreviousMonth = useCallback(() => {
    const previousMonth = getPreviousMonth(selectedMonth);
    setSelectedMonth(previousMonth);
  }, [selectedMonth, setSelectedMonth]);

  // 次の月を選択する
  const handleNextMonth = useCallback(() => {
    const nextMonth = getNextMonth(selectedMonth);
    setSelectedMonth(nextMonth);
  }, [selectedMonth, setSelectedMonth]);

  // 月を選択する
  const handleSelectedMonth = useCallback(
    (newMonth: { year: number; month: number }) => {
      setSelectedMonth(newMonth);
    },
    [setSelectedMonth]
  );

  return {
    selectedCalendarMonth: selectedMonth,
    handlePreviousMonth,
    handleNextMonth,
    handleSelectedMonth,
  };
};
