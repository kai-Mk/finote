export type SelectableDate = {
  years: { value: number }[];
  months: { value: number; disabled: boolean }[];
  days: { value: number; disabled: boolean }[];
};
