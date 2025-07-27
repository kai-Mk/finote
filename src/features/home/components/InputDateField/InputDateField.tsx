import React, { useState } from 'react';
import s from './inputDateField.module.scss';
import { SelectedDate } from '../../types/calendar';
import { getSelectableDate } from '../../utils/getSelectableDate';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { SelectableDate } from '../../types/input';
import { getFormattedDate } from '../../utils/formatValue';

type InputDateFieldProps = {
  selectedDate: SelectedDate;
  name: string;
};

const InputDateField = ({ selectedDate, name }: InputDateFieldProps) => {
  const [selectableDate, setSelectableDate] = useState<SelectableDate>({
    years: getSelectableDate(selectedDate).years,
    months: getSelectableDate(selectedDate).months,
    days: getSelectableDate(selectedDate).days,
  });

  // react-hook-formのセットアップ
  const { register, setValue, watch } = useFormContext();

  const currentDate = watch(name);
  useEffect(() => {
    const formattedDate = getFormattedDate(
      selectedDate.year,
      selectedDate.month,
      selectedDate.date
    );
    setValue(name, formattedDate);
  }, [selectedDate, name, setValue]);

  // 年、月、日の個別の値を取得
  const currentDateObj = currentDate ? new Date(currentDate) : new Date();
  const currentYear = currentDateObj.getFullYear();
  const currentMonth = currentDateObj.getMonth() + 1;
  const currentDay = currentDateObj.getDate();

  const handleDateChange = (type: 'year' | 'month' | 'day', value: string) => {
    let year = currentYear;
    let month = currentMonth;
    let day = currentDay;
    if (type === 'year') {
      year = parseInt(value);
    } else if (type === 'month') {
      month = parseInt(value);
    } else if (type === 'day') {
      day = parseInt(value);
    }
    const formattedDate = getFormattedDate(year, month, day);
    setValue(name, formattedDate);
    setSelectableDate(getSelectableDate({ year, month, date: day }));
  };

  return (
    <div className={s.input_date_field}>
      <input
        type="hidden"
        value={`${currentDate.year}-${currentDate.month}-${currentDate.date}`}
        {...register(name)}
      />
      <div className={s.selected_date_container}>
        <select
          className={s.select}
          value={currentYear}
          onChange={(e) => handleDateChange('year', e.target.value)}
        >
          {selectableDate.years.map((year) => (
            <option key={year.value} value={year.value}>
              {year.value}
            </option>
          ))}
        </select>
        <span className={s.separator}>年</span>
      </div>
      <div className={s.selected_date_container}>
        <select
          className={s.select}
          value={currentMonth}
          onChange={(e) => handleDateChange('month', e.target.value)}
        >
          {selectableDate.months.map((month) => (
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
        <select
          className={s.select}
          value={currentDay}
          onChange={(e) => handleDateChange('day', e.target.value)}
        >
          {selectableDate.days.map((day) => (
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
