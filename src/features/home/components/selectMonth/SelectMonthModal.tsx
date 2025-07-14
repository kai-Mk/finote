import React, { useState } from 'react';
import s from './selectMonth.module.scss';

type SelectedMonthProps = {
  selectedMonth: {
    year: number;
    month: number;
  };
  handleSelectedMonth: (newMonth: { year: number; month: number }) => void;
  setIsSelectMonthOpen: (isOpen: boolean) => void;
  handleClose: () => void;
  isClosing: boolean;
};

const SelectMonthModal = ({
  selectedMonth,
  handleSelectedMonth,
  setIsSelectMonthOpen,
  handleClose,
  isClosing,
}: SelectedMonthProps) => {
  const [newDate, setNewDate] = useState({
    year: selectedMonth.year,
    month: selectedMonth.month,
  });

  // 現在から前後10年間の範囲
  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const months = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ];

  // 選択して閉じる処理
  const handleSelect = () => {
    handleSelectedMonth(newDate);
    handleClose();
  };

  return (
    <div className={`${s.select_month_modal} ${isClosing ? s.closing : ''}`}>
      <div className={s.year_selector}>
        <label htmlFor="" className={s.modal_label}>
          年を選択
        </label>
        <div className={s.year_grid}>
          {yearRange.map((year) => {
            const isCurrent = year === new Date().getFullYear();
            return (
              <button
                key={year}
                className={`${s.year_option} ${newDate.year === year ? s.selected : ''} ${isCurrent ? s.current : ''}`}
                onClick={() => setNewDate({ ...newDate, year })}
                type="button"
              >
                {year}年
              </button>
            );
          })}
        </div>
      </div>
      <div className={s.month_selector}>
        <label htmlFor="" className={s.modal_label}>
          月を選択
        </label>
        <div className={s.month_grid}>
          {months.map((month, index) => {
            const monthNumber = index + 1;
            const isSelected = newDate.month === monthNumber;
            const isCurrent = monthNumber === new Date().getMonth() + 1;

            return (
              <button
                key={monthNumber}
                className={`${s.month_option} ${isSelected ? s.selected : ''} ${isCurrent ? s.current : ''}`}
                onClick={() => setNewDate({ ...newDate, month: monthNumber })}
                type="button"
              >
                {month}
              </button>
            );
          })}
        </div>
      </div>
      <div className={s.select_month_buttons}>
        <button className={s.cancel_button} type="button" onClick={handleClose}>
          キャンセル
        </button>
        <button
          className={s.select_button}
          type="button"
          onClick={handleSelect}
        >
          選択
        </button>
      </div>
    </div>
  );
};

export default SelectMonthModal;
