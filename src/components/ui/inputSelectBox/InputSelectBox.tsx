import React from 'react';
import s from './inputSelectBox.module.scss';

type InputSelectBoxProps = {
  id: string;
  optionData: { value: string; label: string }[];
};

const InputSelectBox = ({ id, optionData }: InputSelectBoxProps) => {
  return (
    <select id={id} className={s.input_select_box}>
      <option value="">選択してください</option>
      {optionData && optionData.length !== 0
        ? optionData.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        : null}
    </select>
  );
};

export default InputSelectBox;
