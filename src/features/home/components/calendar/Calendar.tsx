import React from 'react';
import s from './calendar.module.scss';
import { groupDaysByWeeks, WEEK_DAYS } from '../../utils/calendar';
import { SelectedCalendarMonth, SelectedDate } from '../../types/calendar';
import { useCalendarData } from '../../hooks/useCalendarData';
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner';

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

  const { days, loading } = useCalendarData(year, month);

  const weeks = groupDaysByWeeks(days);

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
      {loading ? (
        <div className={s.loading}>
          <LoadingSpinner />
        </div>
      ) : (
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

                    <div className={s.transaction_amount}>
                      {/* 収入表示：存在かつ0でない場合 */}
                      {day.transaction?.income &&
                      day.transaction.income !== 0 ? (
                        <span className={s.income}>
                          +{day.transaction.income.toLocaleString()}円
                        </span>
                      ) : null}

                      {/* 支出表示：存在かつ0でない場合 */}
                      {day.transaction?.expense &&
                      day.transaction.expense !== 0 ? (
                        <span className={s.expense}>
                          -{day.transaction.expense.toLocaleString()}円
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calendar;
