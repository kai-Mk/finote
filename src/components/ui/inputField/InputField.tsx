import React from 'react';
import s from './inputField.module.scss';

type InputFieldProps = {
  id: string;
  type: string;
  placeholder: string;
  width?: string;
};

const InputField = ({ id, type, placeholder, width }: InputFieldProps) => {
  return (
    <input
      type={type}
      id={id}
      className={s.input_field}
      placeholder={placeholder}
      style={{ width: width }}
    />
  );
};

export default InputField;
