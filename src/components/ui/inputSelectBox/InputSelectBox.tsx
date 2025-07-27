import React from 'react';
import s from './inputSelectBox.module.scss';
import { useFormContext } from 'react-hook-form';

type InputSelectBoxProps = {
  id: string;
  optionData: { value: string; label: string }[];
  name: string;
};

const InputSelectBox = ({ id, optionData, name }: InputSelectBoxProps) => {
  const { register } = useFormContext();

  return (
    <select id={id} className={s.input_select_box} {...register(name)}>
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
