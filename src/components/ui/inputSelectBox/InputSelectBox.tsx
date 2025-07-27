import React from 'react';
import s from './inputSelectBox.module.scss';
import { useFormContext } from 'react-hook-form';
import { SelectBoxData } from '@/features/home/types/input';

type InputSelectBoxProps = {
  id: string;
  optionData: SelectBoxData[];
  name: string;
};

const InputSelectBox = ({ id, optionData, name }: InputSelectBoxProps) => {
  const { register } = useFormContext();
  const isDisabled = optionData.length === 0;

  return (
    <select
      id={id}
      className={s.input_select_box}
      disabled={isDisabled}
      {...register(name)}
    >
      <option value="">選択してください</option>
      {optionData && optionData.length !== 0
        ? optionData.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))
        : null}
    </select>
  );
};

export default InputSelectBox;
