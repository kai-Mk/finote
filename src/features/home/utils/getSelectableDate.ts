import { SelectedDate } from '../types/calendar';

export const getSelectableDate = (selectedDate: SelectedDate) => {
  const { year, month, date } = selectedDate;

  // 過去５年分の取得
  const years = [];
  for (let i = 0; i < 5; i++) {
    const SelectableYear = year - i;
    years.push({
      value: SelectableYear,
    });
  }

  // 選択可能な月を取得
  const months = [];
  const currentYear = new Date().getFullYear();
  for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
    const isDisabled = currentYear === year && monthIndex > month;
    months.push({ value: monthIndex, disabled: isDisabled });
  }

  // 選択可能な日を取得
  const days = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const isDisabled = currentYear === year && month === month && day > date;
    days.push({ value: day, disabled: isDisabled });
  }

  return {
    years,
    months,
    days,
  };
};
