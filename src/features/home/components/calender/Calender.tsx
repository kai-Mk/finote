import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import s from './calender.module.scss';
import SelectMonthModal from '../selectMonth/SelectMonthModal';
import { useOutsideClick } from '@/hooks/useOutsideClick';

type CalenderProps = {
  selectedMonth: {
    year: number;
    month: number;
  };
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
  handleSelectedMonth: (newMonth: { year: number; month: number }) => void;
};

const Calender = ({
  selectedMonth,
  handlePreviousMonth,
  handleNextMonth,
  handleSelectedMonth,
}: CalenderProps) => {
  const [isSelectMonthOpen, setIsSelectMonthOpen] = useState(false);

  // モーダルk開閉
  const [isClosing, setIsClosing] = useState(false);
  const handleOpenModal = () => {
    setIsSelectMonthOpen(true);
    setIsClosing(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsSelectMonthOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const modalRef = useOutsideClick(handleClose, isSelectMonthOpen);

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
          <div className={s.select_month_wrapper} ref={modalRef}>
            <button className={s.date_select_button} onClick={handleOpenModal}>
              月を選択
            </button>
            {isSelectMonthOpen && (
              <SelectMonthModal
                selectedMonth={selectedMonth}
                handleSelectedMonth={handleSelectedMonth}
                setIsSelectMonthOpen={setIsSelectMonthOpen}
                handleClose={handleClose}
                isClosing={isClosing}
              />
            )}
          </div>
        </div>
        <button className={s.budget_add_button}>予算の追加</button>
      </div>
    </>
  );
};

export default Calender;
