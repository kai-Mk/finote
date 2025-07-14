'use client';

import React from 'react';
import s from './home.module.scss';
import Calendar from '@/features/home/components/calender/Calender';
import { useMonthNavigation } from '@/features/home/hooks/useMonthNavigation';

const Home = () => {
  // カレンダーヘッダーに表示する選択された月の状態を管理
  const {
    selectedMonth,
    handlePreviousMonth,
    handleNextMonth,
    handleSelectedMonth,
  } = useMonthNavigation();

  return (
    <div className={s.home_container}>
      <div className={s.calender_wrapper}>
        <Calendar
          selectedMonth={selectedMonth}
          handlePreviousMonth={handlePreviousMonth}
          handleNextMonth={handleNextMonth}
          handleSelectedMonth={handleSelectedMonth}
        />
      </div>
      <div className={s.transaction_detail_wrapper}>取引詳細</div>
    </div>
  );
};

export default Home;
