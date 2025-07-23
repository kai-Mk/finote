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
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const transactionData = await trpcClient.transactions.getAll.query({
      startDate,
      endDate,
      sortBy: 'date',
      sortOrder: 'asc',
    });

    // 日別にグループ化
    const dailyMap = new Map<number, DailyTransactionSummary>();

    // 月の全日付を初期化
    const daysInMonth = new Date(year, month, 0).getUTCDate();
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

      // UTC基準で年月日を取得
      const transactionYear = transactionDate.getUTCFullYear();
      const transactionMonth = transactionDate.getUTCMonth() + 1;
      const day = transactionDate.getUTCDate();

      // 指定された年月のデータのみを処理（安全性のための追加チェック）
      if (transactionYear === year && transactionMonth === month) {
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
      } else {
        console.warn('⚠️ Month/Year mismatch (UTC):', {
          requested: `${year}-${month}`,
          transaction: `${transactionYear}-${transactionMonth}`,
          transactionId: transaction.id,
          transactionDate: transaction.date,
        });
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

/**
 * 指定された日付の取引詳細を取得する関数
 */
export const getTransactionsByDate = async (
  year: number,
  month: number,
  date: number
) => {
  try {
    const startDate = new Date(Date.UTC(year, month - 1, date, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month - 1, date, 23, 59, 59, 999));

    const transactions = await trpcClient.transactions.getAll.query({
      startDate,
      endDate,
      sortBy: 'date',
      sortOrder: 'asc',
    });

    const processedData = (() => {
      if (!transactions || !transactions.transactions) return null;

      const income = transactions.transactions.filter(
        (t) => t.type === 'income'
      );
      const expense = transactions.transactions.filter(
        (t) => t.type === 'expense'
      );

      // 収支別合計
      const incomeTotal = income.reduce((sum, t) => sum + t.amount, 0);
      const expenseTotal = expense.reduce((sum, t) => sum + t.amount, 0);

      return {
        income,
        expense,
        incomeTotal,
        expenseTotal,
      };
    })();

    return {
      transactions,
      income: {
        totalAmount: processedData?.incomeTotal || 0,
        transactions: processedData?.income || [],
      },
      expense: {
        totalAmount: processedData?.expenseTotal || 0,
        transactions: processedData?.expense || [],
      },
    };
  } catch (error) {
    console.error('取引データの取得に失敗しました:', error);
    throw new Error('取引データの取得に失敗しました');
  }
};
