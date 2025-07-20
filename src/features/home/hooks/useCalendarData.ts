import { useCallback, useEffect, useState } from 'react';
import { CalendarData } from '../types/calendar';
import { generateCalendarDays } from '../utils/calendar';

export const useCalendarData = (year: number, month: number) => {
  const [days, setDays] = useState<CalendarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    try {
      const calendarData = await generateCalendarDays(year, month);
      setDays(calendarData);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'カレンダーデータの取得に失敗しました';
      setError(errorMessage);
      setDays([]);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  // 年月が変更されたときにデータを再取得
  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  // 手動でリフェッチする関数
  const refetch = useCallback(async () => {
    await fetchCalendarData();
  }, [fetchCalendarData]);

  return {
    days,
    loading,
    error,
    refetch,
  };
};
