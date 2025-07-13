import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import s from './calender.module.scss';

type CalenderProps = {
  selectedMonth: {
    year: number;
    month: number;
  };
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
};

const Calender = ({
  selectedMonth,
  handlePreviousMonth,
  handleNextMonth,
}: CalenderProps) => {
  return (
    <>
      <div className={s.calender_header}>
        <div className={s.date_select_wrapper}>
          <button
            className={s.calender_icon}
            onClick={handlePreviousMonth}
            aria-label="前の月"
            type="button"
          >
            <ChevronLeft size={32} />
          </button>

          <div className={s.calender_text_wrapper}>
            <span className={s.calender_text}>
              <span className={s.year_text}>{selectedMonth.year}</span>
              <span className={s.small_text}>年</span>
              <span className={s.month_text}>{selectedMonth.month}</span>
              <span className={s.small_text}>月</span>
            </span>
          </div>

          <button
            className={s.calender_icon}
            onClick={handleNextMonth}
            aria-label="次の月"
            type="button"
          >
            <ChevronRight size={32} />
          </button>
          <button className={s.date_select_button}>月を選択</button>
        </div>
        <button className={s.budget_add_button}>予算の追加</button>
      </div>
    </>
  );
};

export default Calender;
