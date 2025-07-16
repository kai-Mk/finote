import { isHolidayFromData } from '../services/holidayAPI';
import { CalendarData } from '../types/calendar';

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

    days.push({
      date: dateDay,
      isCurrentMonth,
      isToday,
      isSelected: false,
      isHoliday,
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
