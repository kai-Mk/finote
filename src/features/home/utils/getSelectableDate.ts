import { SelectedDate } from '../types/calendar';

export const getSelectableDate = (selectedDate: SelectedDate) => {
  const { year, month, date } = selectedDate;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date().getDate();

  // 過去５年分の取得
  const years = [];
  for (let i = 0; i < 5; i++) {
    const SelectableYear = currentYear - i;
    years.push({
      value: SelectableYear,
    });
  }

  // 選択可能な月を取得
  const months = [];
  for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
    const isDisabled = currentYear === year && monthIndex > currentMonth;
    months.push({ value: monthIndex, disabled: isDisabled });
  }

  // 選択可能な日を取得
  const days = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const isDisabled =
      currentYear === year && month === currentMonth && day > currentDate;
    days.push({ value: day, disabled: isDisabled });
  }

  return {
    years,
    months,
    days,
  };
};
