import { isHolidayFromData } from '../services/holidayAPI';
import { CalendarData } from '../types/calendar';
import { getDailyTransactionMap } from './getDailyTransactionMap';

/**
 *
 * カレンダーの日付データを生成する関数
 */
export const generateCalendarDays = async (
  year: number,
  month: number
): Promise<CalendarData[]> => {
  const firstDay = new Date(year, month - 1, 1);
  const startDate = new Date(firstDay);
  const today = new Date();

  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days: CalendarData[] = [];
  const currentDate = new Date(startDate);

  // 日別取引データの取得
  const dailyTransactionMap = await getDailyTransactionMap(year, month);

  // 6週分生成
  for (let i = 0; i < 42; i++) {
    const dateYear = currentDate.getFullYear();
    const dateMonth = currentDate.getMonth() + 1;
    const dateDay = currentDate.getDate();

    const isCurrentMonth = currentDate.getMonth() === month - 1;
    const isToday =
      dateDay === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      dateYear === today.getFullYear();

    // 祝日判定
    const isHoliday = await isHolidayFromData(dateYear, dateMonth, dateDay);

    let income = 0;
    let expense = 0;

    if (isCurrentMonth && dailyTransactionMap[dateDay]) {
      income = dailyTransactionMap[dateDay].income;
      expense = dailyTransactionMap[dateDay].expense;
    }

    days.push({
      date: dateDay,
      isCurrentMonth,
      isToday,
      isSelected: false,
      isHoliday,
      transaction: {
        income,
        expense,
        budget: 0, // 予算は別途管理するため、ここでは0とする
      },
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
};

/**
 * カレンダーの日付配列を生成
 */
export const groupDaysByWeeks = (days: CalendarData[]): CalendarData[][] => {
  const weeks: CalendarData[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
};

/**
 * 曜日のラベル
 */
export const WEEK_DAYS = ['日', '月', '火', '水', '木', '金', '土'];
