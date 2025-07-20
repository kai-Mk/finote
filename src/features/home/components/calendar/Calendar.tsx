import React, { useEffect, useState } from 'react';
import s from './calendar.module.scss';
import {
  generateCalendarDays,
  groupDaysByWeeks,
  WEEK_DAYS,
} from '../../utils/calendar';
import {
  CalendarData,
  SelectedCalendarMonth,
  SelectedDate,
} from '../../types/calendar';
import {
  getDailyTransactionMap,
  getMonthlyTransactionData,
} from '../../services/transactionService';

type CalendarProps = {
  selectedCalendarMonth: SelectedCalendarMonth;
  onDateClick: (year: number, month: number, date: number) => void;
  selectedDate: SelectedDate | null;
};

const Calendar = ({
  selectedCalendarMonth,
  onDateClick,
  selectedDate,
}: CalendarProps) => {
  const { year, month } = selectedCalendarMonth;
  // const days = generateCalendarDays(year, month);
  // const weeks = groupDaysByWeeks(days);
  const [days, setDays] = useState<CalendarData[]>([]);
  const [loading, setLoading] = useState(true);

  // 年月が変更されたときにカレンダーデータを取得
  useEffect(() => {
    const fetchCalendarData = async () => {
      setLoading(true);
      try {
        const [calendarDays, dailyTransactions] = await Promise.all([
          generateCalendarDays(year, month),
          getDailyTransactionMap(year, month),
        ]);
        console.log(dailyTransactions);
        setDays(calendarDays);
      } catch (error) {
        console.error('カレンダーデータの取得に失敗:', error);
        // エラー時は祝日なしのデータを設定
        setDays([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [year, month]);

  const weeks = groupDaysByWeeks(days);

  if (loading) {
    return (
      <div className={s.calendar}>
        <div className={s.loading}>カレンダーを読み込み中...</div>
      </div>
    );
  }

  return (
    <div className={s.calendar}>
      <div className={s.calendar_header}>
        {WEEK_DAYS.map((day, index) => (
          <div
            key={day}
            className={`${s.week_day} ${index === 0 ? s.sunday : ''} ${index === 6 ? s.saturday : ''}`}
          >
            {day}
          </div>
        ))}
      </div>
      {/**カレンダー本体 */}
      <div className={s.calendar_body}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className={s.week}>
            {week.map((day, dayIndex) => {
              const isToday = day.isToday;
              const isSelected =
                year === selectedDate?.year &&
                month === selectedDate?.month &&
                day.date === selectedDate?.date;
              const isCurrentMonth = day.isCurrentMonth;
              const isHoliday = day.isHoliday;
              const dayClass = `${s.day} ${isToday ? s.today : ''} ${isSelected ? s.selected : ''} ${
                isCurrentMonth ? s.current_month : s.other_month
              } ${isHoliday ? s.holiday : ''} ${dayIndex === 0 ? s.sunday : ''} ${dayIndex === 6 ? s.saturday : ''}`;

              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={dayClass}
                  onClick={() =>
                    day.isCurrentMonth && onDateClick?.(year, month, day.date)
                  }
                >
                  <span className={s.date_number}>{day.date}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
