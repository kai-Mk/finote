import { getMonthlyTransactionData } from '../services/transactionService';

/**
 * カレンダー表示用の日別データマップを取得
 */
export const getDailyTransactionMap = async (
  year: number,
  month: number
): Promise<Record<number, { income: number; expense: number }>> => {
  try {
    const data = await getMonthlyTransactionData(year, month);

    const result: Record<number, { income: number; expense: number }> = {};

    data.dailySummaries.forEach((day) => {
      result[day.date] = {
        income: day.income,
        expense: day.expense,
      };
    });

    return result;
  } catch (error) {
    console.error('日別取引マップの取得に失敗:', error);
    return {};
  }
};
