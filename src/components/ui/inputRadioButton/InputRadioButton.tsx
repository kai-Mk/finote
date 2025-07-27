import React from 'react';
import s from './inputRadioButton.module.scss';

type InputRadioButtonProps = {
  radioButtonData: { id: string; label: string }[];
  radioButtonName: string;
};

const InputRadioButton = ({
  radioButtonData,
  radioButtonName,
}: InputRadioButtonProps) => {
  return (
    <div className={s.input_radio_button}>
      {radioButtonData && radioButtonData.length !== 0
        ? radioButtonData.map((item) => (
            <label key={item.id} className={s.radio_label} htmlFor={item.id}>
              <input
                type="radio"
                id={item.id}
                className={s.radio_input}
                name={radioButtonName}
                value={item.label}
              />
              {item.label}
            </label>
          ))
        : null}
    </div>
  );
};

export default InputRadioButton;
