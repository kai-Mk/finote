import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import s from './calenderContainer.module.scss';
import SelectMonthModal from '../selectMonth/SelectMonthModal';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import Calendar from '../calendar/Calendar';
import { SelectedCalendarMonth, SelectedDate } from '../../types/calendar';
import PrimaryButton from '@/components/ui/primaryButton/PrimaryButton';

type CalenderProps = {
  selectedCalendarMonth: SelectedCalendarMonth;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
  handleSelectedMonth: (newMonth: { year: number; month: number }) => void;
  onDateClick: (year: number, month: number, date: number) => void;
  selectedDate: SelectedDate | null;
};

const CalenderContainer = ({
  selectedCalendarMonth,
  handlePreviousMonth,
  handleNextMonth,
  handleSelectedMonth,
  onDateClick,
  selectedDate,
}: CalenderProps) => {
  const [isSelectMonthOpen, setIsSelectMonthOpen] = useState(false);

  // モーダル開閉
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

  // モーダル外をクリックして閉じる
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
              <span className={s.year_text}>{selectedCalendarMonth.year}</span>
              <span className={s.small_text}>年</span>
              <span className={s.month_text}>
                {selectedCalendarMonth.month}
              </span>
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
            <PrimaryButton
              className={s.date_select_button}
              onButtonClick={handleOpenModal}
              label="月を選択"
            />
            {isSelectMonthOpen && (
              <SelectMonthModal
                selectedCalendarMonth={selectedCalendarMonth}
                handleSelectedMonth={handleSelectedMonth}
                handleClose={handleClose}
                isClosing={isClosing}
              />
            )}
          </div>
        </div>
        <PrimaryButton className={s.budget_add_button} label="予算の追加" />
      </div>
      <Calendar
        selectedCalendarMonth={selectedCalendarMonth}
        onDateClick={onDateClick}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default CalenderContainer;
