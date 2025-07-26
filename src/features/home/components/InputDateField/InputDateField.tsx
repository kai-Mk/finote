import React from 'react';
import s from './inputDateField.module.scss';
import { SelectedDate } from '../../types/calendar';
import { getSelectableDate } from '../../utils/getSelectableDate';

type InputDateFieldProps = {
  selectedDate: SelectedDate;
};

const InputDateField = ({ selectedDate }: InputDateFieldProps) => {
  const { years, months, days } = getSelectableDate(selectedDate);

  return (
    <div className={s.input_date_field}>
      <div className={s.selected_date_container}>
        <select className={s.select} defaultValue={selectedDate.year}>
          {years.map((year) => (
            <option key={year.value} value={year.value}>
              {year.value}
            </option>
          ))}
        </select>
        <span className={s.separator}>年</span>
      </div>
      <div className={s.selected_date_container}>
        <select className={s.select} defaultValue={selectedDate.month}>
          {months.map((month) => (
            <option
              key={month.value}
              value={month.value}
              disabled={month.disabled}
            >
              {month.value}
            </option>
          ))}
        </select>
        <span className={s.separator}>月</span>
      </div>
      <div className={s.selected_date_container}>
        <select className={s.select} defaultValue={selectedDate.date}>
          {days.map((day) => (
            <option key={day.value} value={day.value} disabled={day.disabled}>
              {day.value}
            </option>
          ))}
        </select>
        <span className={s.separator}>日</span>
      </div>
    </div>
  );
};

export default InputDateField;
