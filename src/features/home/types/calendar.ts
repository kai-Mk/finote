export type CalendarData = {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isHoliday: boolean;
  data?: {
    income?: number;
    expense?: number;
    budget?: number;
  };
};

export type SelectedCalendarMonth = {
  year: number;
  month: number;
};

export type SelectedDate = {
  year: number;
  month: number;
  date: number;
};
