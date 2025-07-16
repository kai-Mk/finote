'use client';

import React, { useState } from 'react';
import s from './home.module.scss';
import CalendarContainer from '@/features/home/components/calenderContainer/CalenderContainer';
import { useMonthNavigation } from '@/features/home/hooks/useMonthNavigation';
import { SelectedDate } from '@/features/home/types/calendar';

const Home = () => {
  // カレンダーヘッダーに表示する選択された月の状態を管理
  const {
    selectedCalendarMonth,
    handlePreviousMonth,
    handleNextMonth,
    handleSelectedMonth,
  } = useMonthNavigation();

  // 選択された日付の状態を管理
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const handleDateClick = (year: number, month: number, date: number) => {
    setSelectedDate({ year, month, date });
  };

  return (
    <div className={s.home_container}>
      <div className={s.calender_wrapper}>
        <CalendarContainer
          selectedCalendarMonth={selectedCalendarMonth}
          handlePreviousMonth={handlePreviousMonth}
          handleNextMonth={handleNextMonth}
          handleSelectedMonth={handleSelectedMonth}
          onDateClick={handleDateClick}
          selectedDate={selectedDate}
        />
      </div>
      <div className={s.transaction_detail_wrapper}>
        取引詳細
        <p>
          選択された日付
          <span>{`${selectedDate?.year}年${selectedDate?.month}月${selectedDate?.date}日`}</span>
        </p>
      </div>
    </div>
  );
};

export default Home;
