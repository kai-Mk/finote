import React, { useEffect } from 'react';
import s from './inputRadioButton.module.scss';
import { useFormContext } from 'react-hook-form';

type InputRadioButtonProps = {
  radioButtonData: { id: string; label: string }[];
  name: string;
};

const InputRadioButton = ({ radioButtonData, name }: InputRadioButtonProps) => {
  const { register, setValue, watch } = useFormContext();

  // 現在の選択値を監視
  const currentValue = watch(name);

  // 初期値として一番上の項目を設定
  useEffect(() => {
    if (radioButtonData && radioButtonData.length > 0 && !currentValue) {
      setValue(name, radioButtonData[0].id);
    }
  }, [radioButtonData, name, setValue, currentValue]);

  return (
    <div className={s.input_radio_button}>
      {radioButtonData && radioButtonData.length !== 0
        ? radioButtonData.map((item) => (
            <label key={item.id} className={s.radio_label} htmlFor={item.id}>
              <input
                type="radio"
                id={item.id}
                className={s.radio_input}
                value={item.id}
                {...register(name)}
              />
              {item.label}
            </label>
          ))
        : null}
    </div>
  );
};

export default InputRadioButton;
