/**
 * 各カレンダー日ごとの収入と支出の合計
 * ホームのカレンダーで使用
 */
export type DailyTransactionSummary = {
  date: number;
  income: number;
  expense: number;
  balance: number;
};

/**
 * ひと月の収支データ
 * ホームのカレンダーで使用
 */
export type MonthlyTransactionData = {
  dailySummaries: DailyTransactionSummary[];
  monthlyTotal: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
};
