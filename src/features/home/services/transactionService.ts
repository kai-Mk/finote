import { trpcClient } from '@/lib/trpc';
import {
  DailyTransactionSummary,
  MonthlyTransactionData,
} from '../types/transaction';

/**
 * 一か月の日ごとの収支合計を取得
 * ホームのカレンダーで使用
 */
export const getMonthlyTransactionData = async (
  year: number,
  month: number
): Promise<MonthlyTransactionData> => {
  try {
    // 月の開始日と終了日を計算
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const transactionData = await trpcClient.transactions.getAll.query({
      startDate,
      endDate,
      sortBy: 'date',
      sortOrder: 'asc',
    });

    // 日別にグループ化
    const dailyMap = new Map<number, DailyTransactionSummary>();

    // 月の全日付を初期化
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      dailyMap.set(day, {
        date: day,
        income: 0,
        expense: 0,
        balance: 0,
      });
    }

    // 取引データを日別に集計
    transactionData.transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const day = transactionDate.getDate();

      const existing = dailyMap.get(day);
      if (existing) {
        if (transaction.type === 'income') {
          existing.income += transaction.amount;
        } else {
          existing.expense += transaction.amount;
        }
        existing.balance = existing.income - existing.expense;

        dailyMap.set(day, existing);
      }
    });

    // 月次合計を計算
    const dailySummaries = Array.from(dailyMap.values());
    const monthlyTotal = {
      totalIncome: dailySummaries.reduce((sum, day) => sum + day.income, 0),
      totalExpense: dailySummaries.reduce((sum, day) => sum + day.expense, 0),
      balance: 0,
    };
    monthlyTotal.balance = monthlyTotal.totalIncome - monthlyTotal.totalExpense;

    return {
      dailySummaries,
      monthlyTotal,
    };
  } catch (error) {
    console.error('月次取引サマリーの取得に失敗:', error);
    throw error;
  }
};
