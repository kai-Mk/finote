import { useEffect, useState } from 'react';
import { SelectedDate } from '../types/calendar';
import { TransactionDetailData } from '../types/transaction';
import { getTransactionsByDate } from '../services/transactionService';

export const useTransitionByDate = (selectedDate: SelectedDate | null) => {
  const [transactionDetailData, setTransactionDetailData] =
    useState<TransactionDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // データ取得関数
  const fetchTransactionsByDate = async () => {
    const { year, month, date } = selectedDate || {};

    if (!year || !month || !date) {
      // 日付が選択されていない場合はデータをクリア
      setTransactionDetailData(null);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { income, expense } = await getTransactionsByDate(
        year,
        month,
        date
      );

      setTransactionDetailData({ income, expense });
    } catch (err) {
      console.error('取引データの取得に失敗しました:', err);
      setError(
        err instanceof Error ? err.message : '取引データの取得に失敗しました'
      );
      setTransactionDetailData(null);
    } finally {
      setLoading(false);
    }
  };

  // selectedDateが変更されたときにデータを取得
  useEffect(() => {
    fetchTransactionsByDate();
  }, [selectedDate]);

  // 手動でデータを再取得する関数
  const refetch = () => {
    fetchTransactionsByDate();
  };

  return {
    transactionDetailData,
    loading,
    error,
    refetch,
  };
};
