export type SelectableDate = {
  years: { value: number }[];
  months: { value: number; disabled: boolean }[];
  days: { value: number; disabled: boolean }[];
};

export type SelectBoxData = {
  id: number;
  name: string;
};
